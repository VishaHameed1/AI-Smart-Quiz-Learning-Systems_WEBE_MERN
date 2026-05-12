const express = require('express');
const { auth, roleCheck } = require('../middleware/auth');
const {
  getStudentDashboard,
  getTeacherDashboard
} = require('../controllers/dashboard.controller');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Student dashboard (any authenticated user)
router.get('/student', getStudentDashboard);

// Teacher dashboard (requires teacher or admin role)
router.get('/teacher', roleCheck(['teacher', 'admin']), getTeacherDashboard);

module.exports = router;