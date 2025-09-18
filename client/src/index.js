import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppWrapper from './App';
import reportWebVitals from './reportWebVitals';

// Initialize Sentry for error tracking
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

// Initialize Google Analytics
import { initGA } from './utils/analytics';

// Initialize Sentry
Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  
  // Performance monitoring
  integrations: [
    new BrowserTracing({
      // Set tracing sample rate
      tracePropagationTargets: ["localhost", process.env.REACT_APP_API_URL || "http://localhost:5000", /^\//],
    }),
  ],
  
  // Performance monitoring sample rate
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Session tracking
  autoSessionTracking: true,
  
  // Capture unhandled promise rejections
  captureUnhandledRejections: true,
  
  // Release tracking
  release: process.env.REACT_APP_SENTRY_RELEASE || '1.0.0',
  
  // User feedback
  beforeSend(event) {
    // Filter out development errors
    if (process.env.NODE_ENV === 'development') {
      console.log('Sentry Event:', event);
    }
    
    // Don't send 404 errors (too noisy)
    if (event.exception?.values?.[0]?.value?.includes('404')) {
      return null;
    }
    
    return event;
  },
});

// Initialize Google Analytics
initGA();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();