const express = require('express');
const router = express.Router();
const { auth, roleCheck } = require('../middleware/auth');
const reviewController = require('../controllers/reviewController');

router.use(auth); // All review routes require authentication
router.use(roleCheck(['student'])); // Only students can access their own review queue

// @route   GET /api/review/due/count
router.get('/due/count', reviewController.getDueCount);

// @route   GET /api/review/stats
router.get('/stats', reviewController.getStats);

// @route   POST /api/review/:reviewId/submit
router.post('/:reviewId/submit', reviewController.submitReview);

// @route   GET /api/review/due-items
router.get('/due-items', reviewController.getDueItems);

module.exports = router;