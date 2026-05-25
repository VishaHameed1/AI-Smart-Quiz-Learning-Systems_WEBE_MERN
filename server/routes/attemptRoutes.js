const express = require('express');
const router = express.Router();
const { auth, roleCheck } = require('../middleware/auth');
const attemptController = require('../controllers/attemptController');

// Protected routes
router.post('/quiz/:quizId/start', auth, attemptController.startQuiz);
router.post('/:attemptId/submit-answer', auth, attemptController.submitAnswer);
router.post('/:attemptId/complete', auth, attemptController.completeQuiz);
router.get('/:attemptId/results', auth, attemptController.getQuizResults);
router.get('/user/my-attempts', auth, attemptController.getUserAttempts);
router.patch('/:attemptId/answers/:answerId/grade', auth, roleCheck(['teacher', 'admin']), attemptController.gradeTheoreticalAnswer);

module.exports = router;