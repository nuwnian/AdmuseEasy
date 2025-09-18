import React, { useState } from 'react';

function Login() {
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
      window.location.href = '/'; // Redirect to home after login
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  return (
    <div className="auth-container glass-effect">
      <h2>Demo Login</h2>
      <p style={{color: '#666', fontSize: '14px', marginBottom: '20px'}}>
        Just enter any email - no password required for demo!
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter any email (demo@example.com)"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <button type="submit">Demo Login</button>
        {error && <div className="auth-error">{error}</div>}
      </form>
      <p>Don't have an account? <a href="/signup">Sign up</a></p>
    </div>
  );
}

export default Login;
