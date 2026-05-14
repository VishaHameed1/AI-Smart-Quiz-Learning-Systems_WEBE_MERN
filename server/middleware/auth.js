const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey123');
    const targetId = decoded.id; 

    const user = await User.findById(targetId).select('-password');
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
      
      // FIX: Apply same flexible ID check here
      const targetId = decoded.id || decoded.userId;
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

module.exports = { auth, roleCheck, optionalAuth };