const express = require('express');
const router = express.Router();
const { auth, roleCheck } = require('../middleware/auth');
const { getMyFolders, getFolderById } = require('../controllers/studentFolder.controller');

router.use(auth);
router.use(roleCheck(['student']));

router.get('/', getMyFolders);
router.get('/:id', getFolderById);

module.exports = router;