import React, { useState } from 'react';
import './App.css';

// AdmuseEasy - Personality-Driven Marketing Ad Generator
// Built with React.js for modern, responsive user experience

// Mascot personalities - each with unique messaging style and approach
const mascots = [
  { key: 'capybara', name: 'Cozy Capybara', mood: 'Calming', description: 'Minimalist layouts with soft copy', emoji: '/mascots/Capybara-icon.png' },
  { key: 'hamster', name: 'Hype Hamster', mood: 'Energetic', description: 'Punchy headlines and bold visuals', emoji: '/mascots/Hamster-icon.png' },
  { key: 'parrot', name: 'Pixel Parrot', mood: 'Quirky', description: 'Clever copy and layout tweaks', emoji: '/mascots/Parrot-icon.png' },
  { key: 'panda', name: 'Zen Panda', mood: 'Focused', description: 'Calm, balanced messaging with clarity', emoji: '/mascots/Panda-icon.png' },
];



function App() {
  const [product, setProduct] = useState({ name: '', description: '', audience: '' });
  const [mascot, setMascot] = useState(mascots[0].key);

  const [adResult, setAdResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInput = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const API_URL = process.env.NODE_ENV === 'production' 
        ? '/api/generate-copy'  // Production: same domain
        : 'http://localhost:5000/api/generate-copy';  // Development
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, mascot })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      setAdResult({
        layout: `<div style='padding:2em;background:#f4f4f4;border-radius:1em;text-align:center;'>
  <h1>${product.name || 'Product Name'}</h1>
  <h2><img src="${mascots.find(m => m.key === mascot).emoji}" alt="${mascots.find(m => m.key === mascot).name}" style="width:40px;height:40px;vertical-align:middle;margin-right:10px;" />${mascots.find(m => m.key === mascot).name}</h2>
  <p>${product.description || 'Product description goes here.'}</p>
  <p><em>For: ${product.audience || 'Target Audience'}</em></p>
  <button style='margin-top:1em;padding:0.5em 2em;font-size:1.2em;background:#4f8cff;color:white;border:none;border-radius:0.5em;cursor:pointer;'>${data.copy.cta}</button>
</div>`,
        copy: data.copy
      });
    } catch (error) {
      console.error('Failed to generate ad:', error);
      alert('Failed to generate ad. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <img src="/Admuse-Logo.png" alt="AdmuseEasy" className="logo-image" />
            <span className="logo-text">AdmuseEasy</span>
          </div>
          <div className="nav-links">
            <a href="#home">Home</a>
            <a href="#features">Features</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </nav>

      <div className="dashboard">
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
                  <img src={m.emoji} alt={m.name} className="emoji" />
                  <div className="mascot-info">
                    <div><b>{m.name}</b> <span className="mood">({m.mood})</span></div>
                    <div className="desc">{m.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button className="generate-btn" onClick={handleGenerate} disabled={loading}>
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                Generating...
              </div>
            ) : (
              'Generate Ad'
            )}
          </button>
        </div>
        {adResult && (
          <div className="result-section">
            <h2>Generated Ad</h2>
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
      
      {/* Footer */}
      <footer className="footer">
        <p>© 2025 AdmuseEasy • Made with 💙 for creative marketers</p>
      </footer>
    </div>
  );
}

 export default App;