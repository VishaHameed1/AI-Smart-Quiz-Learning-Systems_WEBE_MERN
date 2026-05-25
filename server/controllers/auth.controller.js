const User = require('../models/User');
const Gamification = require('../models/Gamification.model');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Generate JWT - using 'id' for middleware compatibility
const generateToken = (userId, email, role, expiresIn = '1d') => {
  return jwt.sign(
    { id: userId, email, role },
    process.env.JWT_SECRET,
    { expiresIn }
  );
};

// @desc    Register user
// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Validate role or default to student
    const userRole = ['student', 'teacher', 'admin'].includes(role) ? role : 'student';

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: userRole,
      onboardingCompleted: false
    });

    // Create gamification profile
    await Gamification.create({ userId: user._id });

    // Generate token
    const token = generateToken(user._id, user.email, user.role, '7d');

    res.status(201).json({
      success: true,
      token,
      data: {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        onboardingCompleted: user.onboardingCompleted
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create user (admin only)
// @route   POST /api/auth/create-user
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }
    if (!['student', 'teacher', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role specified' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role
    });

    await Gamification.create({ userId: user._id });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Update last active
    user.lastActive = Date.now();
    await user.save();

    // Generate token
    const expiresIn = rememberMe ? '30d' : '1d';
    const token = generateToken(user._id, user.email, user.role, expiresIn);

    res.json({
      success: true,
      token,
      data: {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        onboardingCompleted: user.onboardingCompleted
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  try {
    // req.user is set by auth middleware
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    console.log(`[AuthMe] User ID: ${user._id}, Name: ${user.name}, Role: ${user.role}`);
    res.json({ 
      success: true, 
      data: {
        userId: user._id,        // ✅ userId for frontend
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        onboardingCompleted: user.onboardingCompleted
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
    await user.save();

    res.json({ 
      success: true, 
      message: 'Password reset email sent',
      resetToken // Remove in production
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    
    const user = await User.findOne({ emailVerificationToken: token });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid token' });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    res.json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update profile
// @route   PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try { 
    const { name, avatar, preferences, role, onboardingCompleted } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (avatar) user.avatar = avatar;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };
    if (role && ['student', 'teacher', 'admin'].includes(role)) user.role = role;
    if (onboardingCompleted !== undefined) user.onboardingCompleted = onboardingCompleted;

    await user.save();

    res.json({ 
      success: true, 
      message: 'Profile updated successfully',
      data: {
        userId: user._id,        // ✅ userId for frontend
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        preferences: user.preferences,
        role: user.role,
        onboardingCompleted: user.onboardingCompleted
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Handle social login (Google/GitHub)
// @route   POST /api/auth/social-login
const socialLogin = async (req, res) => {
  try {
    const { name, email, avatar, provider, providerId } = req.body;

    // Find user by email or provider ID
    let user = await User.findOne({ 
      $or: [{ email }, { [`${provider}Id`]: providerId }] 
    });

    if (!user) {
      // Create new user if they don't exist
      user = await User.create({
        name,
        email,
        avatar,
        role: 'student',
        onboardingCompleted: false,
        [`${provider}Id`]: providerId,
        isEmailVerified: true // Social providers verify emails
      });
      await Gamification.create({ userId: user._id });
    } else {
      // Link provider ID if not already linked
      if (!user[`${provider}Id`]) {
        user[`${provider}Id`] = providerId;
        await user.save();
      }
    }

    const token = generateToken(user._id, user.email, user.role);

    res.json({
      success: true,
      token,
      data: {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        onboardingCompleted: user.onboardingCompleted
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
const logout = async (req, res) => {
  try {
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Logout failed' });
  }
};

// ========== EXPORT ALL CONTROLLERS ==========
module.exports = {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  verifyEmail,
  updateProfile,
  changePassword,
  createUser,
  socialLogin,
  logout
};