const express = require('express');
const { auth } = require('../middleware/auth');
const {
  getDueReviews,
  getDueCount,
  addToReviewQueue,
  updateReview
} = require('../controllers/review.controller');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get due reviews
router.get('/due', getDueReviews);

// Get due reviews count
router.get('/due/count', getDueCount);

// Add question to review queue
router.post('/add', addToReviewQueue);

// Update review after answering
router.put('/:id', updateReview);

module.exports = router;