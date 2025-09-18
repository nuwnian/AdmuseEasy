import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [authStatus, setAuthStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
          modes: { demo: true, oauth: false, database: false },
          active_mode: 'demo',
          demo_mode: true
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

  const handleOAuthLogin = () => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    window.location.href = `${apiUrl}/api/auth/google`;
  };

  const handleBackToDashboard = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="auth-container glass-effect">
        <h2>🔍 Checking Authentication Options...</h2>
        <p>Please wait while we detect available login methods.</p>
      </div>
    );
  }

  return (
    <div className="auth-container glass-effect">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <h2>Login to AdmuseEasy</h2>
        <button 
          onClick={handleBackToDashboard}
          style={{
            background: '#6c757d',
            border: 'none',
            padding: '8px 16px',
            fontSize: '14px',
            borderRadius: '5px',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Back to Dashboard
        </button>
      </div>
      
      {/* OAuth Login Option (if available) */}
      {authStatus?.modes?.oauth && (
        <div style={{marginBottom: '30px'}}>
          <div style={{background: '#e8f5e8', border: '1px solid #c3e6cb', borderRadius: '8px', padding: '15px', marginBottom: '15px'}}>
            <h4 style={{margin: '0 0 10px 0', color: '#155724'}}>🚀 Quick Login with Google</h4>
            <p style={{color: '#495057', fontSize: '14px', margin: '5px 0'}}>
              • Secure OAuth authentication<br/>
              • Your data is saved {authStatus?.modes?.database ? 'in the cloud' : 'locally'}<br/>
              • One-click login with your Google account
            </p>
          </div>
          <button 
            onClick={handleOAuthLogin}
            style={{
              background: '#db4437', 
              border: 'none', 
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              marginBottom: '20px'
            }}
          >
            🔐 Continue with Google
          </button>
          
          {(authStatus?.modes?.demo && authStatus?.active_mode === 'demo') && (
            <div style={{textAlign: 'center', margin: '20px 0'}}>
              <span style={{color: '#6c757d'}}>────── or ──────</span>
            </div>
          )}
        </div>
      )}

      {/* Demo Login Option */}
      {(authStatus?.modes?.demo && authStatus?.active_mode === 'demo') && (
        <div>
          <div style={{background: '#f0f8ff', border: '1px solid #bee5eb', borderRadius: '8px', padding: '15px', marginBottom: '20px'}}>
            <h4 style={{margin: '0 0 10px 0', color: '#0c5460'}}>✨ Demo Mode - Try Without Account</h4>
            <p style={{color: '#495057', fontSize: '14px', margin: '5px 0'}}>
              • Just enter any email address<br/>
              • No password required<br/>
              • Try: demo@example.com, test@gmail.com, or your own email
            </p>
          </div>
          <form onSubmit={handleDemoSubmit}>
            <input
              type="email"
              placeholder="Enter any email (demo@example.com)"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{marginBottom: '10px'}}
            />
            <button type="submit" style={{background: '#28a745', border: 'none'}}>
              🎭 Enter Demo Mode
            </button>
            {error && <div className="auth-error">{error}</div>}
          </form>
        </div>
      )}

      {/* Status Information */}
      <div style={{marginTop: '20px', padding: '10px', background: '#f8f9fa', borderRadius: '5px', fontSize: '12px'}}>
        <p style={{margin: '0', color: '#6c757d'}}>
          Authentication Status: 
          {authStatus?.modes?.oauth && <span style={{color: '#28a745'}}> ✅ OAuth</span>}
          {authStatus?.modes?.database && <span style={{color: '#28a745'}}> ✅ Database</span>}
          {authStatus?.modes?.demo && <span style={{color: '#ffc107'}}> ✅ Demo</span>}
          <br/>Active Mode: <strong>{authStatus?.active_mode || 'Unknown'}</strong>
        </p>
      </div>

      <p>Want to try signup instead? <Link to="/signup">Sign Up</Link></p>
    </div>
  );
}

export default Login;