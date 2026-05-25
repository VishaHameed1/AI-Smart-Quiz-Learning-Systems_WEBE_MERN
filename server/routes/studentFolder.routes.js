const express = require('express');
const router = express.Router();
const { auth, roleCheck } = require('../middleware/auth');
const { getMyFolders, getFolderById, requestFolderAccess, cancelFolderAccessRequest } = require('../controllers/studentFolder.controller');

router.use(auth);
router.use(roleCheck(['student']));

router.get('/', getMyFolders);
router.get('/:id', getFolderById);
router.post('/:folderId/request-access', requestFolderAccess);
router.delete('/:folderId/cancel-request', cancelFolderAccessRequest);

module.exports = router;