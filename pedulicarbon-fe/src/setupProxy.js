const { createProxyMiddleware } = require('http-proxy-middleware');

const proxyConfig = {
  "/api": {
    "target": process.env.REACT_APP_API_URL || "http://localhost:8080",
    "changeOrigin": true,
    "pathRewrite": {
      "^/api": ""
    },
    "secure": false,
    "logLevel": "debug"
  }
};

module.exports = function(app) {
  // Proxy API requests
  app.use('/api', createProxyMiddleware(proxyConfig['/api']));
  
  // Log proxy setup
  console.log('🔧 Development proxy configured for:', proxyConfig['/api'].target);
};
