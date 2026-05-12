const express = require('express');
const { auth } = require('../middleware/auth');
const {
  getUserStats,
  addXP,
  addBadge,
  updateStreak
} = require('../controllers/gamification.controller');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get user stats
router.get('/stats', getUserStats);

// Add XP
router.post('/add-xp', addXP);

// Add badge
router.post('/add-badge', addBadge);

// Update streak
router.post('/update-streak', updateStreak);

module.exports = router;