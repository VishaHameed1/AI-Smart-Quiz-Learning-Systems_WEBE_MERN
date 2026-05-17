const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const gamificationController = require('../controllers/gamificationController');

router.get('/profile', auth, gamificationController.getProfile);
router.get('/leaderboard', gamificationController.getLeaderboard);
router.post('/check-badges', auth, gamificationController.checkBadges);

module.exports = router;
