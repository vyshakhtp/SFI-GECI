// server/middleware/auth.js - Add debug logging
import jwt from 'jsonwebtoken';
import User from '../models/User.js';


export const auth = async (req, res, next) => {
  try {
    console.log('🔐 Auth middleware called');
    const authHeader = req.header('Authorization');
    console.log('📨 Authorization header:', authHeader);
    
    if (!authHeader) {
      console.log('❌ No Authorization header');
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('🔑 Token extracted:', token ? `${token.substring(0, 20)}...` : 'None');

    if (!token) {
      console.log('❌ No token after Bearer');
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log('✅ Token decoded. User ID:', decoded.userId);

    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      console.log('❌ User not found for ID:', decoded.userId);
      return res.status(401).json({ message: 'Token is not valid.' });
    }

    if (!user.isActive) {
      console.log('❌ User is not active:', user.username);
      return res.status(401).json({ message: 'User account is disabled.' });
    }

    console.log('✅ User authenticated:', user.username, 'Role:', user.role);
    req.user = user;
    next();
  } catch (error) {
    console.error('❌ Auth middleware error:', error.message);
    res.status(401).json({ message: 'Token is not valid.' });
  }
};

export const adminAuth = async (req, res, next) => {
  try {
    console.log('👑 Admin auth middleware called');
    await auth(req, res, () => {});
    
    if (!req.user) {
      console.log('❌ No user in request');
      return res.status(401).json({ message: 'Authentication required.' });
    }

    console.log('🔍 Checking user role:', req.user.role);
    if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
      console.log('❌ Insufficient permissions. User role:', req.user.role);
      return res.status(403).json({ 
        message: 'Access denied. Admin privileges required.',
        userRole: req.user.role 
      });
    }

    console.log('✅ Admin access granted for:', req.user.username);
    next();
  } catch (error) {
    console.error('❌ Admin auth middleware error:', error);
    res.status(401).json({ message: 'Authentication failed.' });
  }
};


