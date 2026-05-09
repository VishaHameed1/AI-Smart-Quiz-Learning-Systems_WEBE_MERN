 const express = require('express');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Get progress overview
router.get('/overview', protect, async (req, res) => {
  try {
    res.json({ message: 'Progress overview' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get topic-wise progress
router.get('/topic/:topic', protect, async (req, res) => {
  try {
    res.json({ message: `Progress for topic: ${req.params.topic}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
