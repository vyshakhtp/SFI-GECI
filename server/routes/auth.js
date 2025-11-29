// server/routes/auth.js
import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();
///for delete
// Add this route to your auth.js to create an admin user
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log('Login attempt for:', username);

    if (!username || !password) {
      return res.status(400).json({ 
        message: 'Username and password are required'
      });
    }

    // Find user by username or email
    const user = await User.findOne({ 
      $or: [{ username }, { email: username }],
      isActive: true 
    });

    if (!user) {
      console.log('User not found:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.log('Invalid password for user:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    console.log('Login successful for:', username);
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});



router.post('/create-admin', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      $or: [{ username }, { email }],
      role: 'admin' 
    });
    
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin user already exists' });
    }

    const admin = new User({
      username,
      email,
      password,
      role: 'admin',
      isActive: true
    });

    await admin.save();
    
    res.status(201).json({ 
      message: 'Admin user created successfully',
      user: {
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ message: 'Error creating admin user' });
  }
});




// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout
router.post('/logout', auth, async (req, res) => {
  try {
    res.json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create admin user
router.post('/create-admin', async (req, res) => {
  try {
    const { username, email, password } = req.body || {};

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin user already exists' });
    }

    const admin = new User({
      username,
      email,
      password,
      role: 'admin'
    });

    await admin.save();
    res.status(201).json({ message: 'Admin user created successfully' });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ message: 'Error creating admin user' });
  }
});





// server/routes/auth.js - Add this route
router.get('/test-token', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    console.log('Received token:', token); // Debug log
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log('Decoded token:', decoded); // Debug log
    
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token - user not found' });
    }

    console.log('User found:', user.username, user.role); // Debug log

    res.json({
      message: 'Token is valid',
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Token validation error:', error);
    res.status(401).json({ 
      message: 'Token validation failed', 
      error: error.message 
    });
  }
});


// Add to server/routes/auth.js
router.get('/debug-headers', async (req, res) => {
  console.log('🔍 All request headers:');
  console.log(JSON.stringify(req.headers, null, 2));
  
  const authHeader = req.header('Authorization');
  console.log('📨 Authorization header:', authHeader);
  
  res.json({
    headers: req.headers,
    authorization: authHeader
  });
});
export default router;
