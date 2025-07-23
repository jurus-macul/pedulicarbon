# CarbonCare

CarbonCare is a platform that gamifies environmental actions. Users complete carbon offset missions, submit proof, and receive NFT rewards. The project consists of a React frontend, a Go backend, a PostgreSQL database, and a Motoko smart contract on the Internet Computer blockchain.

## Project Architecture

- **Frontend (React):** User interface for browsing, taking, and completing missions, viewing NFT rewards, managing points, wallet, and user profile.
- **Backend (Go):** REST API for user, mission, reward, and wallet management. Handles business logic, authentication, and communicates with the Motoko canister.
- **Database (PostgreSQL):** Stores user, mission, reward, and wallet data.
- **Blockchain (Motoko/Internet Computer):** Manages NFT minting, verification, and user NFT data on-chain.

System flow:
```
User -> Frontend (React) -> Go Backend API -> Motoko Canister -> Internet Computer
```

## Main Features

- Carbon offset missions and proof submission
- NFT rewards for completed missions
- Point system and digital wallet
- Email-based authentication
- User dashboard, profile, and statistics

## Quick Start

### Prerequisites

- Node.js 16+ and npm (for frontend)
- Go 1.18 or higher (for backend)
- PostgreSQL
- DFX (Internet Computer SDK)

### Setup

#### Frontend

1. Go to the frontend directory:
   ```bash
   cd pedulicarbon-fe
   ```
2. Set up environment variables:
   ```bash
   npm run setup
   # or manually: cp .env.example .env
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```
   The app will be available at `http://localhost:3000`.

#### Backend

1. Go to the backend directory:
   ```bash
   cd pedulicarbon-be
   ```
2. Set up environment variables (see `.env.example` if available).
3. Start PostgreSQL and run database migrations if needed.
4. Start the Internet Computer local replica and deploy the Motoko canister:
   ```bash
   dfx start --background
   cd motoko/pedulicarbon
   dfx deploy
   cd ../..
   ```
5. Run the Go backend:
   ```bash
   go run main.go
   ```

## Project Structure

- `pedulicarbon-fe/` - React frontend application
- `pedulicarbon-be/` - Go backend application, Motoko smart contract, and database integration

## Technology Stack

- **Frontend:** React, Tailwind CSS, Axios, React Router, React Query, Framer Motion
- **Backend:** Go, Gin, GORM, PostgreSQL, agent-go (for Internet Computer integration)
- **Blockchain:** Motoko (Internet Computer)
- **Authentication:** Email-based with JWT

## Contributing

Contributions and suggestions are welcome. Please open an issue or pull request. 