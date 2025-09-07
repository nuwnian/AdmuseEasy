# AdmuseEasy Customization Guide

## 🎨 Branding Customization

### Change Logo
1. Replace `/client/public/Admuse-Logo.png` with your logo
2. Keep dimensions around 200x60px for best results
3. Use PNG format with transparent background

### Update Colors
Edit `/client/src/App.css`:
```css
/* Main brand color */
.navbar { background: #4f8cff; } /* Change this */
.generate-btn { background: #4f8cff; } /* And this */

/* Accent colors */
.mascot-options label.selected { border: 2px solid #4f8cff; }
```

### Change Company Name
Edit `/client/src/App.js`:
```javascript
<span className="logo-text">YourBrandName</span>
```

## 🎭 Mascot Customization

### Add New Mascots
1. Add image to `/client/public/mascots/newmascot.png`
2. Update mascots array in `/client/src/App.js`:
```javascript
const mascots = [
  // existing mascots...
  { key: 'newmascot', name: 'New Mascot', mood: 'Creative', 
    description: 'Your description', emoji: '/mascots/newmascot.png' },
];
```
3. Add personality to `/server/index.js`:
```javascript
const mascotPrompts = {
  // existing mascots...
  newmascot: {
    personality: "creative, innovative, bold",
    tone: "inspiring, motivational",
    style: "creative language with inspiring messages"
  }
};
```
4. Add fallback copy:
```javascript
const fallbackCopy = {
  // existing mascots...
  newmascot: {
    headline: `${productName} - Innovate Today`,
    tagline: `Creative solutions for modern needs`,
    cta: `Get Creative`,
    blurb: description
  }
};
```

### Modify Existing Mascots
- **Images**: Replace files in `/client/public/mascots/`
- **Names**: Update `name` field in mascots array
- **Personalities**: Modify descriptions and fallback copy
- **Moods**: Change `mood` field for different vibes

## 🎯 Copy Templates Customization

### Modify Fallback Templates
Edit `/server/index.js` fallbackCopy function:
```javascript
capybara: {
  headline: `${productName} - Your Custom Headline`,
  tagline: `Your custom tagline`,
  cta: `Your CTA`,
  blurb: description
}
```

### Add Industry-Specific Templates
Create conditional logic based on product type:
```javascript
// Example: Restaurant-specific copy
if (product.description.toLowerCase().includes('restaurant')) {
  return {
    headline: `${productName} - Taste the Difference`,
    tagline: `Where flavor meets tradition`,
    cta: `Reserve Now`,
    blurb: description
  };
}
```

## 🎨 UI Customization

### Change Layout Colors
```css
/* Dashboard background */
.dashboard { background: #fff; }

/* Input styling */
.input-group input { border: 1px solid #cfd8dc; }

/* Button styling */
.generate-btn { 
  background: #your-color;
  color: white;
}
```

### Modify Mascot Card Design
```css
.mascot-options label {
  background: #f4f4f4;
  border-radius: 0.7em;
  /* Add your custom styling */
}
```

### Update Typography
```css
body {
  font-family: 'Your-Font', Arial, sans-serif;
}
```

## 🔧 Advanced Customization

### Add New Ad Formats
1. Update formats array in `/client/src/App.js`:
```javascript
const formats = [
  { key: 'billboard', label: 'Billboard' },
  { key: 'instagram', label: 'Instagram Reel' },
  { key: 'landing', label: 'Landing Page' },
  { key: 'facebook', label: 'Facebook Ad' }, // New format
];
```

### Modify Generated Layout
Edit the layout template in handleGenerate function:
```javascript
layout: `<div style='your-custom-styling'>
  <h1>${product.name}</h1>
  <!-- Your custom HTML structure -->
</div>`
```

### Add Form Fields
1. Add to product state:
```javascript
const [product, setProduct] = useState({ 
  name: '', description: '', audience: '', 
  newfield: '' // Add new field
});
```
2. Add input in JSX:
```javascript
<div className="input-group">
  <label>New Field</label>
  <input name="newfield" value={product.newfield} onChange={handleInput} />
</div>
```

## 🚀 AI Integration (Optional)

### Enable Google Gemini
1. Get API key from Google AI Studio
2. Add to `/server/.env`: `GOOGLE_API_KEY=your-key`
3. Restart server - AI will automatically activate

### Switch to OpenAI
Replace Google Gemini code in `/server/index.js` with OpenAI integration.

## 📱 Mobile Customization

### Adjust Mobile Breakpoints
```css
@media (max-width: 768px) {
  /* Your mobile customizations */
}
```

### Modify Mobile Mascot Layout
```css
@media (max-width: 768px) {
  .mascot-options {
    flex-direction: column;
  }
}
```

## 🎯 White-Label Setup

### Complete Rebranding
1. Replace all logos and branding
2. Update company name throughout
3. Modify color scheme
4. Customize mascots for your brand
5. Update footer and contact information

### Domain Setup
1. Update CORS settings in `/server/index.js`
2. Configure production environment variables
3. Set up custom domain pointing

---

**Need help with customization? Check the installation guide or contact support.**