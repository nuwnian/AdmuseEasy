#!/usr/bin/env node
/**
 * Deployment Verification Script
 * Checks if all required files are in place for production deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 AdmuseEasy Deployment Verification');
console.log('=====================================\n');

const checks = [
  {
    name: 'Server files',
    path: './index.js',
    required: true
  },
  {
    name: 'Package.json',
    path: './package.json',
    required: true
  },
  {
    name: 'Environment config',
    path: './.env',
    required: false // Optional in production
  },
  {
    name: 'Client build directory',
    path: './client/build',
    required: true
  },
  {
    name: 'Client index.html',
    path: './client/build/index.html',
    required: true
  },
  {
    name: 'Client static assets',
    path: './client/build/static',
    required: true
  },
  {
    name: 'Sentry config',
    path: './config/sentry.js',
    required: true
  },
  {
    name: 'Routes directory',
    path: './routes',
    required: true
  }
];

let allPassed = true;

checks.forEach(check => {
  const fullPath = path.resolve(check.path);
  const exists = fs.existsSync(fullPath);
  
  if (exists) {
    console.log(`✅ ${check.name}: Found at ${check.path}`);
  } else {
    const status = check.required ? '❌' : '⚠️';
    console.log(`${status} ${check.name}: Not found at ${check.path}`);
    if (check.required) allPassed = false;
  }
});

console.log('\n📊 Deployment Status:');
if (allPassed) {
  console.log('🎉 All required files are present - Ready for deployment!');
  
  // Additional checks
  console.log('\n🔧 Additional Information:');
  
  // Check environment
  console.log(`📍 Node Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📍 Current Directory: ${process.cwd()}`);
  
  // Check client build size
  try {
    const buildStats = fs.statSync('./client/build');
    console.log(`📦 Client build created: ${buildStats.mtime.toISOString()}`);
    
    // List build contents
    const buildContents = fs.readdirSync('./client/build');
    console.log(`📂 Build contents: ${buildContents.join(', ')}`);
  } catch (error) {
    console.log('⚠️  Could not read build directory details');
  }
  
  console.log('\n🚀 Server should start successfully!');
  process.exit(0);
} else {
  console.log('❌ Deployment verification failed - missing required files!');
  console.log('\n💡 Common fixes:');
  console.log('   • Run "npm run build" in client directory');
  console.log('   • Ensure GitHub Actions copied build files correctly');
  console.log('   • Check deployment script paths');
  process.exit(1);
}