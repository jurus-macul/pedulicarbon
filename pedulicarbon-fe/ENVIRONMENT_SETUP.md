# Environment Setup Guide - PeduliCarbon Frontend

## Overview
Frontend React.js untuk platform PeduliCarbon menggunakan environment variables untuk konfigurasi yang fleksibel dan aman.

## Environment Variables

### Required Variables
Buat file `.env` di root directory dengan variabel berikut:

```bash
# API Configuration
REACT_APP_API_URL=http://localhost:8080
REACT_APP_API_TIMEOUT=10000

# App Configuration
REACT_APP_APP_NAME=PeduliCarbon
REACT_APP_APP_VERSION=1.0.0

# Blockchain Configuration (Internet Computer)
REACT_APP_ICP_CANISTER_HOST=http://localhost:4943
REACT_APP_ICP_CANISTER_ID=rrkah-fqaaa-aaaaa-aaaaq-cai

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_ENABLE_DEBUG_MODE=true

# External Services (Optional)
REACT_APP_SENTRY_DSN=
REACT_APP_GOOGLE_ANALYTICS_ID=
```

### Variable Descriptions

#### API Configuration
- `REACT_APP_API_URL`: URL backend Go API (default: http://localhost:8080)
- `REACT_APP_API_TIMEOUT`: Timeout untuk API requests dalam milliseconds (default: 10000)

#### App Configuration
- `REACT_APP_APP_NAME`: Nama aplikasi (default: PeduliCarbon)
- `REACT_APP_APP_VERSION`: Versi aplikasi (default: 1.0.0)

#### Blockchain Configuration
- `REACT_APP_ICP_CANISTER_HOST`: Host Internet Computer replica (default: http://localhost:4943)
- `REACT_APP_ICP_CANISTER_ID`: ID Motoko canister (default: rrkah-fqaaa-aaaaa-aaaaq-cai)

#### Feature Flags
- `REACT_APP_ENABLE_ANALYTICS`: Enable analytics tracking (default: false)
- `REACT_APP_ENABLE_DEBUG_MODE`: Enable debug mode (default: true)

#### External Services (Optional)
- `REACT_APP_SENTRY_DSN`: Sentry DSN untuk error tracking
- `REACT_APP_GOOGLE_ANALYTICS_ID`: Google Analytics ID

## Setup Instructions

### 1. Development Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env file sesuai kebutuhan
nano .env

# Install dependencies
npm install

# Setup proxy for CORS (optional, for development)
npm run setup:proxy

# Install proxy middleware (if using proxy)
npm install http-proxy-middleware

# Start development server
npm start
```

### 2. Production Environment
```bash
# Set production environment variables
export NODE_ENV=production
export REACT_APP_API_URL=https://api.pedulicarbon.com
export REACT_APP_ENABLE_DEBUG_MODE=false

# Build for production
npm run build
```

### 3. Docker Environment
```bash
# Build Docker image
docker build -t pedulicarbon-frontend .

# Run with environment variables
docker run -p 3000:3000 \
  -e REACT_APP_API_URL=https://api.pedulicarbon.com \
  -e REACT_APP_ENABLE_DEBUG_MODE=false \
  pedulicarbon-frontend
```

## Configuration Usage

### In Components
```javascript
import config from '../config';

// Access configuration
console.log(config.api.baseURL);
console.log(config.app.name);
console.log(config.features.debugMode);
```

### Environment-Specific Configs
```javascript
// Development
if (config.isDevelopment) {
  console.log('Running in development mode');
}

// Production
if (config.isProduction) {
  // Enable production optimizations
}
```

## Security Notes

### ⚠️ Important Security Considerations

1. **Never commit `.env` files** - Add to `.gitignore`
2. **Use HTTPS in production** - Always use secure URLs
3. **Validate environment variables** - Check required variables on app startup
4. **Use different configs per environment** - Dev, staging, production

### .gitignore Configuration
```gitignore
# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build files
build/
dist/

# Dependencies
node_modules/
```

## Troubleshooting

### Common Issues

1. **Environment variables not loading**
   - Restart development server after changing `.env`
   - Ensure variable names start with `REACT_APP_`
   - Check for typos in variable names

2. **API connection issues**
   - Verify `REACT_APP_API_URL` is correct
   - Check if backend server is running
   - Ensure CORS is configured on backend

3. **CORS Issues**
   - **Development**: Use proxy setup with `npm run setup:proxy`
   - **Production**: Ensure backend has proper CORS headers
   - Check browser console for CORS error details
   - Verify API URL is accessible from browser

4. **Build errors**
   - Clear build cache: `rm -rf build/`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

### Debug Mode
Enable debug mode to see configuration values:
```bash
REACT_APP_ENABLE_DEBUG_MODE=true npm start
```

## Environment-Specific Configurations

### Development
```bash
REACT_APP_API_URL=http://localhost:8080
REACT_APP_ENABLE_DEBUG_MODE=true
REACT_APP_ENABLE_ANALYTICS=false
```

### Staging
```bash
REACT_APP_API_URL=https://staging-api.pedulicarbon.com
REACT_APP_ENABLE_DEBUG_MODE=false
REACT_APP_ENABLE_ANALYTICS=true
```

### Production
```bash
REACT_APP_API_URL=https://api.pedulicarbon.com
REACT_APP_ENABLE_DEBUG_MODE=false
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_SENTRY_DSN=https://your-sentry-dsn
```

## Validation

### Environment Variable Validation
The app validates required environment variables on startup:

```javascript
// Check required variables
const requiredVars = [
  'REACT_APP_API_URL',
  'REACT_APP_ICP_CANISTER_HOST',
  'REACT_APP_ICP_CANISTER_ID'
];

requiredVars.forEach(varName => {
  if (!process.env[varName]) {
    console.warn(`Missing required environment variable: ${varName}`);
  }
});
```

## Support

For environment setup issues:
1. Check this documentation
2. Review console logs for validation errors
3. Verify backend API is accessible
4. Contact development team 