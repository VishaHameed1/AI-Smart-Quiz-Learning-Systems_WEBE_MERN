const express = require('express');
const { auth, roleCheck } = require('../middleware/auth');
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserProgress,
  getUserStats
} = require('../controllers/user.controller');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    res.json({ 
      success: true, 
      data: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        avatar: req.user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update current user profile
router.put('/profile', async (req, res) => {
  try {
    const { name, avatar, preferences } = req.body;
    const user = req.user;
    
    if (name) user.name = name;
    if (avatar) user.avatar = avatar;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };
    
    await user.save();
    
    res.json({ 
      success: true, 
      message: 'Profile updated successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        preferences: user.preferences
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin only routes
router.get('/', roleCheck(['admin']), getUsers);
router.delete('/:id', roleCheck(['admin']), deleteUser);

// User specific routes
router.get('/:id', getUserById);
router.put('/:id', roleCheck(['admin']), updateUser);
router.get('/:id/progress', getUserProgress);
router.get('/:id/stats', getUserStats);

module.exports = router;