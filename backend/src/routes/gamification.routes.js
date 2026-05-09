 const express = require('express');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Get user gamification stats
router.get('/profile', protect, async (req, res) => {
  try {
    res.json({ message: 'Gamification profile' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get leaderboard
router.get('/leaderboard', protect, async (req, res) => {
  try {
    res.json({ message: 'Leaderboard data' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
