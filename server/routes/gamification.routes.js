const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { getProfile, getLeaderboard } = require('../controllers/gamificationController');

// All routes require authentication
router.use(auth);

// @route   GET /api/gamification/profile
router.get('/profile', getProfile);

// @route   GET /api/gamification/leaderboard
router.get('/leaderboard', getLeaderboard);

module.exports = router;