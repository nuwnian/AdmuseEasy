// Test Seer Auto-Fix Analysis
require('dotenv').config();
const Sentry = require('@sentry/node');

console.log('🤖 Testing Seer Auto-Fix Configuration...');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: 'seer-test',
  release: `admuse-easy@${require('../package.json').version}`,
});

// Test different types of errors that Seer can analyze and potentially fix

console.log('📊 Sending errors for Seer analysis...');

setTimeout(() => {
  // 1. Null reference error (common auto-fix candidate)
  Sentry.withScope((scope) => {
    scope.setTag('error_type', 'null_reference');
    scope.setContext('seer_test', {
      description: 'Testing null reference error analysis',
      fix_difficulty: 'simple',
      expected_suggestion: 'Add null check'
    });
    
    const nullError = new Error('Cannot read property "name" of undefined');
    nullError.stack = `TypeError: Cannot read property 'name' of undefined
    at getUserName (${__filename}:25:12)
    at processUser (${__filename}:30:5)
    at Object.<anonymous> (${__filename}:35:1)`;
    
    Sentry.captureException(nullError);
  });
}, 500);

setTimeout(() => {
  // 2. Database connection error (medium complexity)
  Sentry.withScope((scope) => {
    scope.setTag('error_type', 'database_connection');
    scope.setContext('seer_test', {
      description: 'Testing database connection error analysis',
      fix_difficulty: 'medium',
      expected_suggestion: 'Check connection string and retry logic'
    });
    
    const dbError = new Error('MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017');
    dbError.name = 'MongooseServerSelectionError';
    
    Sentry.captureException(dbError);
  });
}, 1000);

setTimeout(() => {
  // 3. API endpoint error (complex)
  Sentry.withScope((scope) => {
    scope.setTag('error_type', 'api_endpoint');
    scope.setContext('seer_test', {
      description: 'Testing API endpoint error analysis',
      fix_difficulty: 'complex',
      expected_suggestion: 'Review request validation and error handling'
    });
    
    const apiError = new Error('Invalid request body: missing required field "product"');
    apiError.stack = `ValidationError: Invalid request body: missing required field "product"
    at validateInput (${__dirname}/../index.js:180:12)
    at /api/generate-copy (${__dirname}/../index.js:195:5)
    at Layer.handle (express/lib/router/layer.js:95:5)`;
    
    Sentry.captureException(apiError);
  });
}, 1500);

console.log('✅ Test errors sent for Seer analysis!');
console.log('🔍 Check your Sentry dashboard to see Seer\'s suggestions');
console.log('📋 Expected Seer features:');
console.log('   • AI analysis of each error type');
console.log('   • Suggested fixes based on your stopping point setting');
console.log('   • Context-aware recommendations');
console.log('   • Pattern recognition across similar errors');

setTimeout(() => {
  console.log('🎉 Seer configuration test completed!');
  process.exit(0);
}, 3000);