# PeduliCarbon Frontend

Frontend React.js untuk platform PeduliCarbon - Carbon Offset dengan NFT di Internet Computer blockchain.

## Quick Start

### Prerequisites
- Node.js 16+
- npm atau yarn
- Backend Go API running (lihat [pedulicarbon backend](pedulicarbon/))

### Installation

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd pedulicarbon-ui
   ```

2. **Setup environment variables**
   ```bash
   # Auto setup (recommended)
   npm run setup
   
   # Manual setup
   cp .env.example .env
   # Edit .env file sesuai kebutuhan
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start development server**
   ```bash
   npm start
   ```

5. **Open browser**
   ```
   http://localhost:3000
   ```

## Environment Configuration

### Required Environment Variables

Buat file `.env` di root directory:

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
```

### Environment Setup Script

Gunakan script otomatis untuk setup environment:

```bash
npm run setup
```

Script ini akan:
- Membuat file `.env` dengan template
- Memberikan instruksi selanjutnya
- Validasi environment variables

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Auth/           # Authentication components
│   └── Layout/         # Layout components
├── contexts/           # React Context providers
│   ├── AuthContext.js  # Authentication state
│   ├── MissionContext.js # Mission management
│   └── NFTContext.js   # NFT management
├── pages/              # Page components
│   ├── Auth/           # Login/Register pages
│   ├── Dashboard.js    # User dashboard
│   ├── Missions.js     # Mission listing
│   ├── NFTGallery.js   # NFT collection
│   ├── Rewards.js      # Reward redemption
│   ├── Wallet.js       # Wallet management
│   └── Profile.js      # User profile
├── services/           # API services
│   └── api.js          # Axios configuration
├── config/             # Configuration
│   └── index.js        # Centralized config
├── utils/              # Utility functions
│   └── envValidation.js # Environment validation
└── App.js              # Main app component
```

## Features

- Carbon Missions - Browse, take, and complete environmental missions
- NFT Gallery - View and claim mission rewards as NFTs
- Point System - Earn points and redeem rewards
- Digital Wallet - Manage carbon credits and transactions
- User Profile - Track achievements and manage settings
- Dashboard - Overview of user progress and statistics

## Technology Stack

- Frontend: React 18, React Router, React Query
- Styling: Tailwind CSS, Framer Motion
- Forms: React Hook Form
- HTTP Client: Axios
- Icons: Lucide React
- Charts: Recharts
- Notifications: React Hot Toast

## Authentication

Platform menggunakan email-based authentication dengan JWT tokens:

- Register dengan email dan password
- Login dengan credentials
- Protected routes untuk user yang sudah login
- Automatic token refresh dan logout

## Responsive Design

Frontend didesain responsive untuk:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## Deployment

### Development
```bash
npm start
```

### Production Build
```bash
npm run build
```

### Docker Deployment
```bash
# Build image
docker build -t pedulicarbon-frontend .

# Run container
docker run -p 3000:3000 \
  -e REACT_APP_API_URL=https://api.pedulicarbon.com \
  pedulicarbon-frontend
```

## Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run setup` - Setup environment variables
- `npm run eject` - Eject from Create React App

### Code Style

- ESLint untuk code linting
- Prettier untuk code formatting
- Conventional commits untuk git messages

## Documentation

- [Environment Setup](ENVIRONMENT_SETUP.md) - Detailed environment configuration
- [API Integration](pedulicarbon/docs/FRONTEND_INTEGRATION.md) - Backend integration guide
- [Deployment Guide](pedulicarbon/docs/DEPLOYMENT.md) - Production deployment

## Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## Troubleshooting

### Common Issues

1. Environment variables not loading
   - Restart development server
   - Check `.env` file exists
   - Verify variable names start with `REACT_APP_`

2. API connection errors
   - Verify backend server is running
   - Check `REACT_APP_API_URL` in `.env`
   - Ensure CORS is configured on backend

3. Build errors
   - Clear cache: `rm -rf build/`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

## Support

- Issues: [GitHub Issues](https://github.com/yourusername/pedulicarbon/issues)
- Email: support@pedulicarbon.com
- Documentation: [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md)

---

Made with love for a greener future 