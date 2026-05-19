const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { roleCheck } = require('../middleware/auth');
const teacherController = require('../controllers/teacherController');

router.get('/students', auth, roleCheck(['teacher','admin']), teacherController.getStudents);
router.get('/students/:id/progress', auth, roleCheck(['teacher','admin']), teacherController.getStudentProgress);
router.get('/analytics', auth, roleCheck(['teacher','admin']), teacherController.getAnalytics);
router.get('/class/report', auth, roleCheck(['teacher','admin']), teacherController.getClassReport);
router.get('/quizzes', auth, roleCheck(['teacher','admin']), teacherController.getQuizzes);

module.exports = router;
