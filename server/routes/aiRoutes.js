const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const aiController = require('../controllers/aiController');

// AI routes (require authentication)
router.post('/generate-questions', auth, aiController.generateQuestions);
router.post('/generate-from-text', auth, aiController.generateQuestionsFromText);
router.post('/generate-from-url', auth, aiController.generateQuestionsFromUrl);
router.post('/improve/:questionId', auth, aiController.improveQuestion);
router.post('/explain-answer', auth, aiController.explainAnswer);
router.post('/quiz-summary', auth, aiController.generateQuizSummary);
router.post('/generate-flashcards', auth, aiController.generateFlashcards);

module.exports = router;