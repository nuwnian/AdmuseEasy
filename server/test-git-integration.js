// Test Sentry Git Integration
require('dotenv').config();
const Sentry = require('@sentry/node');

console.log('🔗 Testing Sentry Git Provider Integration...');

// Initialize with Git context
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: 'git-integration-test',
  release: `admuse-easy@${require('../package.json').version}`,
});

// Set Git context using newer Sentry API
Sentry.withScope((scope) => {
  scope.setTag('integration_test', 'git-provider');
  scope.setContext('repository', {
    name: 'nuwnian/AdmuseEasy',
    url: 'https://github.com/nuwnian/AdmuseEasy',
    branch: 'main',
    commit: 'test-commit-hash'
  });
  scope.setUser({
    id: 'test-user',
    username: 'git-integration-tester'
  });

  console.log('📊 Sending test error with Git context...');

  // Create an error that will show Git integration features
  const gitIntegrationError = new Error('🔗 Git Integration Test - Stack trace should link to GitHub!');
  gitIntegrationError.stack = `Error: Git Integration Test - Stack trace should link to GitHub!
    at testGitIntegration (${__filename}:35:7)
    at Object.<anonymous> (${__filename}:42:1)
    at Module._compile (node:internal/modules/cjs/loader:1358:14)
    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1416:10)`;

  Sentry.captureException(gitIntegrationError);
});

console.log('✅ Test error sent with Git integration context!');
console.log('🔍 Check your Sentry dashboard - the stack trace should now link to GitHub');
console.log('📋 Expected features:');
console.log('   • Stack trace lines should be clickable');
console.log('   • Links should go to GitHub code');
console.log('   • Error should show repository context');
console.log('   • Release information should be visible');

setTimeout(() => {
  console.log('🎉 Git integration test completed!');
  process.exit(0);
}, 2000);