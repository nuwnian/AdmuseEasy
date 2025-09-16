// Test Sentry Integration
// Visit http://localhost:5000/api/test-sentry to trigger an error

const express = require('express');
const router = express.Router();

// Test Sentry error tracking
router.get('/test-sentry', (req, res) => {
  console.log('Testing Sentry error tracking...');
  
  // Intentionally throw an error to test Sentry
  const testError = new Error('🧪 This is a test error for Sentry tracking');
  testError.stack = 'TestError: MongoDB connection timeout during OAuth login\n' +
                   '    at /api/auth/login (auth.js:75:12)\n' +
                   '    at User.findOne (mongoose:543:8)';
  
  throw testError;
});

// Test MongoDB connection error simulation
router.get('/test-mongo-error', async (req, res) => {
  try {
    // Simulate the exact MongoDB error you're experiencing
    const mongoError = new Error('MongooseServerSelectionError: Could not connect to any servers in your MongoDB Atlas cluster');
    mongoError.name = 'MongooseServerSelectionError';
    mongoError.cause = 'IP whitelist issue';
    
    throw mongoError;
  } catch (error) {
    console.error('Simulated MongoDB error:', error.message);
    
    // If Sentry is configured, it will catch this
    res.status(503).json({ 
      error: 'Database connection failed',
      message: error.message,
      suggestion: 'Check MongoDB Atlas IP whitelist'
    });
  }
});

// Test successful response
router.get('/test-success', (req, res) => {
  res.json({ 
    message: '✅ Server is working correctly',
    timestamp: new Date().toISOString(),
    sentry: process.env.SENTRY_DSN ? 'Configured' : 'Not configured'
  });
});

module.exports = router;