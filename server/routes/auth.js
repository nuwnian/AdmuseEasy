const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const mongoose = require('mongoose');
const User = require('../models/User');

const router = express.Router();

// Database connection check disabled for demo deployment
// const checkDbConnection = (req, res, next) => {
//   console.log('Database connection check - State:', mongoose.connection.readyState);
//   // Temporarily bypass the check to test other functionality
//   next();
// };

// Simple middleware that always passes for demo
const checkDbConnection = (req, res, next) => {
  console.log('Demo mode - bypassing database checks');
  next();
};

// Hybrid register - uses database when available, demo mode as fallback
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('name').trim().isLength({ min: 2 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, name, password } = req.body;

    // Check if we're in demo mode or database is unavailable
    const isDemoMode = process.env.DEMO_MODE === 'true' || mongoose.connection.readyState !== 1;
    
    if (isDemoMode) {
      // Demo mode - create mock user without database
      console.log('🎭 Demo registration for:', email);
      const mockUser = {
        id: 'demo-user-' + Date.now(),
        email,
        name
      };

      // Use a consistent fallback secret for demo mode
      const demoSecret = process.env.JWT_SECRET || 'demo-fallback-secret-for-development-only';
      
      const token = jwt.sign(
        { userId: mockUser.id, email: mockUser.email, name: mockUser.name },
        demoSecret,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        message: 'Demo user created successfully',
        token,
        user: mockUser,
        mode: 'demo'
      });
    }

    // Full mode - use database
    console.log('🔐 Full registration for:', email);
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user with or without password
    const userData = { email, name };
    if (password) {
      userData.password = password;
    }
    
    const user = new User(userData);
    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      },
      mode: 'full'
    });
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error stack:', error.stack);
    console.error('Demo mode status:', process.env.DEMO_MODE);
    console.error('MongoDB connection state:', mongoose.connection.readyState);
    res.status(500).json({ 
      message: 'Server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Hybrid login - uses database when available, demo mode as fallback
router.post('/login', [
  body('email').isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if we're in demo mode or database is unavailable
    const isDemoMode = process.env.DEMO_MODE === 'true' || mongoose.connection.readyState !== 1;
    
    if (isDemoMode) {
      // Demo mode - accept any email, create mock user
      console.log('🎭 Demo login for:', email);
      const mockUser = {
        id: 'demo-user-' + Date.now(),
        email,
        name: email.split('@')[0] // Use part before @ as name
      };

      // Use a consistent fallback secret for demo mode
      const demoSecret = process.env.JWT_SECRET || 'demo-fallback-secret-for-development-only';

      const token = jwt.sign(
        { userId: mockUser.id, email: mockUser.email, name: mockUser.name },
        demoSecret,
        { expiresIn: '7d' }
      );

      return res.json({
        message: 'Demo login successful',
        token,
        user: mockUser,
        mode: 'demo'
      });
    }

    // Full mode - use database
    console.log('🔐 Full login for:', email);
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password if provided and user has password
    if (password && user.password) {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      },
      mode: 'full'
    });
  } catch (error) {
    console.error('Login error:', error);
    console.error('Error stack:', error.stack);
    console.error('Demo mode status:', process.env.DEMO_MODE);
    console.error('MongoDB connection state:', mongoose.connection.readyState);
    res.status(500).json({ 
      message: 'Server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Hybrid OAuth routes - available when not in demo mode and credentials exist
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.DEMO_MODE !== 'true') {
  // Google OAuth routes
  router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  router.get('/google/callback',
    passport.authenticate('google', { session: false }),
    async (req, res) => {
      try {
        // Generate JWT token
        const token = jwt.sign(
          { userId: req.user._id },
          process.env.JWT_SECRET || 'fallback-secret',
          { expiresIn: '7d' }
        );

        // Redirect to frontend with token
        const frontendURL = process.env.WEBSITE_HOSTNAME 
          ? `https://${process.env.WEBSITE_HOSTNAME}` 
          : 'http://localhost:3000';
        res.redirect(`${frontendURL}/auth/success?token=${token}`);
      } catch (error) {
        console.error('OAuth callback error:', error);
        const frontendURL = process.env.WEBSITE_HOSTNAME 
          ? `https://${process.env.WEBSITE_HOSTNAME}` 
          : 'http://localhost:3000';
        res.redirect(`${frontendURL}/auth/error`);
      }
    }
  );
  
  console.log('🔐 Google OAuth routes enabled');
} else {
  console.log('🎭 Google OAuth routes disabled - demo mode or missing credentials');
}

// Auth status endpoint - tells frontend which auth methods are available
router.get('/status', (req, res) => {
  const hasOAuth = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.DEMO_MODE !== 'true');
  const hasDatabase = mongoose.connection.readyState === 1;
  const isDemoMode = process.env.DEMO_MODE === 'true' || !hasDatabase;
  
  res.json({
    modes: {
      demo: true, // Always available as fallback
      oauth: hasOAuth,
      database: hasDatabase
    },
    active_mode: isDemoMode ? 'demo' : 'full',
    demo_mode: isDemoMode
  });
});

// Mock authentication endpoint for demo
router.post('/demo-login', async (req, res) => {
  try {
    const { email, name } = req.body;
    
    // Generate a demo token with mock user data
    const mockUser = {
      id: 'demo-user-' + Date.now(),
      email: email || 'demo@example.com',
      name: name || 'Demo User'
    };
    
    const token = jwt.sign(
      { userId: mockUser.id, email: mockUser.email, name: mockUser.name },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );
    
    res.json({
      message: 'Demo login successful',
      token,
      user: mockUser
    });
  } catch (error) {
    console.error('Demo login error:', error);
    res.status(500).json({ message: 'Demo login failed' });
  }
});

module.exports = router;