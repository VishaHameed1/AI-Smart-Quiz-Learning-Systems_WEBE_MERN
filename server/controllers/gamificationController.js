const User = require('../models/User');
const Attempt = require('../models/Attempt');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Simple stats
    const attempts = await Attempt.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(50);
    const quizzesCompleted = attempts.filter(a => a.status === 'completed').length;
    const avgScore = attempts.length ? (attempts.reduce((s, a) => s + (a.percentageScore || 0), 0) / attempts.length) : 0;

    res.json({ success: true, data: {
      xp: user.xp || 0,
      level: user.level || 1,
      badges: user.badges || [],
      streak: user.streak || 0,
      quizzesCompleted,
      avgScore
    }});
  } catch (error) {
    console.error('Gamification Profile Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const top = await User.find().select('name xp level avatar').sort({ xp: -1 }).limit(20);
    res.json({ success: true, data: top });
  } catch (error) {
    console.error('Leaderboard Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.checkBadges = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const badges = [];
    // Perfect Score badge
    const recentAttempts = await Attempt.find({ userId: user._id }).sort({ createdAt: -1 }).limit(20);
    if (recentAttempts.some(a => a.percentageScore === 100)) badges.push({ id: 'perfect', name: 'Perfect Score', description: 'Achieved 100% on a quiz' });

    // Quick Learner: completed under 50% time for any attempt
    if (recentAttempts.some(a => a.timeTaken && a.timeTaken < (a.quizDuration || 0) * 60 * 0.5)) badges.push({ id: 'quick', name: 'Quick Learner', description: 'Completed quiz quickly' });

    // 7-day streak
    if (user.streak >= 7) badges.push({ id: 'streak7', name: '7-Day Streak', description: 'Completed activities 7 days in a row' });

    // Topic Master placeholder: if user has mastery over topics
    if ((user.mastery && Object.values(user.mastery).some(v => v >= 90))) badges.push({ id: 'topic', name: 'Topic Master', description: '90%+ mastery in a topic' });

    // Merge with existing badges to avoid duplicates
    user.badges = Array.isArray(user.badges) ? user.badges : [];
    badges.forEach(b => {
      if (!user.badges.find(x => x.id === b.id)) user.badges.push(b);
    });
    await user.save();

    res.json({ success: true, data: user.badges });
  } catch (error) {
    console.error('CheckBadges Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
