const express = require('express');
const { auth } = require('../middleware/auth');
const {
  getUserProgress,
  updateTopicProgress,
  getTopicMastery
} = require('../controllers/progress.controller');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get user's complete progress
router.get('/', getUserProgress);

// Get topic mastery
router.get('/mastery', getTopicMastery);

// Update progress for a specific topic
router.post('/topic', updateTopicProgress);

module.exports = router;