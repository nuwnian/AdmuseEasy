import ReactGA from 'react-ga4';

// Initialize Google Analytics
export const initGA = () => {
  const trackingId = process.env.REACT_APP_GA_TRACKING_ID;
  
  if (trackingId) {
    ReactGA.initialize(trackingId, {
      debug: process.env.NODE_ENV === 'development',
      titleCase: false,
      gaOptions: {
        send_page_view: false // We'll manually track page views
      }
    });
    
    console.log('Google Analytics initialized');
  } else {
    console.warn('Google Analytics tracking ID not found');
  }
};

// Track page views
export const trackPageView = (path, title) => {
  ReactGA.send({ 
    hitType: "pageview", 
    page: path,
    title: title || document.title
  });
};

// Track events
export const trackEvent = (action, category, label, value) => {
  ReactGA.event({
    action,
    category,
    label,
    value
  });
};

// Track conversions (ad generations)
export const trackConversion = (mascot, productType) => {
  ReactGA.event({
    action: 'generate_ad',
    category: 'conversion',
    label: mascot,
    custom_parameters: {
      product_type: productType
    }
  });
};

// Track user interactions
export const trackUserAction = (action, element) => {
  ReactGA.event({
    action,
    category: 'user_interaction',
    label: element
  });
};

// Track authentication events
export const trackAuth = (action, method) => {
  ReactGA.event({
    action,
    category: 'authentication',
    label: method // 'google', 'email', etc.
  });
};

// Set user properties (when logged in)
export const setUserProperties = (userId, properties) => {
  ReactGA.set({
    user_id: userId,
    ...properties
  });
};