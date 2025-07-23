# PeduliCarbon

PeduliCarbon is a platform that gamifies environmental actions. Users complete carbon offset missions, submit proof, and receive NFT rewards. The project consists of a Go backend, a PostgreSQL database, and a Motoko smart contract on the Internet Computer blockchain.

## Project Architecture

- **Frontend:** Web/mobile UI (not included in this repository)
- **Backend (Go):** REST API for user, mission, reward, and wallet management. Handles business logic and communicates with the Motoko canister.
- **Database (PostgreSQL):** Stores user, mission, reward, and wallet data.
- **Blockchain (Motoko/Internet Computer):** Manages NFT minting, verification, and user NFT data on-chain.

System flow:
```
User -> Frontend -> Go Backend API -> Motoko Canister -> Internet Computer
```

## Main Features
- Carbon offset missions and proof submission
- NFT rewards for completed missions
- Point system and digital wallet
- Email-based authentication

## Quick Start

### Prerequisites
- Go 1.18 or higher
- PostgreSQL
- DFX (Internet Computer SDK)

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/pedulicarbon.git
   cd pedulicarbon
   ```
2. Set up environment variables (see `.env.example` if available).
3. Start PostgreSQL and run database migrations if needed.
4. Start the Internet Computer local replica:
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
- `internal/` - Go backend code (API, services, repositories, models)
- `motoko/` - Motoko smart contract code
- `main.go` - Go application entry point
- `go.mod`, `go.sum` - Go dependencies

## Contributing
Contributions and suggestions are welcome. Please open an issue or pull request. 