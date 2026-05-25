const Gamification = require('../models/Gamification.model');
const User = require('../models/User');

// @desc    Get current user's gamification profile
// @route   GET /api/gamification/profile
const getProfile = async (req, res) => {
  try {
    const gamificationProfile = await Gamification.findOne({ userId: req.user._id });

    if (!gamificationProfile) {
      return res.status(200).json({ success: true, data: { totalXp: 0, level: 1, badges: [], quizzesCompleted: 0, avgScore: 0 } }); // Return default if not found
    }

    res.json({ success: true, data: gamificationProfile });
  } catch (error) {
    console.error('Error fetching gamification profile:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get global leaderboard
// @route   GET /api/gamification/leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Gamification.find()
      .populate('userId', 'name avatar role') // Populate user details
      .sort({ totalXp: -1, level: -1 }) // Sort by XP, then level
      .limit(10); // Top 10 users for a more manageable leaderboard

    const formattedLeaderboard = leaderboard.map(entry => ({
      _id: entry.userId._id,
      name: entry.userId.name,
      avatar: entry.userId.avatar,
      xp: entry.totalXp,
      level: entry.level,
    }));

    res.json({ success: true, data: formattedLeaderboard });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProfile, getLeaderboard };