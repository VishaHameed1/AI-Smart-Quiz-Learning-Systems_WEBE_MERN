const ReviewQueue = require('../models/ReviewQueue.model');

// @desc    Get due reviews for user
// @route   GET /api/review/due
const getDueReviews = async (req, res) => {
  try {
    const dueReviews = await ReviewQueue.find({
      userId: req.user._id,
      nextReviewDate: { $lte: new Date() }
    }).populate('questionId');
    
    res.json({ success: true, count: dueReviews.length, data: dueReviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add question to review queue
// @route   POST /api/review/add
const addToReviewQueue = async (req, res) => {
  try {
    const { questionId, easeFactor, interval, repetitions } = req.body;
    
    const review = new ReviewQueue({
      userId: req.user._id,
      questionId,
      easeFactor,
      interval,
      repetitions,
      nextReviewDate: new Date()
    });
    
    await review.save();
    res.json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update review after answering
// @route   PUT /api/review/:id
const updateReview = async (req, res) => {
  try {
    const { quality } = req.body;
    const review = await ReviewQueue.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    
    // Update SM-2 algorithm values
    review.quality = quality;
    review.lastReviewed = new Date();
    
    if (quality >= 3) {
      review.repetitions += 1;
      review.interval = review.interval * review.easeFactor;
      review.nextReviewDate = new Date(Date.now() + review.interval * 86400000);
    } else {
      review.repetitions = 0;
      review.interval = 1;
      review.nextReviewDate = new Date(Date.now() + 86400000);
    }
    
    await review.save();
    res.json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDueReviews, addToReviewQueue, updateReview }; 
