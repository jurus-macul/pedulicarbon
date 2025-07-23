// Centralized configuration for carboncare frontend

const config = {
  // API Configuration
  api: {
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
    timeout: parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000,
  },

  // App Configuration
  app: {
    name: process.env.REACT_APP_APP_NAME || 'carboncare',
    version: process.env.REACT_APP_APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  },

  // Blockchain Configuration (Internet Computer)
  blockchain: {
    canisterHost: process.env.REACT_APP_ICP_CANISTER_HOST || 'http://localhost:4943',
    canisterId: process.env.REACT_APP_ICP_CANISTER_ID || 'rrkah-fqaaa-aaaaa-aaaaq-cai',
  },

  // Feature Flags
  features: {
    analytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
    debugMode: process.env.REACT_APP_ENABLE_DEBUG_MODE === 'true',
  },

  // External Services
  services: {
    sentry: {
      dsn: process.env.REACT_APP_SENTRY_DSN || '',
    },
    googleAnalytics: {
      id: process.env.REACT_APP_GOOGLE_ANALYTICS_ID || '',
    },
  },

  // Development helpers
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
};

export default config; 