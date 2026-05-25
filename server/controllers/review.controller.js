const ReviewQueue = require('../models/ReviewQueue.model');
const Attempt = require('../models/Attempt');

// @desc    Get interactive items waiting in the user's active Spaced Review queue
// @route   GET /api/reviews/spaced-queue
const getSpacedQueue = async (req, res) => {
  try {
    const queue = await ReviewQueue.find({
      userId: req.user._id,
      nextReviewDate: { $lte: new Date() }
    }).populate('questionId');
    
    res.json({ success: true, count: queue.length, data: queue });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get count of due reviews
// @route   GET /api/review/due/count
const getDueCount = async (req, res) => {
  try {
    const count = await ReviewQueue.countDocuments({
      userId: req.user._id,
      nextReviewDate: { $lte: new Date() }
    });
    res.json({ success: true, data: { count } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Fetches all past quiz submissions for the logged-in student
// @route   GET /api/reviews/history
const getHistory = async (req, res) => {
  try {
    const history = await Attempt.find({ 
      userId: req.user._id,
      status: { $in: ['completed', 'completed-pending-review'] }
    })
    .populate('quizId', 'title difficulty type')
    .populate('answers.questionId')
    .sort({ createdAt: -1 });

    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

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

module.exports = { 
  getDueReviews: getSpacedQueue, // Alias for backward compatibility if needed
  getSpacedQueue,
  getDueCount,
  getHistory,
  addToReviewQueue, 
  updateReview 
}; 
