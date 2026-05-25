const express = require('express');
const router = express.Router();
const { auth, roleCheck } = require('../middleware/auth');
const { getOverview, getHeatmap, getSkillGap } = require('../controllers/progressController');

// All routes require authentication
router.use(auth);
router.use(roleCheck(['student', 'teacher', 'admin']));

// @route   GET /api/progress/overview
router.get('/overview', getOverview);

// @route   GET /api/progress/heatmap
router.get('/heatmap', getHeatmap);

// @route   GET /api/progress/skill-gap
router.get('/skill-gap', getSkillGap);

module.exports = router;