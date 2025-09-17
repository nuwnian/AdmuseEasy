# Sentry Git Provider Integration Guide

## 🎯 Overview
This guide helps you connect your GitHub repository to Sentry for enhanced debugging with code mapping, stack trace linking, and release tracking.

## ✅ What's Already Configured

### 1. **Enhanced Sentry Configuration**
- ✅ Release tracking enabled
- ✅ Repository information in error context
- ✅ Automatic version detection from package.json
- ✅ Git commit/branch tracking

### 2. **Files Created**
- ✅ `scripts/create-sentry-release.js` - Automated release creation
- ✅ `.env.sentry-example` - Configuration template
- ✅ Updated `config/sentry.js` with Git integration

## 🔧 Manual Setup Steps

### Step 1: Connect GitHub to Sentry
1. **Go to Sentry Dashboard**: [https://sentry.io](https://sentry.io)
2. **Navigate to**: Settings → Organization Settings → Integrations
3. **Find GitHub** in the integrations list
4. **Click "Install"** and authorize Sentry
5. **Select Repository**: `nuwnian/AdmuseEasy`

### Step 2: Create Sentry Auth Token
1. **Go to**: [https://sentry.io/settings/auth-tokens/](https://sentry.io/settings/auth-tokens/)
2. **Click "Create New Token"**
3. **Select Scopes**: `releases` (required)
4. **Copy the token** and add to your `.env` file

### Step 3: Update Environment Variables
Add these to your `server/.env` file:

```env
# Sentry Git Integration
SENTRY_ORG=your-org-name
SENTRY_PROJECT=admuse-easy
SENTRY_AUTH_TOKEN=your-token-here
```

To find your `SENTRY_ORG`:
- Look at your Sentry dashboard URL: `https://sentry.io/organizations/YOUR-ORG-NAME/`

## 🚀 Using the Release System

### Automatic Release Creation
Run this command when deploying:

```bash
node server/scripts/create-sentry-release.js
```

### Manual Release Creation
```bash
# Install Sentry CLI
npm install -g @sentry/cli

# Create release
sentry-cli releases new admuse-easy@1.0.0

# Associate commits
sentry-cli releases set-commits admuse-easy@1.0.0 --commit "nuwnian/AdmuseEasy@COMMIT_HASH"

# Finalize release
sentry-cli releases finalize admuse-easy@1.0.0
```

## 🎁 Benefits You'll Get

### 1. **Code Mapping**
- Click on any stack trace line in Sentry
- Jump directly to the exact line in GitHub
- See the actual code that caused the error

### 2. **Release Tracking**
- Track which code version introduced bugs
- See error trends across releases
- Correlate deployments with error spikes

### 3. **Commit Context**
- See which commits are associated with errors
- Track who made changes that caused issues
- Link errors to specific pull requests

### 4. **Enhanced Stack Traces**
- Full file paths linked to GitHub
- Line-by-line code visibility
- Context around the error location

## 🧪 Testing the Integration

### Test Release Creation
```bash
cd server
node scripts/create-sentry-release.js
```

### Test Error with Release Context
```bash
cd server
node -e "
  require('dotenv').config();
  const Sentry = require('@sentry/node');
  Sentry.init({ dsn: process.env.SENTRY_DSN, release: 'admuse-easy@1.0.0' });
  Sentry.captureException(new Error('Test error with Git integration'));
  console.log('Error sent with release context!');
"
```

## 🔍 Verification Checklist

- [ ] GitHub integration installed in Sentry
- [ ] Repository `nuwnian/AdmuseEasy` connected
- [ ] `SENTRY_AUTH_TOKEN` created and added to `.env`
- [ ] `SENTRY_ORG` and `SENTRY_PROJECT` configured
- [ ] Release creation script tested
- [ ] Error appears in Sentry with GitHub links

## 🚨 Troubleshooting

### "Repository not found"
- Ensure GitHub integration is properly installed
- Check that your GitHub account has access to the repository
- Verify repository name is exactly `nuwnian/AdmuseEasy`

### "Auth token invalid"
- Regenerate token with correct scopes (`releases`)
- Check token is added to `.env` without quotes
- Ensure `SENTRY_ORG` matches your organization name

### "Release creation failed"
- Install Sentry CLI: `npm install -g @sentry/cli`
- Check all environment variables are set
- Verify you have git repository with commits

## 📚 Next Steps

1. **Set up CI/CD Integration**: Add release creation to your deployment pipeline
2. **Configure Alerts**: Set up notifications for new releases
3. **Source Maps**: Upload source maps for minified code (React build)
4. **Performance Monitoring**: Enable performance tracking for releases

Your Sentry integration is now ready for production-level debugging! 🎉