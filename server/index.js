const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const dashboardRoutes = require('./routes/dashboard');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/admuse-easy';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Continue without database for now
  }
};

connectDB();

// Initialize Google Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Security headers
app.use(helmet());

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

// API: Generate ad copy with AI (updated with user tracking)
app.post('/api/generate-copy', validateInput, async (req, res) => {
  try {
    const { product, mascot } = req.body;
    const copy = await generateAICopy(product, mascot);
    
    // Track usage if user is authenticated
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
        await User.findByIdAndUpdate(decoded.userId, { $inc: { usageCount: 1 } });
      } catch (err) {
        // Continue without tracking if token is invalid
      }
    }
    
    res.json({ copy, powered_by: 'AI' });
  } catch (error) {
    console.error('Copy generation error:', error);
    res.status(500).json({ error: 'Failed to generate copy' });
  }
});

// Serve React build files
app.use(express.static(path.join(__dirname, '../client/build')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: 'AdmuseEasy API is running!' });
});

// Fallback: serve React index.html for any unknown route (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
