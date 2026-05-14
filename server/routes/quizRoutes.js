const express = require('express');
const router = express.Router();
const { auth, roleCheck } = require('../middleware/auth');
const quizController = require('../controllers/quizController');

// Public routes (require authentication for users)
router.get('/', auth, quizController.getAllQuizzes);
router.get('/:id', auth, quizController.getQuizById);

// Teacher/Admin routes for quiz management
router.post('/create', auth, roleCheck(['teacher', 'admin']), quizController.createQuiz);
router.put('/:id', auth, roleCheck(['teacher', 'admin']), quizController.updateQuiz);
router.delete('/:id', auth, roleCheck(['teacher', 'admin']), quizController.deleteQuiz);
router.post('/:id/duplicate', auth, roleCheck(['teacher', 'admin']), quizController.duplicateQuiz);

module.exports = router;