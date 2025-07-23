// CORS Configuration Utility

const corsConfig = {
  // Development environment
  development: {
    // Use proxy for development to avoid CORS issues
    useProxy: true,
    // Fallback API URL if proxy fails
    fallbackURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  },
  
  // Production environment
  production: {
    // In production, API should be on same domain or properly configured CORS
    useProxy: false,
    apiURL: process.env.REACT_APP_API_URL,
  },
  
  // Test environment
  test: {
    useProxy: false,
    apiURL: 'http://localhost:8080',
  }
};

export const getCorsConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  return corsConfig[env] || corsConfig.development;
};

export const getApiURL = () => {
  const config = getCorsConfig();
  
  if (config.useProxy) {
    // In development, use relative URL to leverage proxy
    return '/api';
  }
  
  return config.apiURL || config.fallbackURL;
};

export const getCorsHeaders = () => {
  const config = getCorsConfig();
  
  if (config.useProxy) {
    return {
      'Content-Type': 'application/json',
    };
  }
  
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
};

export default corsConfig; 