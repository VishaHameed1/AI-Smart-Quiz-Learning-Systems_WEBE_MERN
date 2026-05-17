const Review = require('../models/Review');
const User = require('../models/User');

// SM-2 algorithm implementation
const scheduleSM2 = (review, quality) => {
  // quality: 0-5
  if (quality < 0 || quality > 5) quality = Math.max(0, Math.min(5, quality));

  if (quality < 3) {
    review.repetitions = 0;
    review.interval = 1;
  } else {
    review.repetitions += 1;
    if (review.repetitions === 1) review.interval = 1;
    else if (review.repetitions === 2) review.interval = 6;
    else review.interval = Math.round(review.interval * review.easeFactor);
    // update ease factor
    review.easeFactor = Math.max(1.3, review.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
  }

  const next = new Date();
  next.setDate(next.getDate() + Math.max(1, Math.round(review.interval)));
  review.nextReview = next;
  review.history.push({ quality, date: new Date() });
  return review;
};

exports.getDueReviews = async (req, res) => {
  try {
    const now = new Date();
    const reviews = await Review.find({ userId: req.user._id, nextReview: { $lte: now } }).limit(50).populate('questionId');
    res.json({ success: true, data: reviews });
  } catch (error) {
    console.error('GetDueReviews Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getDueCount = async (req, res) => {
  try {
    const now = new Date();
    const count = await Review.countDocuments({ userId: req.user._id, nextReview: { $lte: now } });
    res.json({ success: true, data: { count } });
  } catch (error) {
    console.error('GetDueCount Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const total = await Review.countDocuments({ userId: req.user._id });
    const now = new Date();
    const due = await Review.countDocuments({ userId: req.user._id, nextReview: { $lte: now } });
    const mastered = await Review.countDocuments({ userId: req.user._id, repetitions: { $gte: 5 } });
    res.json({ success: true, data: { total, due, mastered } });
  } catch (error) {
    console.error('GetStats Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.submitReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { quality } = req.body; // 0-5

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    if (review.userId.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'Unauthorized' });

    scheduleSM2(review, Number(quality));
    await review.save();

    // Award XP based on quality
    const xpEarned = Math.max(1, Math.round((Number(quality) / 5) * 10));
    const user = await User.findById(req.user._id);
    user.xp = (user.xp || 0) + xpEarned;
    // level up simple logic
    const nextLevelXp = user.level * 100;
    if (user.xp >= nextLevelXp) user.level = Math.min(100, user.level + 1);
    await user.save();

    res.json({ success: true, message: 'Review submitted', data: { review, xpEarned } });
  } catch (error) {
    console.error('SubmitReview Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
