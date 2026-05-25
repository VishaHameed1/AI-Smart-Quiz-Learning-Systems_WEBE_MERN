const express = require('express');
const router = express.Router();
const { auth, roleCheck } = require('../middleware/auth');
const teacherController = require('../controllers/teacher.controller');

// @route   GET /api/teacher/quizzes
router.get('/quizzes', auth, roleCheck(['teacher', 'admin']), teacherController.getQuizzes);
router.get('/students', auth, roleCheck(['teacher', 'admin']), teacherController.getStudents);
router.get('/report', auth, roleCheck(['teacher', 'admin']), teacherController.getClassReport);

// Analytics
router.get('/analytics/performance-trend', auth, roleCheck(['teacher', 'admin']), teacherController.getPerformanceTrend);
router.get('/analytics/recent-activities', auth, roleCheck(['teacher', 'admin']), teacherController.getRecentActivities);

// Enrollment Management
router.get('/enrollments/pending', auth, roleCheck(['teacher', 'admin']), teacherController.getPendingEnrollmentRequests);
router.put('/enrollments/:id/respond', auth, roleCheck(['teacher', 'admin']), teacherController.respondToEnrollmentRequest);

// Folder Management
router.post('/folders', auth, roleCheck(['teacher', 'admin']), teacherController.createFolder);
router.get('/folders', auth, roleCheck(['teacher', 'admin']), teacherController.getTeacherFolders);
router.put('/folders/:id', auth, roleCheck(['teacher', 'admin']), teacherController.updateFolder);
router.delete('/folders/:folderId/students/:studentId', auth, roleCheck(['teacher', 'admin']), teacherController.removeStudentFromFolder);

module.exports = router;