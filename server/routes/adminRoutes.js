const express = require('express');
const router = express.Router();
const { auth, roleCheck } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

router.get('/users', auth, roleCheck(['admin']), adminController.getAllUsers);
router.get('/users/:id', auth, roleCheck(['admin']), adminController.getUserById);
router.post('/users', auth, roleCheck(['admin']), adminController.createUser);
router.put('/users/:id', auth, roleCheck(['admin']), adminController.updateUser);
router.delete('/users/:id', auth, roleCheck(['admin']), adminController.deleteUser);

module.exports = router;
