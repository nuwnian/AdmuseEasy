
import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

import QADocs from './QADocs';
import About from './About';


function DemoNotice() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="demo-fab" onClick={() => setOpen(true)} title="Show demo info">🚧</button>
      {open && (
        <div className="demo-notice">
          <span className="demo-notice-close" onClick={() => setOpen(false)} title="Close">×</span>
          <span role="img" aria-label="demo">🚧</span> This site is for demo/portfolio purposes only. No real products or services are being sold. <span role="img" aria-label="demo">🚧</span>
        </div>
      )}
    </>
  );
}

const mascots = [
  { key: 'capybara', name: 'Cozy Capybara', mood: 'Calming', description: 'Minimalist layouts with soft copy', icon: '/mascots/Capybara-icon.png' },
  { key: 'hamster', name: 'Hype Hamster', mood: 'Energetic', description: 'Punchy headlines and bold visuals', icon: '/mascots/Hamster-icon.png' },
  { key: 'parrot', name: 'Pixel Parrot', mood: 'Quirky', description: 'Clever copy and layout tweaks', icon: '/mascots/Parrot-icon.png' },
  { key: 'panda', name: 'Zen Panda', mood: 'Focused', description: 'Balanced, mindful, and focused tone', icon: '/mascots/Panda-icon.png' },
];



function App() {
  const AdGenerator = () => {
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(window.scrollY);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 40) {
        setShowNavbar(true);
        lastScrollY.current = window.scrollY;
        return;
      }
      if (window.scrollY > lastScrollY.current) {
        setShowNavbar(false); // scrolling down
      } else {
        setShowNavbar(true); // scrolling up
      }
      lastScrollY.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const [product, setProduct] = useState({ name: '', description: '', audience: '' });
  const [mascot, setMascot] = useState(mascots[0].key);
  // Removed format state
  const [adResult, setAdResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInput = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const apiBase = process.env.NODE_ENV === 'production'
        ? '' // use relative path in production
        : 'http://localhost:5000';
      const response = await fetch(`${apiBase}/api/generate-copy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, mascot })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      setAdResult({
        layout: `<div style='padding:2em;background:#f4f4f4;border-radius:1em;text-align:center;'>\n  <h1>${product.name || 'Product Name'}</h1>\n  <h2>${mascots.find(m => m.key === mascot).emoji} ${mascots.find(m => m.key === mascot).name}</h2>\n  <p>${product.description || 'Product description goes here.'}</p>\n  <p><em>For: ${product.audience || 'Target Audience'}</em></p>\n  <button style='margin-top:1em;padding:0.5em 2em;font-size:1.2em;'>${data.copy.cta}</button>\n</div>`,
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
  <nav className={`navbar${showNavbar ? '' : ' navbar--hidden'}`}>
        <div className="nav-container">
          <div className="nav-logo">
            <img src="/Admuse-Logo.png" alt="AdmuseEasy" className="logo-image" />
            <span className="logo-text">AdmuseEasy</span>
          </div>
          <div className="nav-links">
            <Link to="/">Ad Generator</Link>
            <Link to="/about">About</Link>
            <Link to="/qa-docs">QA Documentation</Link>
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
                <img src={m.icon} alt={m.name} className="mascot-icon" style={{ width: 40, height: 40, marginRight: 8, verticalAlign: 'middle' }} />
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
  };

  return (
    <Router>
      <DemoNotice />
      <Routes>
        <Route path="/" element={<AdGenerator />} />
        <Route path="/about" element={<About />} />
        <Route path="/qa-docs" element={<QADocs />} />
      </Routes>
    </Router>
  );
}

export default App;
