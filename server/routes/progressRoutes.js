const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const progressController = require('../controllers/progressController');

router.get('/overview', auth, progressController.getOverview);
router.get('/topic/:topic', auth, progressController.getTopic);
router.get('/history', auth, progressController.getHistory);
router.get('/heatmap', auth, progressController.getHeatmap);
router.get('/skill-gap', auth, progressController.getSkillGap);

module.exports = router;
