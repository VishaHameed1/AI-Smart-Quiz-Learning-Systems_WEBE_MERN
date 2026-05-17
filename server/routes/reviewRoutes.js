const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const reviewController = require('../controllers/reviewController');

router.get('/due', auth, reviewController.getDueReviews);
router.get('/due/count', auth, reviewController.getDueCount);
router.get('/stats', auth, reviewController.getStats);
router.post('/:reviewId/submit', auth, reviewController.submitReview);

module.exports = router;
