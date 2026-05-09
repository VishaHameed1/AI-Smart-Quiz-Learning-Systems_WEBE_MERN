const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication Middleware
 * Pehle ye check karta hai ke kya Authorization header mojud hai.
 */
module.exports.auth = async (req, res, next) => {
  try {
    // Check for token in header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    // --- TEMPORARY BYPASS (Testing ke liye isey uncomment rakhein) ---
    // Agar aap chahte hain ke bina login ke kaam chale, toh niche wali lines use karein
    /*
    req.user = {
      _id: '67a8b8c8d9e8f9a1b2c3d4e5',
      id: '67a8b8c8d9e8f9a1b2c3d4e5',
      role: 'teacher',
      name: 'Test User',
      email: 'test@example.com'
    };
    return next();
    */
    // -------------------------------------------------------------

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token, authorization denied' });
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