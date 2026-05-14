const cleanupService = require('../services/cleanupService');

// Run full cleanup
exports.runFullCleanup = async (req, res) => {
  try {
    const options = req.body; // Allow custom options via request body
    const result = await cleanupService.runFullCleanup(options);

    res.json(result);
  } catch (error) {
    console.error('Cleanup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to run cleanup',
      error: error.message
    });
  }
};

// Delete old attempts
exports.deleteOldAttempts = async (req, res) => {
  try {
    const daysOld = parseInt(req.params.days) || 365;
    const result = await cleanupService.deleteOldAttempts(daysOld);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Delete old attempts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete old attempts',
      error: error.message
    });
  }
};

// Delete abandoned attempts
exports.deleteAbandonedAttempts = async (req, res) => {
  try {
    const daysOld = parseInt(req.params.days) || 30;
    const result = await cleanupService.deleteAbandonedAttempts(daysOld);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Delete abandoned attempts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete abandoned attempts',
      error: error.message
    });
  }
};

// Delete old review items
exports.deleteOldReviewItems = async (req, res) => {
  try {
    const daysOld = parseInt(req.params.days) || 90;
    const result = await cleanupService.deleteOldReviewItems(daysOld);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Delete old review items error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete old review items',
      error: error.message
    });
  }
};

// Clean progress history
exports.cleanProgressHistory = async (req, res) => {
  try {
    const keepLast = parseInt(req.params.keep) || 50;
    const result = await cleanupService.cleanProgressHistory(keepLast);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Clean progress history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clean progress history',
      error: error.message
    });
  }
};

// Clean expired AI cache
exports.cleanExpiredAICache = async (req, res) => {
  try {
    const result = await cleanupService.cleanExpiredAICache();

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Clean AI cache error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clean AI cache',
      error: error.message
    });
  }
};