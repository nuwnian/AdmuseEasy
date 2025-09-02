const express = require('express');
const cors = require('cors');
const path = require('path');


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// Serve React build static files
app.use(express.static(path.join(__dirname, '../client/build')));

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

// API: Generate ad copy
app.post('/api/generate-copy', (req, res) => {
  const { product, mascot } = req.body;
  if (!product || !mascot || !mascotCopy[mascot]) {
    return res.status(400).json({ error: 'Missing or invalid input.' });
  }
  const copy = mascotCopy[mascot](product);
  res.json({ copy });
});

// Fallback: serve React index.html for any unknown route (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
