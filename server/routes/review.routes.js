const express = require('express');
const { auth } = require('../middleware/auth');
const {
  getDueReviews,
  addToReviewQueue,
  updateReview
} = require('../controllers/review.controller');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get due reviews
router.get('/due', getDueReviews);

// Add question to review queue
router.post('/add', addToReviewQueue);

// Update review after answering
router.put('/:id', updateReview);

module.exports = router;