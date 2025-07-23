#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const envTemplate = `# carboncare Frontend Environment Variables
# Copy this file to .env and update the values
# API Configuration
REACT_APP_API_URL=http://localhost:8080
REACT_APP_API_TIMEOUT=10000
# App Configuration
REACT_APP_APP_NAME=carboncare
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
`;

const envPath = path.join(process.cwd(), '.env');

function setupEnvironment() {
  console.log('🌱 Setting up carboncare Frontend Environment...\n');

  // Check if .env already exists
  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env file already exists!');
    console.log('   If you want to overwrite it, delete the existing file first.\n');
    return;
  }

  try {
    // Create .env file
    fs.writeFileSync(envPath, envTemplate);
    
    console.log('✅ .env file created successfully!');
    console.log('📝 Please review and update the values in .env file as needed.\n');
    
    console.log('🔧 Next steps:');
    console.log('   1. Edit .env file with your configuration');
    console.log('   2. Run: npm install');
    console.log('   3. Run: npm start\n');
    
    console.log('📚 For more information, see ENVIRONMENT_SETUP.md');
    
  } catch (error) {
    console.error('❌ Error creating .env file:', error.message);
    process.exit(1);
  }
}

// Run setup if this script is executed directly
if (require.main === module) {
  setupEnvironment();
}

module.exports = setupEnvironment; 