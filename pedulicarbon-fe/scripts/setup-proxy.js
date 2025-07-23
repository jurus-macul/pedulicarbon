#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const setupProxy = () => {
  console.log('🔧 Setting up development proxy...\n');

  const proxyConfig = {
    '/api': {
      target: process.env.REACT_APP_API_URL || 'http://localhost:8080',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', // Remove /api prefix when forwarding to backend
      },
      secure: false,
      logLevel: 'debug',
    },
  };

  const setupProxyPath = path.join(process.cwd(), 'src', 'setupProxy.js');
  
  const setupProxyContent = `const { createProxyMiddleware } = require('http-proxy-middleware');

const proxyConfig = ${JSON.stringify(proxyConfig, null, 2)};

module.exports = function(app) {
  // Proxy API requests
  app.use('/api', createProxyMiddleware(proxyConfig['/api']));
  
  // Log proxy setup
  console.log('🔧 Development proxy configured for:', proxyConfig['/api'].target);
};
`;

  try {
    // Check if setupProxy.js already exists
    if (fs.existsSync(setupProxyPath)) {
      console.log('⚠️  setupProxy.js already exists!');
      console.log('   If you want to overwrite it, delete the existing file first.\n');
      return;
    }

    // Create setupProxy.js
    fs.writeFileSync(setupProxyPath, setupProxyContent);
    
    console.log('✅ setupProxy.js created successfully!');
    console.log('📝 Proxy configuration:');
    console.log(`   Target: ${proxyConfig['/api'].target}`);
    console.log(`   Path: /api -> ${proxyConfig['/api'].target}\n`);
    
    console.log('🔧 Next steps:');
    console.log('   1. Install http-proxy-middleware: npm install http-proxy-middleware');
    console.log('   2. Restart development server: npm start');
    console.log('   3. API calls will be proxied automatically\n');
    
  } catch (error) {
    console.error('❌ Error creating setupProxy.js:', error.message);
    process.exit(1);
  }
};

// Run setup if this script is executed directly
if (require.main === module) {
  setupProxy();
}

module.exports = setupProxy; 