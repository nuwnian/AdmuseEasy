import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <nav className="about-breadcrumb">
        <Link to="/" className="home-link">← Back to AdmuseEasy</Link>
      </nav>
      
      <header className="about-header">
        <h1>About AdmuseEasy</h1>
        <p>Empowering anyone to create emotionally resonant ads with mascot personalities</p>
      </header>

      <div className="about-content">
        <section className="about-section">
          <h2>What is AdmuseEasy?</h2>
          <p>
            AdmuseEasy is a web application that democratizes advertising creation by enabling anyone—regardless of design or copywriting experience—to generate professional, personality-driven advertisements. Using mascot characters with distinct moods and styles, the platform creates compelling ad copy and layouts for multiple formats.
          </p>
        </section>

        <section className="about-section">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Mascot-Driven Copy</h3>
              <p>Choose from three unique mascot personalities that generate different styles of headlines, taglines, and calls-to-action tailored to your brand's mood.</p>
            </div>
            <div className="feature-card">
              <h3>Multi-Platform Output</h3>
              <p>Generate ads optimized for different formats including billboards, Instagram reels, and landing pages with appropriate sizing and messaging.</p>
            </div>
            <div className="feature-card">
              <h3>Simple Interface</h3>
              <p>No design skills required. Just input your product details, select a mascot mood, and generate professional ad content in seconds.</p>
            </div>
            <div className="feature-card">
              <h3>AI-Ready Architecture</h3>
              <p>Built with integration capabilities for Google Gemini and Azure OpenAI to enhance creativity and personalization.</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Meet the Mascots</h2>
          <div className="mascots-showcase">
            <div className="mascot-showcase">
              <div className="mascot-icon">🧸</div>
              <h3>Cozy Capybara</h3>
              <p><strong>Mood:</strong> Calming</p>
              <p>Creates minimalist layouts with soft, gentle copy that emphasizes comfort and relaxation. Perfect for wellness, lifestyle, and premium products.</p>
            </div>
            <div className="mascot-showcase">
              <div className="mascot-icon">🐹</div>
              <h3>Hype Hamster</h3>
              <p><strong>Mood:</strong> Energetic</p>
              <p>Generates punchy headlines and bold visuals with high-energy language. Ideal for fitness, technology, and youth-oriented products.</p>
            </div>
            <div className="mascot-showcase">
              <div className="mascot-icon">🦜</div>
              <h3>Pixel Parrot</h3>
              <p><strong>Mood:</strong> Quirky</p>
              <p>Produces clever copy with creative layout tweaks and playful messaging. Great for creative services, entertainment, and unique brands.</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Who Can Use AdmuseEasy?</h2>
          <div className="audience-list">
            <div className="audience-item">
              <h4>Small Business Owners</h4>
              <p>Create professional ads without hiring expensive agencies or designers.</p>
            </div>
            <div className="audience-item">
              <h4>Marketing Teams</h4>
              <p>Rapidly prototype ad concepts and explore different creative directions.</p>
            </div>
            <div className="audience-item">
              <h4>Entrepreneurs</h4>
              <p>Generate compelling marketing materials for product launches and campaigns.</p>
            </div>
            <div className="audience-item">
              <h4>Content Creators</h4>
              <p>Develop consistent brand messaging across different platforms and formats.</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Technology Stack</h2>
          <div className="tech-stack">
            <div className="tech-category">
              <h4>Frontend</h4>
              <p>React.js with responsive design for seamless user experience across devices.</p>
            </div>
            <div className="tech-category">
              <h4>Backend</h4>
              <p>Node.js with Express.js providing secure API endpoints and mascot logic processing.</p>
            </div>
            <div className="tech-category">
              <h4>Deployment</h4>
              <p>Azure App Service with CI/CD pipeline for reliable hosting and updates.</p>
            </div>
            <div className="tech-category">
              <h4>Future Integration</h4>
              <p>Google Gemini AI for enhanced creativity and personalized ad generation.</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Get Started</h2>
          <p>
            Ready to create your first ad? Simply navigate to the main dashboard, enter your product information, choose a mascot that matches your brand's personality, and watch as AdmuseEasy generates professional advertising content tailored to your needs.
          </p>
          <div className="cta-buttons">
            <Link to="/" className="cta-primary">Try AdmuseEasy Now</Link>
            <Link to="/qa-docs" className="cta-secondary">View QA Documentation</Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;