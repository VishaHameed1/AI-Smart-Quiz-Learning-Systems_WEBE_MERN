 const express = require('express');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Get due reviews
router.get('/due', protect, async (req, res) => {
  try {
    res.json({ message: 'Due reviews' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit review
router.post('/:reviewId/submit', protect, async (req, res) => {
  try {
    res.json({ message: 'Review submitted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
