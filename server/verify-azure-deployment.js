#!/usr/bin/env node

// Azure deployment verification script
const fs = require('fs');
const path = require('path');

console.log('🔍 Azure Deployment Verification');
console.log('================================');

// Check current working directory
console.log(`📂 Current directory: ${process.cwd()}`);
console.log(`📂 __dirname: ${__dirname}`);

// Check if we're in production
console.log(`🌍 NODE_ENV: ${process.env.NODE_ENV || 'undefined'}`);
console.log(`🔧 PORT: ${process.env.PORT || 'undefined'}`);

// Check Azure-specific environment variables
console.log(`☁️ WEBSITE_SITE_NAME: ${process.env.WEBSITE_SITE_NAME || 'undefined'}`);
console.log(`☁️ HOME: ${process.env.HOME || 'undefined'}`);

// Check directory structure
const checkDirectory = (dirPath, name) => {
  try {
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      console.log(`✅ ${name} exists: ${dirPath}`);
      console.log(`   Files (${files.length}): ${files.slice(0, 10).join(', ')}${files.length > 10 ? '...' : ''}`);
      return true;
    } else {
      console.log(`❌ ${name} NOT found: ${dirPath}`);
      return false;
    }
  } catch (error) {
    console.log(`💥 Error checking ${name}: ${error.message}`);
    return false;
  }
};

// Check various possible locations for client build
const possiblePaths = [
  { path: path.join(__dirname, 'client'), name: 'Server/client directory' },
  { path: path.join(__dirname, 'client/build'), name: 'Server/client/build directory' },
  { path: path.join(__dirname, 'client/build/index.html'), name: 'Index.html in server/client/build' },
  { path: path.join(__dirname, '../client/build'), name: 'Parent client/build directory' },
  { path: path.join(__dirname, '../client/build/index.html'), name: 'Index.html in parent client/build' },
  { path: '/home/site', name: 'Azure /home/site directory' },
  { path: '/home/site/wwwroot', name: 'Azure wwwroot directory' },
  { path: process.cwd(), name: 'Process working directory' }
];

console.log('\n📁 Directory Structure Check:');
console.log('==============================');

possiblePaths.forEach(({ path: dirPath, name }) => {
  checkDirectory(dirPath, name);
});

// Check specific Azure paths
if (process.env.WEBSITE_SITE_NAME) {
  console.log('\n☁️ Azure-specific checks:');
  console.log('=========================');
  
  // In Azure, the app is typically deployed to /home/site/wwwroot
  const azurePaths = [
    '/home/site/wwwroot',
    '/home/site/wwwroot/client',
    '/home/site/wwwroot/client/build',
    '/home/site/wwwroot/client/build/index.html'
  ];
  
  azurePaths.forEach(azurePath => {
    checkDirectory(azurePath, `Azure path: ${azurePath}`);
  });
}

// Test the paths our app will use
console.log('\n🎯 Application Path Resolution:');
console.log('===============================');

const clientBuildPath = process.env.NODE_ENV === 'production' 
  ? path.join(__dirname, 'client/build')
  : path.join(__dirname, '../client/build');

const indexPath = process.env.NODE_ENV === 'production'
  ? path.join(__dirname, 'client/build/index.html')
  : path.join(__dirname, '../client/build/index.html');

console.log(`📂 Resolved client build path: ${clientBuildPath}`);
console.log(`📄 Resolved index.html path: ${indexPath}`);

checkDirectory(clientBuildPath, 'Resolved client build');
checkDirectory(indexPath, 'Resolved index.html');

console.log('\n🔧 Environment Summary:');
console.log('=======================');
console.log(`Platform: ${process.platform}`);
console.log(`Node version: ${process.version}`);
console.log(`Current user: ${process.env.USER || process.env.USERNAME || 'unknown'}`);

console.log('\n✨ Verification complete!');