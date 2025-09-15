import React from 'react';
import { Link } from 'react-router-dom';

function AuthError() {
  return (
    <div className="auth-container glass-effect">
      <h2>Authentication Error</h2>
      <div className="auth-error">
        Something went wrong during authentication. Please try again.
      </div>
      <Link to="/login" className="auth-container button">
        Back to Login
      </Link>
    </div>
  );
}

export default AuthError;