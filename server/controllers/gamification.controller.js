const Gamification = require('../models/Gamification.model');

// @desc    Get user gamification stats
// @route   GET /api/gamification/stats
const getUserStats = async (req, res) => {
  try {
    let stats = await Gamification.findOne({ userId: req.user._id });
    
    if (!stats) {
      stats = new Gamification({ userId: req.user._id });
      await stats.save();
    }
    
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add XP to user
// @route   POST /api/gamification/add-xp
const addXP = async (req, res) => {
  try {
    const { xp, source } = req.body;
    
    let stats = await Gamification.findOne({ userId: req.user._id });
    if (!stats) {
      stats = new Gamification({ userId: req.user._id });
    }
    
    stats.totalXp += xp;
    
    // Level up logic
    const newLevel = Math.floor(stats.totalXp / 100) + 1;
    if (newLevel > stats.level) {
      stats.level = newLevel;
      stats.leveledUpAt = new Date();
    }
    
    stats.xpHistory.push({ amount: xp, source, date: new Date() });
    await stats.save();
    
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add badge to user
// @route   POST /api/gamification/add-badge
const addBadge = async (req, res) => {
  try {
    const { badgeId, name } = req.body;
    
    const stats = await Gamification.findOne({ userId: req.user._id });
    if (!stats) {
      return res.status(404).json({ success: false, message: 'User stats not found' });
    }
    
    const existingBadge = stats.badges.find(b => b.badgeId === badgeId);
    if (!existingBadge) {
      stats.badges.push({ badgeId, name, earnedAt: new Date() });
      await stats.save();
    }
    
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update streak
// @route   POST /api/gamification/update-streak
const updateStreak = async (req, res) => {
  try {
    const stats = await Gamification.findOne({ userId: req.user._id });
    if (!stats) {
      return res.status(404).json({ success: false, message: 'User stats not found' });
    }
    
    const today = new Date().toDateString();
    const lastActive = stats.lastActiveDate ? new Date(stats.lastActiveDate).toDateString() : null;
    
    if (lastActive === today) {
      // Already counted today
      return res.json({ success: true, data: stats });
    }
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastActive === yesterday.toDateString()) {
      stats.currentStreak += 1;
    } else {
      stats.currentStreak = 1;
    }
    
    if (stats.currentStreak > stats.longestStreak) {
      stats.longestStreak = stats.currentStreak;
    }
    
    stats.lastActiveDate = new Date();
    await stats.save();
    
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getUserStats, addXP, addBadge, updateStreak };