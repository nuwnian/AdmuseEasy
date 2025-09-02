
import React, { useState } from 'react';
import './App.css';

const mascots = [
  { key: 'capybara', name: 'Cozy Capybara', mood: 'Calming', description: 'Minimalist layouts with soft copy', emoji: '🧸' },
  { key: 'hamster', name: 'Hype Hamster', mood: 'Energetic', description: 'Punchy headlines and bold visuals', emoji: '🐹' },
  { key: 'parrot', name: 'Pixel Parrot', mood: 'Quirky', description: 'Clever copy and layout tweaks', emoji: '🦜' },
];

const formats = [
  { key: 'billboard', label: 'Billboard' },
  { key: 'instagram', label: 'Instagram Reel' },
  { key: 'landing', label: 'Landing Page' },
];

function App() {
  const [product, setProduct] = useState({ name: '', description: '', audience: '' });
  const [mascot, setMascot] = useState(mascots[0].key);
  const [format, setFormat] = useState(formats[0].key);
  const [adResult, setAdResult] = useState(null);

  const handleInput = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleGenerate = async () => {
    try {
      const response = await fetch('/api/generate-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, mascot })
      });
      
      const data = await response.json();
      
      setAdResult({
        layout: `<div style='padding:2em;background:#f4f4f4;border-radius:1em;text-align:center;'>\n  <h1>${product.name || 'Product Name'}</h1>\n  <h2>${mascots.find(m => m.key === mascot).emoji} ${mascots.find(m => m.key === mascot).name}</h2>\n  <p>${product.description || 'Product description goes here.'}</p>\n  <p><em>For: ${product.audience || 'Target Audience'}</em></p>\n  <button style='margin-top:1em;padding:0.5em 2em;font-size:1.2em;'>${data.copy.cta}</button>\n</div>`,
        copy: data.copy,
        format: formats.find(f => f.key === format).label
      });
    } catch (error) {
      console.error('Failed to generate ad:', error);
      alert('Failed to generate ad. Please try again.');
    }
  };

  return (
    <div className="dashboard">
      <h1>Admuse Easy</h1>
      <div className="input-section">
        <div className="input-group">
          <label>Product Name</label>
          <input name="name" value={product.name} onChange={handleInput} placeholder="e.g. Organic lemongrass soap" />
        </div>
        <div className="input-group">
          <label>Description</label>
          <textarea name="description" value={product.description} onChange={handleInput} placeholder="Describe your product..." />
        </div>
        <div className="input-group">
          <label>Target Audience</label>
          <input name="audience" value={product.audience} onChange={handleInput} placeholder="e.g. Eco-conscious millennials" />
        </div>
        <div className="input-group">
          <label>Mascot & Mood</label>
          <div className="mascot-options">
            {mascots.map(m => (
              <label key={m.key} className={mascot === m.key ? 'selected' : ''}>
                <input type="radio" name="mascot" value={m.key} checked={mascot === m.key} onChange={() => setMascot(m.key)} />
                <span className="emoji">{m.emoji}</span> <b>{m.name}</b> <span className="mood">({m.mood})</span>
                <div className="desc">{m.description}</div>
              </label>
            ))}
          </div>
        </div>
        <div className="input-group">
          <label>Output Format</label>
          <select value={format} onChange={e => setFormat(e.target.value)}>
            {formats.map(f => (
              <option key={f.key} value={f.key}>{f.label}</option>
            ))}
          </select>
        </div>
        <button className="generate-btn" onClick={handleGenerate}>Generate Ad</button>
      </div>
      {adResult && (
        <div className="result-section">
          <h2>Generated Ad ({adResult.format})</h2>
          <div className="ad-layout" dangerouslySetInnerHTML={{ __html: adResult.layout }} />
          <div className="ad-copy">
            <h3>Copywriting</h3>
            <p><b>Headline:</b> {adResult.copy.headline}</p>
            <p><b>Tagline:</b> {adResult.copy.tagline}</p>
            <p><b>CTA:</b> {adResult.copy.cta}</p>
            <p><b>Blurb:</b> {adResult.copy.blurb}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
