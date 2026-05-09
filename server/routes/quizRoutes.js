const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const quizController = require('../controllers/quizController');

// Public routes (but still need auth for user-specific data)
router.get('/', auth, quizController.getAllQuizzes);
router.get('/:id', auth, quizController.getQuizById);

// Protected routes (require authentication)
router.post('/create', auth, quizController.createQuiz);
router.put('/:id', auth, quizController.updateQuiz);
router.delete('/:id', auth, quizController.deleteQuiz);
router.post('/:id/duplicate', auth, quizController.duplicateQuiz);

module.exports = router;