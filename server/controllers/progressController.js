const Attempt = require('../models/Attempt');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const User = require('../models/User');

// Helper to calculate mastery for a topic
const calculateTopicMastery = (attempts) => {
  const topicStats = {}; // { topic: { total: N, correct: M } }

  attempts.forEach(attempt => {
    attempt.answers.forEach(answer => {
      const question = answer.questionId; // Assuming questionId is populated or directly contains topic
      if (question && question.topic) {
        if (!topicStats[question.topic]) {
          topicStats[question.topic] = { total: 0, correct: 0 };
        }
        topicStats[question.topic].total++;
        if (answer.isCorrect) {
          topicStats[question.topic].correct++;
        }
      }
    });
  });

  const mastery = {};
  for (const topic in topicStats) {
    mastery[topic] = (topicStats[topic].correct / topicStats[topic].total) * 100;
  }
  return mastery;
};

// @desc    Get student's overall progress overview
// @route   GET /api/progress/overview
const getOverview = async (req, res) => {
  try {
    const userId = req.user._id;

    const attempts = await Attempt.find({ userId, status: 'completed' })
      .populate('quizId', 'title')
      .populate('answers.questionId', 'topic'); // Populate topic for mastery calculation

    const totalQuizzes = attempts.length;
    const totalScore = attempts.reduce((sum, a) => sum + (a.percentageScore || 0), 0);
    const avgScore = totalQuizzes > 0 ? totalScore / totalQuizzes : 0;

    const topicMastery = calculateTopicMastery(attempts);

    const recentPerformance = attempts
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5)
      .map(a => ({
        quizTitle: a.quizId ? a.quizId.title : 'N/A',
        score: a.percentageScore,
        date: a.createdAt,
        xpEarned: a.earnedPoints,
      }));

    res.json({
      success: true,
      data: {
        totalQuizzes,
        avgScore: avgScore.toFixed(2),
        topicMastery,
        recentPerformance,
        // Add more stats like totalXP, level from Gamification model if needed
      }
    });
  } catch (error) {
    console.error('Error fetching progress overview:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get student's activity heatmap data
// @route   GET /api/progress/heatmap
const getHeatmap = async (req, res) => {
  try {
    const userId = req.user._id;
    const attempts = await Attempt.find({ userId, status: 'completed' }).select('createdAt');

    const heatmapData = {};
    attempts.forEach(attempt => {
      const date = attempt.createdAt.toISOString().split('T')[0]; // YYYY-MM-DD
      heatmapData[date] = (heatmapData[date] || 0) + 1;
    });

    res.json({ success: true, data: heatmapData });
  } catch (error) {
    console.error('Error fetching heatmap:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get student's skill gap analysis
// @route   GET /api/progress/skill-gap
const getSkillGap = async (req, res) => {
  try {
    const userId = req.user._id;
    const attempts = await Attempt.find({ userId, status: 'completed' }).populate('answers.questionId', 'topic');
    const topicMastery = calculateTopicMastery(attempts);

    const skillGap = Object.entries(topicMastery)
      .filter(([, mastery]) => mastery < 70) // Example threshold for skill gap
      .sort(([, a], [, b]) => a - b)
      .map(([topic, mastery]) => ({ topic, mastery: mastery.toFixed(2) }));

    res.json({ success: true, data: skillGap });
  } catch (error) {
    console.error('Error fetching skill gap:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getOverview, getHeatmap, getSkillGap };