const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 5000;

// Security headers
app.use(helmet());

// Security: Restrict CORS to specific origins
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://admuse-easy.azurewebsites.net', 'https://your-frontend-domain.azurewebsites.net'] 
    : ['http://localhost:3000']
}));
app.use(express.json({ limit: '10mb' }));
// Mascot slogan logic
const mascotCopy = {
  capybara: (product) => ({
    headline: `Gentle Clean, Calm Mind.`,
    tagline: `Pure comfort in every wash.`,
    cta: `Relax & Refresh`,
    blurb: product.description || 'Experience soothing, natural care every day.'
  }),
  hamster: (product) => ({
    headline: `Get Zesty, Get Noticed!`,
    tagline: `Energize your day with every wash.`,
    cta: `Feel the Buzz!`,
    blurb: product.description || 'Unleash your energy with every use.'
  }),
  parrot: (product) => ({
    headline: `Soap That Sings Lemongrass!`,
    tagline: `Clean, green, and a little bit wild.`,
    cta: `Lather Up, Stand Out!`,
    blurb: product.description || 'Make your routine a little more fun.'
  })
};

// Input validation middleware
const validateInput = (req, res, next) => {
  const { product, mascot } = req.body;
  
  if (!product || typeof product !== 'object') {
    return res.status(400).json({ error: 'Invalid product data' });
  }
  
  if (!mascot || typeof mascot !== 'string' || !mascotCopy[mascot]) {
    return res.status(400).json({ error: 'Invalid mascot selection' });
  }
  
  // Sanitize string inputs
  if (product.name) product.name = product.name.toString().slice(0, 100);
  if (product.description) product.description = product.description.toString().slice(0, 500);
  if (product.audience) product.audience = product.audience.toString().slice(0, 100);
  
  next();
};

// API: Generate ad copy
app.post('/api/generate-copy', validateInput, (req, res) => {
  const { product, mascot } = req.body;
  const copy = mascotCopy[mascot](product);
  res.json({ copy });
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'AdmuseEasy API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
