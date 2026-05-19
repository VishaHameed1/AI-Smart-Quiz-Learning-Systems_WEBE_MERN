const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { isAdmin } = require('../middleware/auth');
const cleanupController = require('../controllers/cleanupController');

router.post('/full', auth, isAdmin, cleanupController.fullCleanup);
router.delete('/attempts/old/:days', auth, isAdmin, cleanupController.deleteOldAttempts);
router.delete('/attempts/abandoned/:days', auth, isAdmin, cleanupController.deleteAbandonedAttempts);
router.delete('/review/old/:days', auth, isAdmin, cleanupController.deleteOldReviews);
router.delete('/progress/history', auth, isAdmin, cleanupController.deleteProgressHistory);
router.delete('/ai/cache', auth, isAdmin, cleanupController.deleteAICache);

module.exports = router;
