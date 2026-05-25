const express = require('express');
const router = express.Router();
const { auth, roleCheck } = require('../middleware/auth');
const { requestEnrollment, getMyEnrollments, getTeachersWithQuizzes } = require('../controllers/studentEnrollment.controller');

router.use(auth);
router.use(roleCheck(['student']));

router.post('/request', requestEnrollment);
router.get('/my-requests', getMyEnrollments);
router.get('/teachers', getTeachersWithQuizzes);

module.exports = router;