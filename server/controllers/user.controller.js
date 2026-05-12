const User = require('../models/User.model');
const Progress = require('../models/Progress.model');
const Attempt = require('../models/Attempt');

// @desc    Get all users (Admin only)
// @route   GET /api/users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/users/profile
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ 
      success: true, 
      data: {
        userId: user._id,        // ✅ Changed from 'id' to 'userId'
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ 
      success: true, 
      data: {
        userId: user._id,        // ✅ Added userId
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update current user profile
// @route   PUT /api/users/profile
const updateCurrentUser = async (req, res) => {
  try {
    const { name, avatar, preferences } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    if (name) user.name = name;
    if (avatar) user.avatar = avatar;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };
    
    await user.save();
    
    res.json({ 
      success: true, 
      message: 'Profile updated successfully',
      data: {
        userId: user._id,        // ✅ Changed from 'id' to 'userId'
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user (Admin only)
// @route   PUT /api/users/:id
const updateUser = async (req, res) => {
  try {
    const { name, email, role, avatar } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (avatar) user.avatar = avatar;
    
    await user.save();
    
    res.json({ 
      success: true, 
      message: 'User updated successfully', 
      data: {
        userId: user._id,        // ✅ Added userId
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Delete user's progress and attempts as well
    await Progress.deleteMany({ userId: user._id });
    await Attempt.deleteMany({ userId: user._id });
    await user.deleteOne();
    
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user progress
// @route   GET /api/users/:id/progress
const getUserProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.params.id });
    res.json({ success: true, data: progress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user stats (quiz stats)
// @route   GET /api/users/:id/stats
const getUserStats = async (req, res) => {
  try {
    const attempts = await Attempt.find({ userId: req.params.id });
    
    const totalAttempts = attempts.length;
    const completedAttempts = attempts.filter(a => a.status === 'completed').length;
    const averageScore = attempts.reduce((sum, a) => sum + (a.percentageScore || 0), 0) / (totalAttempts || 1);
    
    res.json({ 
      success: true, 
      data: {
        totalAttempts,
        completedAttempts,
        averageScore: averageScore.toFixed(2),
        totalXP: req.user?.totalXp || 0
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========== EXPORT ALL CONTROLLERS ==========
module.exports = {
  getUsers,
  getCurrentUser,
  getUserById,
  updateCurrentUser,
  updateUser,
  deleteUser,
  getUserProgress,
  getUserStats
};