import React, { useEffect } from 'react';

function AuthSuccess() {
  useEffect(() => {
    // Get token from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      // Store token in localStorage
      localStorage.setItem('token', token);
      // Redirect to home page
      window.location.href = '/';
    } else {
      // No token, redirect to login
      window.location.href = '/login';
    }
  }, []);

  return (
    <div className="auth-container glass-effect">
      <h2>Signing you in...</h2>
      <div className="loading-spinner">
        <div className="spinner"></div>
        Please wait...
      </div>
    </div>
  );
}

export default AuthSuccess;