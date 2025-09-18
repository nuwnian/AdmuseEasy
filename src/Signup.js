import React, { useState } from 'react';

function Signup() {
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
      window.location.href = '/'; // Redirect to home after signup
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  return (
    <div className="auth-container glass-effect">
      <h2>Demo Sign Up</h2>
      <p style={{color: '#666', fontSize: '14px', marginBottom: '20px'}}>
        No passwords needed - just enter your email and name for demo!
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <button type="submit">Demo Sign Up</button>
        {error && <div className="auth-error">{error}</div>}
      </form>
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
}

export default Signup;
