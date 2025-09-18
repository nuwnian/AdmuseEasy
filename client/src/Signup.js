import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Signup({ onSignup }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !name) {
      setError('Please enter email and name for demo signup.');
      return;
    }
    try {
      // Use the correct API endpoint based on environment
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name })
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || (data.errors && data.errors[0]?.msg) || 'Signup failed.');
        return;
      }
      // Store token and user data in localStorage for demo
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onSignup(true); // Update parent state
      window.location.href = '/'; // Redirect to home after signup
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  return (
    <div className="auth-container glass-effect">
      <h2>🎭 Demo Signup</h2>
      <div style={{background: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '8px', padding: '15px', marginBottom: '20px'}}>
        <h4 style={{margin: '0 0 10px 0', color: '#495057'}}>✨ Create Demo Account</h4>
        <p style={{color: '#495057', fontSize: '14px', margin: '5px 0'}}>
          • No password required<br/>
          • Just email and name<br/>
          • Try: demo@example.com + "Demo User"
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email (demo@example.com)"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{marginBottom: '10px'}}
        />
        <input
          type="text"
          placeholder="Your Name (Demo User)"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          style={{marginBottom: '10px'}}
        />
        <button type="submit" style={{background: '#007bff', border: 'none'}}>
          🚀 Create Demo Account
        </button>
        {error && <div className="auth-error">{error}</div>}
      </form>
      <p>Already have an account? <Link to="/login">Demo Login</Link></p>
      <p style={{fontSize: '12px', color: '#6c757d', marginTop: '15px'}}>
        💡 This is a demonstration - no real data is stored
      </p>
    </div>
  );
}

export default Signup;