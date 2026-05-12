const express = require('express');
const { auth, roleCheck } = require('../middleware/auth');
const {
  getStudents,
  getStudentProgress,
  getClassAnalytics
} = require('../controllers/teacher.controller');

const router = express.Router();

// All routes require teacher or admin role
router.use(auth);
router.use(roleCheck(['teacher', 'admin']));

// Get all students
router.get('/students', getStudents);

// Get specific student progress
router.get('/students/:id/progress', getStudentProgress);

// Get class analytics
router.get('/analytics', getClassAnalytics);

module.exports = router;