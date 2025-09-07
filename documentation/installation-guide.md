# AdmuseEasy Installation Guide

## 📋 Requirements

- **Node.js** 16+ (Download from nodejs.org)
- **npm** (comes with Node.js)
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

## 🚀 Step-by-Step Installation

### Step 1: Extract Files
1. Extract the downloaded ZIP file
2. Open terminal/command prompt
3. Navigate to the extracted folder

### Step 2: Install Backend Dependencies
```bash
cd server
npm install
```

### Step 3: Install Frontend Dependencies
```bash
cd ../client
npm install
```

### Step 4: Configure Environment (Optional)
```bash
cd ../server
cp .env.example .env
```

Edit `.env` file if you want to add AI features:
```
GOOGLE_API_KEY=your-google-gemini-api-key
NODE_ENV=development
PORT=5000
```

### Step 5: Start the Application

**Option A: Development Mode**
```bash
# Terminal 1: Start backend
cd server
npm start

# Terminal 2: Start frontend
cd client
npm start
```

**Option B: Production Mode**
```bash
# Build frontend
cd client
npm run build

# Start backend (serves built frontend)
cd ../server
npm start
```

### Step 6: Access Application
- **Development:** http://localhost:3000
- **Production:** http://localhost:5000

## 🌐 Deployment Options

### Deploy to Azure App Service
1. Create Azure App Service
2. Connect to GitHub repository
3. Set Node.js version to 18+
4. Deploy automatically

### Deploy to Netlify (Frontend Only)
1. Build frontend: `npm run build`
2. Upload `build` folder to Netlify
3. Configure redirects for SPA

### Deploy to Heroku
1. Install Heroku CLI
2. Create Heroku app
3. Push to Heroku Git
4. Set environment variables

## 🔧 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill process on port 3000/5000
npx kill-port 3000
npx kill-port 5000
```

**Dependencies not installing:**
```bash
# Clear npm cache
npm cache clean --force
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

**CORS errors:**
- Check that backend is running on port 5000
- Verify frontend is configured to call correct backend URL

### Getting Help

1. Check console for error messages
2. Verify all dependencies installed correctly
3. Ensure Node.js version is 16+
4. Check firewall/antivirus blocking ports

## ✅ Verification

After installation, you should see:
- ✅ Clean, professional interface
- ✅ Three mascot options (Capybara, Hamster, Parrot)
- ✅ Form inputs working correctly
- ✅ Ad generation producing results
- ✅ Responsive design on mobile

**Installation complete! Your AdmuseEasy is ready to use.**