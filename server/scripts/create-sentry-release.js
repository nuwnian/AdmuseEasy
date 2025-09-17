#!/usr/bin/env node
/**
 * Sentry Release Management Script
 * This script creates a new release in Sentry and associates it with commits
 * Run this script during your deployment process
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const SENTRY_ORG = process.env.SENTRY_ORG || 'your-org'; // You'll need to set this
const SENTRY_PROJECT = process.env.SENTRY_PROJECT || 'admuse-easy';
const SENTRY_AUTH_TOKEN = process.env.SENTRY_AUTH_TOKEN; // You'll need to create this

function getPackageVersion() {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf8'));
  return packageJson.version;
}

function getGitCommit() {
  try {
    return execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
  } catch (error) {
    console.log('Warning: Could not get git commit hash');
    return 'unknown';
  }
}

function getGitBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
  } catch (error) {
    console.log('Warning: Could not get git branch');
    return 'main';
  }
}

function createSentryRelease() {
  if (!SENTRY_AUTH_TOKEN) {
    console.log('⚠️  SENTRY_AUTH_TOKEN not set. Skipping release creation.');
    console.log('To enable automatic releases:');
    console.log('1. Go to https://sentry.io/settings/auth-tokens/');
    console.log('2. Create a new token with "releases" scope');
    console.log('3. Add SENTRY_AUTH_TOKEN to your .env file');
    return;
  }

  const version = getPackageVersion();
  const commit = getGitCommit();
  const branch = getGitBranch();
  const release = `admuse-easy@${version}`;

  console.log('🚀 Creating Sentry release...');
  console.log(`Release: ${release}`);
  console.log(`Commit: ${commit}`);
  console.log(`Branch: ${branch}`);

  try {
    // Install sentry-cli if not already installed
    console.log('📦 Installing Sentry CLI...');
    execSync('npm install -g @sentry/cli || npm install --save-dev @sentry/cli', { stdio: 'inherit' });

    // Create release
    console.log('📝 Creating release in Sentry...');
    execSync(`npx sentry-cli releases new ${release}`, { 
      env: { 
        ...process.env, 
        SENTRY_ORG, 
        SENTRY_PROJECT, 
        SENTRY_AUTH_TOKEN 
      },
      stdio: 'inherit' 
    });

    // Associate commits with release
    console.log('🔗 Associating commits with release...');
    execSync(`npx sentry-cli releases set-commits ${release} --commit "nuwnian/AdmuseEasy@${commit}"`, { 
      env: { 
        ...process.env, 
        SENTRY_ORG, 
        SENTRY_PROJECT, 
        SENTRY_AUTH_TOKEN 
      },
      stdio: 'inherit' 
    });

    // Finalize release
    console.log('✅ Finalizing release...');
    execSync(`npx sentry-cli releases finalize ${release}`, { 
      env: { 
        ...process.env, 
        SENTRY_ORG, 
        SENTRY_PROJECT, 
        SENTRY_AUTH_TOKEN 
      },
      stdio: 'inherit' 
    });

    console.log(`🎉 Successfully created Sentry release: ${release}`);
    console.log(`🔍 View in Sentry: https://sentry.io/organizations/${SENTRY_ORG}/projects/${SENTRY_PROJECT}/releases/${encodeURIComponent(release)}/`);

  } catch (error) {
    console.error('❌ Failed to create Sentry release:', error.message);
    console.log('Make sure SENTRY_ORG, SENTRY_PROJECT, and SENTRY_AUTH_TOKEN are correctly set.');
  }
}

// Run the script
if (require.main === module) {
  createSentryRelease();
}

module.exports = { createSentryRelease, getPackageVersion, getGitCommit };