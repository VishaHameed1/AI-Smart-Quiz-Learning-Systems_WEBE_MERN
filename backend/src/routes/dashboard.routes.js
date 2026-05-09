 const express = require('express');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Student dashboard
router.get('/student', protect, async (req, res) => {
  try {
    res.json({ message: 'Student dashboard data' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Teacher dashboard
router.get('/teacher', protect, async (req, res) => {
  try {
    res.json({ message: 'Teacher dashboard data' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
