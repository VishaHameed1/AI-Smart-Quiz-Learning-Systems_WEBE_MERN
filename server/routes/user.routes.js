const express = require('express');
const { auth, roleCheck } = require('../middleware/auth');
const {
  getUsers,
  getUserById,
  getCurrentUser,
  updateCurrentUser,
  updateUser,
  deleteUser,
  getUserProgress,
  getUserStats
} = require('../controllers/user.controller');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get current user profile
router.get('/profile', getCurrentUser);

// Update current user profile
router.put('/profile', updateCurrentUser);

// Admin only routes
router.get('/', roleCheck(['admin']), getUsers);
router.delete('/:id', roleCheck(['admin']), deleteUser);

// User specific routes
router.get('/:id', getUserById);
router.put('/:id', roleCheck(['admin']), updateUser);
router.get('/:id/progress', getUserProgress);
router.get('/:id/stats', getUserStats);

module.exports = router;