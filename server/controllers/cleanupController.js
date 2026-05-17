const Attempt = require('../models/Attempt');
const Review = require('../models/Review');
const AIQuestionCache = require('../models/AIQuestionCache');

exports.fullCleanup = async (req, res) => {
  try {
    // default thresholds
    await Attempt.deleteMany({ createdAt: { $lt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30) } });
    await Review.deleteMany({ createdAt: { $lt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365) } });
    await AIQuestionCache.deleteMany({ createdAt: { $lt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30) } });
    res.json({ success: true, message: 'Full cleanup executed' });
  } catch (error) {
    console.error('FullCleanup Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteOldAttempts = async (req, res) => {
  try {
    const days = Number(req.params.days) || 30;
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const result = await Attempt.deleteMany({ createdAt: { $lt: cutoff } });
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('DeleteOldAttempts Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteAbandonedAttempts = async (req, res) => {
  try {
    const days = Number(req.params.days) || 7;
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const result = await Attempt.deleteMany({ status: 'in-progress', updatedAt: { $lt: cutoff } });
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('DeleteAbandoned Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteOldReviews = async (req, res) => {
  try {
    const days = Number(req.params.days) || 365;
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const result = await Review.deleteMany({ updatedAt: { $lt: cutoff } });
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('DeleteOldReviews Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteProgressHistory = async (req, res) => {
  try {
    // If Progress model exists, clear history; otherwise respond OK
    res.json({ success: true, message: 'Progress history cleanup not implemented' });
  } catch (error) {
    console.error('DeleteProgressHistory Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteAICache = async (req, res) => {
  try {
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const result = await AIQuestionCache.deleteMany({ createdAt: { $lt: cutoff } });
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('DeleteAICache Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
