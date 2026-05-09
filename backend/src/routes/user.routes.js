 const express = require('express');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Get user profile
router.get('/profile', protect, async (req, res) => {
  try {
    res.json({ message: 'User profile endpoint' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.put('/profile', protect, async (req, res) => {
  try {
    res.json({ message: 'Profile updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
