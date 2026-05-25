const express = require('express');
const router = express.Router();
const { 
    generateQuestions, 
    generateQuestionsFromText, 
    generateQuestionsFromUrl, 
    improveQuestion, 
    explainAnswer, 
    generateQuizSummary, 
    generateFlashcards 
} = require('../controllers/aiController');
const { auth, roleCheck } = require('../middleware/auth');

router.post('/generate-questions', auth, roleCheck(['teacher', 'admin']), generateQuestions);
router.post('/generate-from-text', auth, roleCheck(['teacher', 'admin']), generateQuestionsFromText);
router.post('/generate-from-url', auth, roleCheck(['teacher', 'admin']), generateQuestionsFromUrl);
router.post('/improve/:questionId', auth, roleCheck(['teacher', 'admin']), improveQuestion);
router.post('/explain-answer', auth, explainAnswer);
router.post('/quiz-summary', auth, generateQuizSummary);
router.post('/generate-flashcards', auth, generateFlashcards);

module.exports = router;