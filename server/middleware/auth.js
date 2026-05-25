const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
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
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined');
      return res.status(500).json({ success: false, message: 'Server authentication is misconfigured' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user in DB
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    
    req.user = user;
    req.userId = user._id;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: error.message || 'Please authenticate' });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey123');

      // Use decoded.id as it's consistently set in generateToken
      const targetId = decoded.id;
      const user = await User.findById(targetId).select('-password');
      
      if (user) {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    next();
  }
};

const roleCheck = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: `Access denied. Required role: ${roles.join(' or ')}` });
    }
    next();
  };
};

module.exports.isAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });
  if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Admin access required' });
  next();
};

module.exports = {
  auth,
  optionalAuth,
  roleCheck,
  isAdmin: module.exports.isAdmin
};