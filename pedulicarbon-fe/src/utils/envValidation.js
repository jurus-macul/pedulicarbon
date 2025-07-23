// Environment variable validation utility

const requiredEnvVars = [
  'REACT_APP_API_URL',
  'REACT_APP_ICP_CANISTER_HOST',
  'REACT_APP_ICP_CANISTER_ID'
];

const optionalEnvVars = [
  'REACT_APP_API_TIMEOUT',
  'REACT_APP_APP_NAME',
  'REACT_APP_APP_VERSION',
  'REACT_APP_ENABLE_ANALYTICS',
  'REACT_APP_ENABLE_DEBUG_MODE',
  'REACT_APP_SENTRY_DSN',
  'REACT_APP_GOOGLE_ANALYTICS_ID'
];

export const validateEnvironment = () => {
  const missingVars = [];
  const warnings = [];

  // Check required variables
  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  // Check optional variables and provide warnings
  optionalEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      warnings.push(`${varName} is not set, using default value`);
    }
  });

  // Log validation results
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars);
    console.error('Please check your .env file and ensure all required variables are set.');
    return false;
  }

  if (warnings.length > 0 && process.env.NODE_ENV === 'development') {
    console.warn('⚠️ Environment warnings:', warnings);
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('✅ Environment validation passed');
    console.log('📋 Current configuration:');
    console.log(`   API URL: ${process.env.REACT_APP_API_URL}`);
    console.log(`   ICP Host: ${process.env.REACT_APP_ICP_CANISTER_HOST}`);
    console.log(`   Debug Mode: ${process.env.REACT_APP_ENABLE_DEBUG_MODE === 'true'}`);
  }

  return true;
};

export const getEnvironmentInfo = () => {
  return {
    nodeEnv: process.env.NODE_ENV,
    apiUrl: process.env.REACT_APP_API_URL,
    canisterHost: process.env.REACT_APP_ICP_CANISTER_HOST,
    canisterId: process.env.REACT_APP_ICP_CANISTER_ID,
    debugMode: process.env.REACT_APP_ENABLE_DEBUG_MODE === 'true',
    analytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
  };
};

export default validateEnvironment; 