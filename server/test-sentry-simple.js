// Simple Sentry test script
require('dotenv').config();
const Sentry = require('@sentry/node');

console.log('Testing Sentry integration...');
console.log('DSN:', process.env.SENTRY_DSN ? 'Configured' : 'Missing');

// Initialize Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: 'test',
  tracesSampleRate: 1.0,
});

console.log('Sentry initialized, triggering test error...');

// Trigger a test error
try {
  throw new Error('🧪 Test error for Sentry - This should appear in your dashboard!');
} catch (error) {
  Sentry.captureException(error);
  console.log('Error captured and sent to Sentry');
}

// Add a message
Sentry.captureMessage('Hello from AdmuseEasy server! Sentry is working correctly.', 'info');

console.log('Test complete - check your Sentry dashboard in a few moments');

// Wait a moment for Sentry to send the data
setTimeout(() => {
  console.log('✅ Sentry test completed');
  process.exit(0);
}, 2000);