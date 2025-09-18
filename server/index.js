const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const mongoose = require('mongoose');
const session = require('express-session');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load environment variables from the correct path
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Initialize Sentry first
const { initSentry, sentryRequestHandler, sentryTracingHandler, sentryErrorHandler } = require('./config/sentry');
initSentry();

// Import passport after dotenv is configured
const passport = require('./config/passport');

// Import routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const dashboardRoutes = require('./routes/dashboard');
const testRoutes = require('./routes/test');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection with hybrid support and Atlas fallback
const connectDB = async () => {
  try {
    // Check if we should skip database connection for demo mode
    if (process.env.DEMO_MODE === 'true') {
      console.log('🎭 Demo mode - skipping database connection');
      return;
    }
    
    // Determine which database to use based on configuration
    let mongoURI;
    
    // Priority: Atlas (production) > Local (development)
    if (process.env.MONGODB_ATLAS_URI) {
      mongoURI = process.env.MONGODB_ATLAS_URI;
      console.log('🌐 Using MongoDB Atlas (Cloud)');
    } else if (process.env.MONGODB_LOCAL) {
      mongoURI = process.env.MONGODB_LOCAL;
      console.log('🏠 Using Local MongoDB (Development)');
    } else {
      mongoURI = 'mongodb://localhost:27017/admuse-easy';
      console.log('🏠 Using Default Local MongoDB');
    }
    
    console.log('Attempting to connect to MongoDB...');
    
    await mongoose.connect(mongoURI, {
      // Connection options to handle timeouts and retries
      serverSelectionTimeoutMS: 10000, // Timeout after 10s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 2, // Maintain a minimum of 2 socket connections
      retryWrites: true,
      w: 'majority'
    });
    
    console.log(`✅ MongoDB connected successfully`);
  } catch (error) {
    console.error(`❌ MongoDB connection error:`, error.message);
    console.log('🎭 Falling back to demo mode without database...');
    // Don't exit the process, continue in demo mode
  }
};

connectDB();

// Initialize Google Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Security headers
app.use(helmet());

// Sentry request tracking middleware (must be first)
app.use(sentryRequestHandler());
app.use(sentryTracingHandler());

// Session and Passport configuration (only when OAuth is available)
const hasOAuth = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.DEMO_MODE !== 'true');

if (hasOAuth) {
  // Session configuration for OAuth
  app.use(session({
    secret: process.env.JWT_SECRET || 'fallback-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true in production with HTTPS
  }));

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());
  console.log('🔐 OAuth session support enabled');
} else {
  console.log('🎭 OAuth session support disabled - demo mode or missing credentials');
}

// Security: Restrict CORS to specific origins
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://admuse-easy.azurewebsites.net', 'https://admuseeasy-production.up.railway.app'] 
    : ['http://localhost:3000']
}));
app.use(express.json({ limit: '10mb' }));

// Business feature routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api', testRoutes);
// Mascot personality prompts for AI
const mascotPrompts = {
  capybara: {
    personality: "calm, zen-like, minimalist, soothing",
    tone: "gentle, peaceful, relaxing",
    style: "soft, comforting language with focus on tranquility"
  },
  hamster: {
    personality: "energetic, enthusiastic, bold, dynamic",
    tone: "exciting, motivational, high-energy",
    style: "punchy, action-oriented language with exclamation points"
  },
  parrot: {
    personality: "quirky, creative, playful, unique",
    tone: "fun, witty, clever",
    style: "creative wordplay and unexpected phrases"
  },
  panda: {
    personality: "zen, focused, balanced, mindful",
    tone: "centered, calm, thoughtful",
    style: "clear, balanced language with a focus on mindfulness and clarity"
  }
};

// AI-powered copy generation
async function generateAICopy(product, mascot) {
  const mascotInfo = mascotPrompts[mascot];
  
  const prompt = `You are a ${mascotInfo.personality} marketing copywriter creating an ad for:

Product: ${product.name}
Description: ${product.description}
Target Audience: ${product.audience}

Create ad copy with a ${mascotInfo.tone} tone using ${mascotInfo.style}.

Generate exactly this JSON format:
{
  "headline": "catchy main headline (max 60 chars)",
  "tagline": "memorable tagline (max 40 chars)",
  "cta": "call-to-action button text (max 20 chars)",
  "blurb": "compelling description (max 100 chars)"
}

Respond only with valid JSON, no other text.`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const fullPrompt = `You are a professional marketing copywriter. Always respond with valid JSON only.\n\n${prompt}`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;

    const aiResponse = response.text();
    return JSON.parse(aiResponse);
  } catch (error) {
    console.error('AI generation failed:', error);
    // Fallback to static copy if AI fails
    return getFallbackCopy(product, mascot);
  }
}

// Fallback static copy (dynamic for any product)
function getFallbackCopy(product, mascot) {
  const productName = product.name || 'Your Product';
  const description = product.description || 'Amazing product for your needs';
  
  const fallbackCopy = {
    capybara: {
      headline: `${productName} - Find Your Peace`,
      tagline: `Gentle solutions for mindful living`,
      cta: `Discover Calm`,
      blurb: description
    },
    hamster: {
      headline: `${productName} - Energize Your Life!`,
      tagline: `Bold choices for dynamic people`,
      cta: `Get Energized!`,
      blurb: description
    },
    parrot: {
      headline: `${productName} - Uniquely You!`,
      tagline: `Creative solutions for creative minds`,
      cta: `Stand Out!`,
      blurb: description
    },
    panda: {
      headline: `${productName} - Find Your Focus`,
      tagline: `Balanced solutions for mindful work`,
      cta: `Stay Zen`,
      blurb: description
    }
  };
  return fallbackCopy[mascot];
}

// Input validation middleware
const validateInput = (req, res, next) => {
  const { product, mascot } = req.body;
  console.log('DEBUG validateInput:', { product, mascot });
  if (!product || typeof product !== 'object') {
    console.log('DEBUG validateInput error: Invalid product data', req.body);
    return res.status(400).json({ error: 'Invalid product data' });
  }
  if (!mascot || typeof mascot !== 'string' || !mascotPrompts[mascot]) {
    console.log('DEBUG validateInput error: Invalid mascot selection', mascot);
    return res.status(400).json({ error: 'Invalid mascot selection' });
  }
  // Sanitize string inputs
  if (product.name) product.name = product.name.toString().slice(0, 100);
  if (product.description) product.description = product.description.toString().slice(0, 500);
  if (product.audience) product.audience = product.audience.toString().slice(0, 100);
  next();
};

// API: Generate ad copy with AI (updated with optional user tracking for demo)
app.post('/api/generate-copy', validateInput, async (req, res) => {
  try {
    const { product, mascot } = req.body;
    const copy = await generateAICopy(product, mascot);
    
    // Track usage if user is authenticated and not in demo mode
    if (process.env.DEMO_MODE !== 'true') {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (token) {
        try {
          const jwt = require('jsonwebtoken');
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
          await User.findByIdAndUpdate(decoded.userId, { $inc: { usageCount: 1 } });
        } catch (err) {
          // Continue without tracking if token is invalid
          console.log('Token verification failed, continuing without tracking');
        }
      }
    } else {
      console.log('🎭 Demo mode - skipping usage tracking');
    }
    
    res.json({ copy, powered_by: 'AI' });
  } catch (error) {
    console.error('Copy generation error:', error);
    res.status(500).json({ error: 'Failed to generate copy' });
  }
});

// Serve React build files with Azure-aware path resolution
const getClientBuildPath = () => {
  // Check for Azure deployment structure first
  const azurePath = '/home/site/wwwroot/client/build';
  if (require('fs').existsSync(azurePath)) {
    console.log('🔍 Using Azure deployment path:', azurePath);
    return azurePath;
  }
  
  // Standard deployment structure
  const standardPath = process.env.NODE_ENV === 'production' 
    ? path.join(__dirname, 'client/build')  // Production: build is copied to server/client/build
    : path.join(__dirname, '../client/build'); // Development: build is in parent directory
    
  console.log('🔍 Using standard deployment path:', standardPath);
  return standardPath;
};

const clientBuildPath = getClientBuildPath();
app.use(express.static(clientBuildPath));

// Health check endpoint
app.get('/api/health', (req, res) => {
  const fs = require('fs');
  
  // Check what files are actually available
  const checkPath = (pathToCheck, name) => {
    try {
      return {
        name,
        path: pathToCheck,
        exists: fs.existsSync(pathToCheck),
        files: fs.existsSync(pathToCheck) && fs.statSync(pathToCheck).isDirectory() 
          ? fs.readdirSync(pathToCheck).slice(0, 5) 
          : null
      };
    } catch (e) {
      return { name, path: pathToCheck, exists: false, error: e.message };
    }
  };
  
  const pathChecks = [
    checkPath(__dirname, 'Server directory'),
    checkPath(path.join(__dirname, 'client'), 'Client directory'),
    checkPath(path.join(__dirname, 'client/build'), 'Client build directory'),
    checkPath('/home/site/wwwroot', 'Azure wwwroot'),
    checkPath('/home/site/wwwroot/client', 'Azure client'),
    checkPath('/home/site/wwwroot/client/build', 'Azure client build')
  ];

  res.json({ 
    message: 'AdmuseEasy API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    clientPath: clientBuildPath,
    platform: process.platform,
    cwd: process.cwd(),
    pathChecks: pathChecks,
    azure: {
      siteName: process.env.WEBSITE_SITE_NAME || 'Not Azure',
      home: process.env.HOME || 'undefined'
    }
  });
});

// Sentry error handler must be before any other error middleware and after all controllers
app.use(sentryErrorHandler());

// Fallback: serve React index.html for any unknown route (SPA support)
app.get('*', (req, res) => {
  const getIndexPath = () => {
    // Check for Azure deployment structure first
    const azureIndexPath = '/home/site/wwwroot/client/build/index.html';
    if (require('fs').existsSync(azureIndexPath)) {
      return azureIndexPath;
    }
    
    // Standard deployment structure
    return process.env.NODE_ENV === 'production'
      ? path.join(__dirname, 'client/build/index.html')
      : path.join(__dirname, '../client/build/index.html');
  };
  
  const indexPath = getIndexPath();
    
  // Check if file exists before serving
  if (require('fs').existsSync(indexPath)) {
    console.log('✅ Serving index.html from:', indexPath);
    res.sendFile(indexPath);
  } else {
    console.error('❌ Index.html not found at:', indexPath);
    
    // Debug: List what files ARE available
    const debugPaths = [
      __dirname,
      path.join(__dirname, 'client'),
      '/home/site/wwwroot',
      '/home/site/wwwroot/client'
    ];
    
    debugPaths.forEach(debugPath => {
      try {
        if (require('fs').existsSync(debugPath)) {
          const files = require('fs').readdirSync(debugPath);
          console.log(`📂 ${debugPath}:`, files.slice(0, 10));
        }
      } catch (e) {
        console.log(`❌ Cannot read ${debugPath}:`, e.message);
      }
    });
    
    res.status(404).send(`
      <h1>AdmuseEasy API Server</h1>
      <p>API is running but client build not found.</p>
      <p>Looking for: ${indexPath}</p>
      <p>Environment: ${process.env.NODE_ENV || 'development'}</p>
      <p>Available APIs:</p>
      <ul>
        <li><a href="/api/health">/api/health</a> - Server status</li>
        <li><a href="/api/auth/google">/api/auth/google</a> - Google OAuth</li>
        <li>POST /api/generate-copy - Generate marketing copy</li>
      </ul>
    `);
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 AdmuseEasy Server Started Successfully!');
  console.log(`📍 Server URL: http://0.0.0.0:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🎭 Demo Mode: ${process.env.DEMO_MODE === 'true' ? 'ENABLED' : 'DISABLED'}`);
  console.log(`🗄️ Database: ${mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED'}`);
  console.log(`🔐 OAuth Available: ${!!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) ? 'YES' : 'NO'}`);
  console.log(`📊 Health Check: http://0.0.0.0:${PORT}/api/health`);
  console.log('⚡ Ready to handle requests!');
});
