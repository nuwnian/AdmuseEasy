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

// Demo register - no database, just returns success
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('name').trim().isLength({ min: 2 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, name } = req.body;

    // Demo mode - create mock user without database
    const mockUser = {
      id: 'demo-user-' + Date.now(),
      email,
      name
    };

    // Generate token
    const token = jwt.sign(
      { userId: mockUser.id, email: mockUser.email, name: mockUser.name },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Demo user created successfully',
      token,
      user: mockUser
    });
  } catch (error) {
    console.error('Demo registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Demo login - no database, accepts any email
router.post('/login', [
  body('email').isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    // Demo mode - accept any email, create mock user
    const mockUser = {
      id: 'demo-user-' + Date.now(),
      email,
      name: email.split('@')[0] // Use part before @ as name
    };

    // Generate token
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
    res.status(500).json({ message: 'Server error' });
  }
});

// Google OAuth routes disabled for demo deployment
/* 
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
*/

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