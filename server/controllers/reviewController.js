const ReviewQueue = require('../models/ReviewQueue.model');
const Question = require('../models/Question');

// @desc    Get all due review items for current user
// @route   GET /api/review/due
const getDueItems = async (req, res) => {
  try {
    const dueItems = await ReviewQueue.find({
      userId: req.user._id,
      nextReviewDate: { $lte: new Date() }
    }).populate('questionId');
    res.json({ success: true, data: dueItems });
  } catch (error) {
    console.error('Error fetching due items:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get count of due review items for current user
// @route   GET /api/review/due/count
const getDueCount = async (req, res) => {
  try {
    const count = await ReviewQueue.countDocuments({
      userId: req.user._id,
      nextReviewDate: { $lte: new Date() }
    });
    res.json({ success: true, data: { count } });
  } catch (error) {
    console.error('Error fetching due count:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get review statistics for current user
// @route   GET /api/review/stats
const getStats = async (req, res) => {
  try {
    const totalItems = await ReviewQueue.countDocuments({ userId: req.user._id });
    const dueItems = await ReviewQueue.countDocuments({ userId: req.user._id, nextReviewDate: { $lte: new Date() } });
    const masteredItems = await ReviewQueue.countDocuments({ userId: req.user._id, easeFactor: { $gte: 2.5 } }); // Example mastery threshold

    res.json({ success: true, data: { totalItems, due: dueItems, masteredItems, reviewStreak: 0 } }); // reviewStreak needs more complex logic
  } catch (error) {
    console.error('Error fetching review stats:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit review quality for a specific item
// @route   POST /api/review/:reviewId/submit
const submitReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { quality } = req.body; // 0-5, 5=perfect recall, 0=complete blackout

    const reviewItem = await ReviewQueue.findOne({ _id: reviewId, userId: req.user._id });
    if (!reviewItem) {
      return res.status(404).json({ success: false, message: 'Review item not found or not authorized' });
    }

    // Implement SM-2 algorithm logic here
    // This is a simplified example, a full SM-2 implementation is more complex
    if (quality >= 3) {
      reviewItem.repetitions++; // Increment repetitions
      reviewItem.easeFactor = Math.max(1.3, reviewItem.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))); // Update ease factor
      reviewItem.interval = reviewItem.repetitions === 1 ? 1 : (reviewItem.repetitions === 2 ? 6 : Math.round(reviewItem.interval * reviewItem.easeFactor)); // Calculate new interval
    } else {
      reviewItem.repetitions = 0; // Reset repetitions
      reviewItem.interval = 1; // Reset interval
    }
    reviewItem.nextReviewDate = new Date(Date.now() + reviewItem.interval * 24 * 60 * 60 * 1000);
    await reviewItem.save();

    res.json({ success: true, message: 'Review submitted successfully', data: reviewItem });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDueCount, getStats, submitReview, getDueItems };