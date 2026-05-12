const express = require('express');
const { 
  register, 
  login, 
  getMe, 
  forgotPassword, 
  resetPassword, 
  verifyEmail, 
  updateProfile, 
  changePassword 
} = require('../controllers/auth.controller');
const { auth } = require('../middleware/auth');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation.middleware');
const { authLimiter } = require('../middleware/rateLimit.middleware');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

const forgotPasswordValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  validate
];

const resetPasswordValidation = [
  body('token').notEmpty().withMessage('Token is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate
];

const updateProfileValidation = [
  body('name').optional().notEmpty(),
  body('avatar').optional().isURL(),
  validate
];

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  validate
];

// ========== PUBLIC ROUTES ==========
router.post('/register', registerValidation, register);
router.post('/login', authLimiter, loginValidation, login);
router.post('/forgot-password', forgotPasswordValidation, forgotPassword);
router.post('/reset-password', resetPasswordValidation, resetPassword);
router.get('/verify-email/:token', verifyEmail);

// ========== PROTECTED ROUTES (require auth) ==========
router.get('/me', auth, getMe);
router.put('/profile', auth, updateProfileValidation, updateProfile);
router.put('/change-password', auth, changePasswordValidation, changePassword);

module.exports = router;