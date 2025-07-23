// CORS Error Handler Utility

export const handleCorsError = (error) => {
  if (error.code === 'ERR_NETWORK') {
    console.error('🌐 Network Error - Possible CORS issue');
    console.error('Error details:', error.message);
    
    return {
      type: 'CORS_ERROR',
      message: 'Cannot connect to server. Check internet connection or CORS configuration.',
      suggestions: [
        'Check if backend server is running',
        'Make sure API URL is correct in .env file',
        'For development, use proxy: npm run setup:proxy',
        'Check browser console for error details'
      ]
    };
  }
  
  if (error.response?.status === 0) {
    return {
      type: 'CORS_ERROR',
      message: 'CORS Error - Server cannot be accessed',
      suggestions: [
        'Backend server might not be running',
        'Check firewall or network settings',
        'Try accessing API URL directly in browser'
      ]
    };
  }
  
  return null;
};

export const getCorsTroubleshootingSteps = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment) {
    return [
      '1. Setup proxy: npm run setup:proxy',
      '2. Install proxy middleware: npm install http-proxy-middleware',
      '3. Restart development server: npm start',
      '4. Check .env file for correct API URL',
      '5. Verify backend server is running'
    ];
  }
  
  return [
    '1. Check backend CORS configuration',
    '2. Verify API URL is correct',
    '3. Ensure backend allows requests from frontend domain',
    '4. Check network connectivity',
    '5. Review server logs for CORS errors'
  ];
};

export const logCorsError = (error, context = '') => {
  console.group('🚫 CORS Error Detected');
  console.error('Context:', context);
  console.error('Error:', error);
  console.error('Environment:', process.env.NODE_ENV);
  console.error('API URL:', process.env.REACT_APP_API_URL);
  console.error('Troubleshooting steps:');
  getCorsTroubleshootingSteps().forEach(step => {
    console.error('  ' + step);
  });
  console.groupEnd();
};

export default {
  handleCorsError,
  getCorsTroubleshootingSteps,
  logCorsError
}; 