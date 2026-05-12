const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    console.log('=== AUTH DEBUG ===');
    console.log('1. Token received:', token ? 'YES' : 'NO');
    
    if (!token) {
      console.log('2. No token provided');
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey123');
    console.log('2. Decoded token:', decoded);

    // FIX: Check for both 'id' and 'userId' to be safe
    const targetId = decoded.id || decoded.userId; 
    console.log('3. Looking for user with id:', targetId);
    
    // Find user
    const user = await User.findById(targetId).select('-password');
    console.log('4. User found:', user ? 'YES' : 'NO');
    
    if (!user) {
      console.log('5. User not found in database');
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    
    req.user = user;
    req.userId = user._id;
    req.token = token;
    console.log('6. Auth successful for:', user.email);
    next();
  } catch (error) {
    console.error('AUTH ERROR:', error.message);
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