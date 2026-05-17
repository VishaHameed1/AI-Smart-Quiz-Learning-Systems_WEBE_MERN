const Attempt = require('../models/Attempt');
const Question = require('../models/Question');

exports.getOverview = async (req, res) => {
  try {
    const userId = req.user._id;
    const attempts = await Attempt.find({ userId }).sort({ createdAt: -1 }).limit(50).populate('quizId');

    const last7 = attempts.slice(0, 7).map(a => ({ date: a.createdAt, score: a.percentageScore || 0 }));
    const quizzesCompleted = attempts.filter(a => a.status === 'completed').length;
    const avgScore = attempts.length ? attempts.reduce((s, a) => s + (a.percentageScore || 0), 0) / attempts.length : 0;

    // Topic mastery simple aggregation from attempts' answers is heavy; return empty for now
    const topicMastery = {};

    res.json({ success: true, data: { recentPerformance: last7, quizzesCompleted, avgScore, topicMastery } });
  } catch (error) {
    console.error('Progress Overview Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getTopic = async (req, res) => {
  try {
    const { topic } = req.params;
    const attempts = await Attempt.find({ userId: req.user._id, 'answers.questionId': { $exists: true } }).populate('answers.questionId');
    // compute mastery for topic
    let attempted = 0, correct = 0;
    attempts.forEach(attempt => {
      attempt.answers.forEach(a => {
        if (a.questionId && a.questionId.topic === topic) {
          attempted++;
          if (a.isCorrect) correct++;
        }
      });
    });
    const mastery = attempted ? Math.round((correct / attempted) * 100) : 0;
    res.json({ success: true, data: { topic, mastery, attempted, correct } });
  } catch (error) {
    console.error('GetTopic Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const attempts = await Attempt.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(200).populate('quizId');
    const history = attempts.map(a => ({ date: a.createdAt, quiz: a.quizId?.title || 'Quiz', score: a.percentageScore || 0, xp: a.earnedPoints || 0 }));
    res.json({ success: true, data: history });
  } catch (error) {
    console.error('GetHistory Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getHeatmap = async (req, res) => {
  try {
    const attempts = await Attempt.find({ userId: req.user._id }).sort({ createdAt: -1 });
    const map = {};
    attempts.forEach(a => {
      const day = a.createdAt.toISOString().slice(0,10);
      map[day] = (map[day] || 0) + 1;
    });
    res.json({ success: true, data: map });
  } catch (error) {
    console.error('GetHeatmap Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getSkillGap = async (req, res) => {
  try {
    // simple weak topics where mastery < 50
    const attempts = await Attempt.find({ userId: req.user._id }).populate('answers.questionId');
    const topicStats = {};
    attempts.forEach(attempt => {
      attempt.answers.forEach(a => {
        const topic = a.questionId?.topic || 'unknown';
        topicStats[topic] = topicStats[topic] || { attempted: 0, correct: 0 };
        topicStats[topic].attempted++;
        if (a.isCorrect) topicStats[topic].correct++;
      });
    });
    const weak = Object.entries(topicStats).map(([topic, s]) => ({ topic, mastery: s.attempted ? Math.round((s.correct/s.attempted)*100) : 0 })).filter(t => t.mastery < 50);
    res.json({ success: true, data: weak });
  } catch (error) {
    console.error('GetSkillGap Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
