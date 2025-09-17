// Quick Sentry verification for your dashboard
require('dotenv').config();
const Sentry = require('@sentry/node');

console.log('🔍 Final Sentry Verification Test');
console.log('DSN Status:', process.env.SENTRY_DSN ? '✅ Configured' : '❌ Missing');

// Initialize Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: 'test-verification',
  tracesSampleRate: 1.0,
});

console.log('🚀 Sending test data to your Sentry dashboard...');

// Send multiple types of events to verify dashboard functionality
setTimeout(() => {
  // Error event
  Sentry.captureException(new Error('✅ AdmuseEasy Sentry Integration Test - Error Tracking Works!'));
  
  // Info message
  Sentry.captureMessage('✅ AdmuseEasy Sentry Integration Test - Message Logging Works!', 'info');
  
  // Warning message
  Sentry.captureMessage('⚠️ AdmuseEasy Sentry Integration Test - Warning Logging Works!', 'warning');
  
  // Custom event with context
  Sentry.withScope((scope) => {
    scope.setTag('test_type', 'integration_verification');
    scope.setContext('app_info', {
      name: 'AdmuseEasy',
      version: '1.0.0',
      environment: 'development'
    });
    scope.setUser({
      id: 'test-user',
      username: 'sentry-test'
    });
    
    Sentry.captureMessage('🎯 AdmuseEasy Sentry Integration Test - Context & Tags Work!', 'info');
  });
  
  console.log('📊 Test events sent! Check your Sentry dashboard at: https://sentry.io');
  console.log('💡 You should see 4 new events in your dashboard within 1-2 minutes');
  
  setTimeout(() => process.exit(0), 1000);
}, 1000);