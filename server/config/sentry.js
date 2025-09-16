const Sentry = require('@sentry/node');

let sentryInitialized = false;

const initSentry = () => {
  // Only initialize Sentry if DSN is provided
  if (!process.env.SENTRY_DSN || process.env.SENTRY_DSN === 'your-sentry-dsn-here') {
    console.log('Sentry DSN not configured, skipping Sentry initialization');
    return false;
  }
  
  try {
    console.log('Initializing Sentry with DSN:', process.env.SENTRY_DSN.substring(0, 20) + '...');
    
    // Initialize Sentry for error tracking
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV || 'development',
      
      // Performance monitoring
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      
      // Release tracking
      release: process.env.SENTRY_RELEASE || '1.0.0',
      
      // Error filtering (don't send certain errors)
      beforeSend(event) {
        // Filter out development errors
        if (process.env.NODE_ENV === 'development') {
          console.log('Sentry Event:', event);
        }
        
        // Don't send authentication failures (too noisy)
        if (event.exception?.values?.[0]?.value?.includes('Invalid credentials')) {
          return null;
        }
        
        return event;
      },
    });
    
    sentryInitialized = true;
    console.log('Sentry initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize Sentry:', error);
    return false;
  }
};

// Middleware to capture Express.js errors
const sentryErrorHandler = () => {
  if (!sentryInitialized || !Sentry.Handlers || !Sentry.Handlers.errorHandler) {
    // Return a no-op middleware if Sentry isn't configured
    return (error, req, res, next) => {
      console.error('Error (Sentry not configured):', error.message);
      next(error);
    };
  }
  
  try {
    return Sentry.Handlers.errorHandler({
      shouldHandleError(error) {
        // Capture all errors for production, but only 5xx for development
        return process.env.NODE_ENV === 'production' || error.status >= 500;
      },
    });
  } catch (err) {
    console.error('Sentry errorHandler failed:', err);
    return (error, req, res, next) => {
      console.error('Error (Sentry handler failed):', error.message);
      next(error);
    };
  }
};

// Request handler middleware
const sentryRequestHandler = () => {
  if (!sentryInitialized || !Sentry.Handlers || !Sentry.Handlers.requestHandler) {
    console.log('Sentry not initialized or handlers not available, using no-op middleware');
    return (req, res, next) => next();
  }
  
  try {
    return Sentry.Handlers.requestHandler();
  } catch (err) {
    console.error('Sentry requestHandler failed:', err);
    return (req, res, next) => next();
  }
};

// Tracing middleware
const sentryTracingHandler = () => {
  if (!sentryInitialized || !Sentry.Handlers || !Sentry.Handlers.tracingHandler) {
    console.log('Sentry not initialized or handlers not available, using no-op middleware');
    return (req, res, next) => next();
  }
  
  try {
    return Sentry.Handlers.tracingHandler();
  } catch (err) {
    console.error('Sentry tracingHandler failed:', err);
    return (req, res, next) => next();
  }
};

module.exports = {
  initSentry,
  sentryErrorHandler,
  sentryRequestHandler,
  sentryTracingHandler,
  Sentry
};