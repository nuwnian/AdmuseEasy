import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Please enter an email for demo login.');
      return;
    }
    try {
      // Use the correct API endpoint based on environment
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Login failed.');
        return;
      }
      // Store token and user data in localStorage for demo
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLogin(true); // Update parent state
      window.location.href = '/'; // Redirect to home after login
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  return (
    <div className="auth-container glass-effect">
      <h2>🎭 Demo Login</h2>
      <div style={{background: '#f0f8ff', border: '1px solid #bee5eb', borderRadius: '8px', padding: '15px', marginBottom: '20px'}}>
        <h4 style={{margin: '0 0 10px 0', color: '#0c5460'}}>✨ Demo Mode - No Real Account Needed!</h4>
        <p style={{color: '#495057', fontSize: '14px', margin: '5px 0'}}>
          • Just enter any email address<br/>
          • No password required<br/>
          • Try: demo@example.com, test@gmail.com, or your own email
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter any email (demo@example.com)"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{marginBottom: '10px'}}
        />
        <button type="submit" style={{background: '#28a745', border: 'none'}}>
          🚀 Enter Demo
        </button>
        {error && <div className="auth-error">{error}</div>}
      </form>
      <p>Want to try signup instead? <Link to="/signup">Demo Signup</Link></p>
      <p style={{fontSize: '12px', color: '#6c757d', marginTop: '15px'}}>
        💡 This is a demonstration - no real data is stored
      </p>
    </div>
  );
}

export default Login;