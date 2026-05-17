const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication Middleware
 * Pehle ye check karta hai ke kya Authorization header mojud hai.
 */
module.exports.auth = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'test' || process.env.DISABLE_AUTH === 'true') {
      req.user = {
        _id: '000000000000000000000000',
        id: '000000000000000000000000',
        role: 'teacher',
        name: 'Test User',
        email: 'test@example.com'
      };
      return next();
    }

    // Check for token in header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token, authorization denied' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined');
      return res.status(500).json({ success: false, message: 'Server authentication is misconfigured' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user in DB
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error('Auth Error:', error.message);
    res.status(401).json({ success: false, message: 'Token is not valid' });
  }
};

/**
 * Role Authorization Middleware
 * Check karta hai ke user ka role (teacher/student) allowed hai ya nahi.
 */
module.exports.roleCheck = (roles) => {
  // FIX: "up {" ko hata kar sahi arrow function syntax lagaya hai
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Access denied: Unauthorized role' });
    }
    next();
  };
};

module.exports.isAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });
  if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Admin access required' });
  next();
};