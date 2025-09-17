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
    
    // Get release information from environment or git
    const release = process.env.SENTRY_RELEASE || 
                   process.env.npm_package_version || 
                   require('../../package.json').version;
    
    console.log('Sentry Release:', release);
    
    // Initialize Sentry for error tracking
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV || 'development',
      
      // Release tracking for code mapping
      release: `admuse-easy@${release}`,
      
      // Performance monitoring
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      
      // Error filtering (don't send certain errors)
      beforeSend(event) {
        // Add repository information to events
        if (!event.extra) event.extra = {};
        event.extra.repository = 'nuwnian/AdmuseEasy';
        event.extra.branch = process.env.GIT_BRANCH || 'main';
        event.extra.commit = process.env.GIT_COMMIT || 'unknown';
        
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
    console.log('Sentry initialized successfully with release tracking');
    return true;
  } catch (error) {
    console.error('Failed to initialize Sentry:', error);
    return false;
  }
};

// Request handler middleware - using newer Sentry v8+ API
const sentryRequestHandler = () => {
  if (!sentryInitialized) {
    return (req, res, next) => next();
  }
  
  try {
    // In Sentry v8+, use expressIntegration instead of handlers
    return (req, res, next) => {
      // Add Sentry request context
      Sentry.getCurrentScope().setContext('http', {
        method: req.method,
        url: req.url,
        headers: req.headers,
      });
      next();
    };
  } catch (err) {
    console.error('Sentry requestHandler failed:', err);
    return (req, res, next) => next();
  }
};

// Tracing middleware - simplified for newer Sentry versions
const sentryTracingHandler = () => {
  if (!sentryInitialized) {
    return (req, res, next) => next();
  }
  
  try {
    return (req, res, next) => {
      // Create a transaction for this request
      const transaction = Sentry.startTransaction({
        op: 'http.server',
        name: `${req.method} ${req.route?.path || req.url}`,
      });
      
      // Set the transaction on the scope
      Sentry.getCurrentScope().setSpan(transaction);
      
      // Finish the transaction when the response ends
      res.on('finish', () => {
        transaction.setHttpStatus(res.statusCode);
        transaction.finish();
      });
      
      next();
    };
  } catch (err) {
    console.error('Sentry tracingHandler failed:', err);
    return (req, res, next) => next();
  }
};

// Middleware to capture Express.js errors
const sentryErrorHandler = () => {
  if (!sentryInitialized) {
    // Return a no-op middleware if Sentry isn't configured
    return (error, req, res, next) => {
      console.error('Error (Sentry not configured):', error.message);
      next(error);
    };
  }
  
  try {
    return (error, req, res, next) => {
      // Capture the error in Sentry
      Sentry.captureException(error, {
        extra: {
          url: req.url,
          method: req.method,
          headers: req.headers,
          body: req.body,
        },
      });
      
      console.error('Error captured by Sentry:', error.message);
      next(error);
    };
  } catch (err) {
    console.error('Sentry errorHandler failed:', err);
    return (error, req, res, next) => {
      console.error('Error (Sentry handler failed):', error.message);
      next(error);
    };
  }
};

module.exports = {
  initSentry,
  sentryErrorHandler,
  sentryRequestHandler,
  sentryTracingHandler,
  Sentry
};