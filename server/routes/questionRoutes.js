const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const questionController = require('../controllers/questionController');

// Protected routes
router.post('/quiz/:quizId/add', auth, questionController.addQuestion);
router.post('/quiz/:quizId/bulk', auth, questionController.bulkUploadQuestions);
router.put('/:id', auth, questionController.updateQuestion);
router.delete('/:id', auth, questionController.deleteQuestion);
router.get('/topic/:topic', auth, questionController.getQuestionsByTopic);

module.exports = router;