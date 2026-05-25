const express = require('express');
const { auth } = require('../middleware/auth');
const {
  getDueReviews,
  getSpacedQueue,
  getDueCount,
  getHistory,
  addToReviewQueue,
  updateReview
} = require('../controllers/review.controller');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get due reviews (legacy support)
router.get('/due', getDueReviews);

// Performance Review Dashboard routes
router.get('/spaced-queue', getSpacedQueue);
router.get('/history', getHistory);

// Get due reviews count
router.get('/due/count', getDueCount);

// Add question to review queue
router.post('/add', addToReviewQueue);

// Submit/Update review after answering (supports both POST and PUT)
router.post('/:id/submit', updateReview);
router.put('/:id', updateReview);

module.exports = router;