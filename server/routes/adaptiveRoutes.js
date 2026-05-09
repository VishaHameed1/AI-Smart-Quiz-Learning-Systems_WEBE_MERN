const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const adaptiveController = require('../controllers/adaptiveController');

// Adaptive learning routes
router.post('/attempt/:attemptId/next', auth, adaptiveController.getNextQuestion);
router.get('/user/:userId/skill-level', auth, adaptiveController.getUserSkillLevel);
router.put('/question/:questionId/difficulty', auth, adaptiveController.updateQuestionDifficulty);

module.exports = router;