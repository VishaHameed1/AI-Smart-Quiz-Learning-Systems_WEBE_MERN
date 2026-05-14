const express = require('express');
const router = express.Router();
const cleanupController = require('../controllers/cleanupController');

// All cleanup routes require admin privileges - you might want to add admin middleware
// For now, using regular auth, but in production add admin check

// Run full cleanup
router.post('/full', cleanupController.runFullCleanup);

// Delete old attempts (default 365 days)
router.delete('/attempts/old/:days?', cleanupController.deleteOldAttempts);

// Delete abandoned attempts (default 30 days)
router.delete('/attempts/abandoned/:days?', cleanupController.deleteAbandonedAttempts);

// Delete old review items (default 90 days)
router.delete('/review/old/:days?', cleanupController.deleteOldReviewItems);

// Clean progress history (keep last N entries, default 50)
router.delete('/progress/history/:keep?', cleanupController.cleanProgressHistory);

// Clean expired AI cache
router.delete('/ai/cache', cleanupController.cleanExpiredAICache);

module.exports = router;