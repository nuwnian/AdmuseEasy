import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Signup({ onSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name: email.split('@')[0] })
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || (data.errors && data.errors[0]?.msg) || 'Signup failed.');
        return;
      }
      localStorage.setItem('token', data.token);
      onSignup(true); // Update parent state
      window.location.href = '/'; // Redirect to home after signup
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <div className="auth-container glass-effect">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
        {error && <div className="auth-error">{error}</div>}
      </form>
      
      <div className="auth-divider">
        <span>or</span>
      </div>
      
      <button onClick={handleGoogleSignup} className="google-login-btn">
        <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" />
        Continue with Google
      </button>
      
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}

export default Signup;