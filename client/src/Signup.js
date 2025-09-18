import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Signup({ onSignup }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [authStatus, setAuthStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication capabilities on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/api/auth/status`);
        const data = await response.json();
        setAuthStatus(data);
      } catch (err) {
        console.error('Failed to check auth status:', err);
        // Default to demo mode if status check fails
        setAuthStatus({ 
          demoMode: true, 
          oauthAvailable: false, 
          databaseConnected: false 
        });
      } finally {
        setLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  const handleDemoSubmit = async (e) => {
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

  const handleOAuthSignup = () => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    window.location.href = `${apiUrl}/api/auth/google`;
  };

  if (loading) {
    return (
      <div className="auth-container glass-effect">
        <h2>🔍 Checking Authentication Options...</h2>
        <p>Please wait while we detect available signup methods.</p>
      </div>
    );
  }

  return (
    <div className="auth-container glass-effect">
      <h2>🚀 Join AdmuseEasy</h2>
      
      {/* OAuth Signup Option (if available) */}
      {authStatus?.oauthAvailable && (
        <div style={{marginBottom: '30px'}}>
          <div style={{background: '#e8f5e8', border: '1px solid #c3e6cb', borderRadius: '8px', padding: '15px', marginBottom: '15px'}}>
            <h4 style={{margin: '0 0 10px 0', color: '#155724'}}>🚀 Quick Signup with Google</h4>
            <p style={{color: '#495057', fontSize: '14px', margin: '5px 0'}}>
              • Secure OAuth authentication<br/>
              • Your account is saved {authStatus?.databaseConnected ? 'in the cloud' : 'locally'}<br/>
              • One-click signup with your Google account
            </p>
          </div>
          <button 
            onClick={handleOAuthSignup}
            style={{
              background: '#db4437', 
              border: 'none', 
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              marginBottom: '20px'
            }}
          >
            🔐 Sign Up with Google
          </button>
          
          {authStatus?.demoMode && (
            <div style={{textAlign: 'center', margin: '20px 0'}}>
              <span style={{color: '#6c757d'}}>────── or ──────</span>
            </div>
          )}
        </div>
      )}

      {/* Demo Signup Option */}
      {authStatus?.demoMode && (
        <div>
          <div style={{background: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '8px', padding: '15px', marginBottom: '20px'}}>
            <h4 style={{margin: '0 0 10px 0', color: '#495057'}}>✨ Try Demo Account</h4>
            <p style={{color: '#495057', fontSize: '14px', margin: '5px 0'}}>
              • No password required<br/>
              • Just email and name<br/>
              • Try: demo@example.com + "Demo User"
            </p>
          </div>
          <form onSubmit={handleDemoSubmit}>
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
              🎭 Create Demo Account
            </button>
            {error && <div className="auth-error">{error}</div>}
          </form>
        </div>
      )}

      {/* Status Information */}
      <div style={{marginTop: '20px', padding: '10px', background: '#f8f9fa', borderRadius: '5px', fontSize: '12px'}}>
        <p style={{margin: '0', color: '#6c757d'}}>
          Authentication Status: 
          {authStatus?.oauthAvailable && <span style={{color: '#28a745'}}> ✅ OAuth</span>}
          {authStatus?.databaseConnected && <span style={{color: '#28a745'}}> ✅ Database</span>}
          {authStatus?.demoMode && <span style={{color: '#ffc107'}}> ✅ Demo</span>}
        </p>
      </div>

      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}

export default Signup;