# PeduliCarbon 🌱

Platform carbon offset yang menggamifikasi aksi lingkungan dengan NFT dan points di Internet Computer blockchain.

## 🏗️ Arsitektur Sistem

```mermaid
graph TB
    subgraph "Frontend"
        UI[Web/Mobile UI]
    end
    
    subgraph "Backend Go"
        API[Gin REST API]
        Auth[Email Auth]
        MissionSvc[Mission Service]
        RewardSvc[Reward Service]
        WalletSvc[Wallet Service]
    end
    
    subgraph "Database"
        DB[(PostgreSQL)]
    end
    
    subgraph "Blockchain"
        Motoko[Motoko Canister]
        ICP[Internet Computer]
    end
    
    UI --> API
    API --> Auth
    API --> MissionSvc
    API --> RewardSvc
    API --> WalletSvc
    
    MissionSvc --> DB
    RewardSvc --> DB
    WalletSvc --> DB
    Auth --> DB
    
    API --> Motoko
    Motoko --> ICP
    
    style UI fill:#e1f5fe
    style API fill:#f3e5f5
    style DB fill:#e8f5e8
    style Motoko fill:#fff3e0
```

## 🎯 Fitur Utama

- **🌱 Carbon Offset Missions**: Selesaikan tantangan lingkungan
- **🎨 NFT Rewards**: Dapatkan NFT unik untuk misi selesai
- **🏆 Point System**: Kumpulkan points untuk rewards
- **💼 Digital Wallet**: Kelola carbon credits
- **🔐 Email Authentication**: Login dengan email + password

## 🚀 Quick Start

### Prerequisites

- Go 1.21+
- PostgreSQL 15+
- dfx (Internet Computer SDK)

### Installation

1. **Clone repository**
   ```bash
   git clone https://github.com/yourusername/pedulicarbon.git
   cd pedulicarbon
   ```

2. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env dengan konfigurasi kamu
   ```

3. **Start dependencies**
   ```bash
   # Start PostgreSQL
   docker-compose up -d
   
   # Start local ICP replica
   dfx start --background
   ```

4. **Deploy Motoko canister**
   ```bash
   cd motoko/pedulicarbon
   dfx deploy
   ```

5. **Run aplikasi**
   ```bash
   go run main.go
   ```

## 📊 User Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant API as Go API
    participant DB as Database
    participant Motoko as Motoko Canister
    
    U->>F: Register/Login
    F->>API: POST /auth/register
    API->>DB: Create user
    API-->>F: Success
    
    U->>F: Browse missions
    F->>API: GET /missions
    API->>DB: Fetch missions
    API-->>F: Mission list
    
    U->>F: Take mission
    F->>API: POST /missions/{id}/take
    API->>DB: Create mission_taken
    API-->>F: Mission taken
    
    U->>F: Submit proof
    F->>API: POST /missions/{id}/submit-proof
    API->>Motoko: VerifyAction(proof)
    Motoko-->>API: Verified
    API->>Motoko: MintNFT(userId, missionId)
    Motoko-->>API: NFT minted
    API-->>F: Mission completed
    
    U->>F: Claim NFT
    F->>API: POST /nfts/{id}/claim
    API->>Motoko: ClaimNFT(nftId, userPrincipal)
    Motoko-->>API: NFT claimed
    API-->>F: NFT received
```

## 🗄️ Database Schema

```mermaid
erDiagram
    users {
        uint id PK
        string name
        string email UK
        string ii_principal
        int points
        timestamp created_at
        timestamp updated_at
    }
    
    missions {
        uint id PK
        string title
        string description
        int points
        string asset_type
        float asset_amount
        string verification_type
        timestamp created_at
        timestamp updated_at
    }
    
    mission_taken {
        uint id PK
        uint user_id FK
        uint mission_id FK
        string proof_data
        string status
        timestamp submitted_at
        timestamp verified_at
    }
    
    user_nfts {
        uint id PK
        uint user_id FK
        uint mission_id FK
        string nft_id
        string status
        timestamp minted_at
        timestamp claimed_at
    }
    
    reward_catalog {
        uint id PK
        string name
        string description
        int points_required
        string reward_type
        boolean is_active
        timestamp created_at
    }
    
    rewards {
        uint id PK
        uint user_id FK
        uint reward_catalog_id FK
        string status
        timestamp redeemed_at
        timestamp delivered_at
    }
    
    wallets {
        uint id PK
        uint user_id FK
        string address
        decimal balance
        timestamp created_at
        timestamp updated_at
    }
    
    withdraws {
        uint id PK
        uint user_id FK
        decimal amount
        string status
        timestamp requested_at
        timestamp processed_at
    }
    
    users ||--o{ mission_taken : "takes"
    users ||--o{ user_nfts : "owns"
    users ||--o{ rewards : "redeems"
    users ||--o{ wallets : "has"
    users ||--o{ withdraws : "requests"
    
    missions ||--o{ mission_taken : "taken_by"
    missions ||--o{ user_nfts : "generates"
    
    reward_catalog ||--o{ rewards : "redeemed_as"
```

## 🔧 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /users/profile/:id` - Get user profile

### Missions
- `GET /missions` - List all missions
- `GET /missions/:id` - Get specific mission
- `POST /missions` - Create new mission
- `POST /missions/:id/take` - Take a mission
- `POST /missions/:id/submit-proof` - Submit mission proof
- `POST /missions/:id/verify` - Verify mission
- `GET /users/:user_id/missions` - Get user's taken missions

### NFTs
- `GET /users/:user_id/nfts` - List user's NFTs
- `POST /nfts/:id/claim` - Claim an NFT

### Rewards
- `GET /rewards/catalog` - List reward catalog
- `POST /rewards/catalog/:id/redeem` - Redeem a reward
- `GET /rewards/user/:user_id` - Get user's rewards

### Wallet
- `GET /wallets/user/:user_id` - Get user wallet
- `POST /wallets` - Create wallet
- `PUT /wallets` - Update wallet
- `POST /wallets/withdraw` - Request withdrawal

## 🛠️ Technology Stack

- **Backend**: Go 1.21+ dengan Gin framework
- **Database**: PostgreSQL dengan GORM
- **Blockchain**: Internet Computer (Motoko)
- **Authentication**: Email-based dengan JWT
- **Agent**: agent-go untuk komunikasi dengan ICP

## 📁 Project Structure

```
pedulicarbon/
├── 📁 docs/                    # Documentation
├── 📁 internal/                # Go application code
│   ├── 📁 api/                 # HTTP handlers
│   ├── 📁 model/               # Data models
│   ├── 📁 repository/          # Data access layer
│   ├── 📁 service/             # Business logic
│   └── 📁 motoko/              # Motoko client
├── 📁 motoko/                  # Motoko canister
├── 📄 main.go                  # Application entry point
├── 📄 go.mod                   # Go dependencies
└── 📄 README.md                # This file
```

## 🚀 Deployment

### Local Development
```bash
# Start all services
docker-compose up -d
dfx start --background
dfx deploy

# Run application
go run main.go
```

### Environment Variables
```bash
# Database
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=pedulicarbon
DB_PORT=5432

# Internet Computer
ICP_CANISTER_HOST=http://localhost:4943
ICP_CANISTER_ID=rrkah-fqaaa-aaaaa-aaaaq-cai
ICP_PRINCIPAL_ID=your-principal-id

# Identity (untuk agent-go)
IDENTITY_PATH=./identity.pem
IDENTITY_PASSPHRASE=pedulicarbon
```

## 🧪 Testing

### End-to-End Testing
```bash
# Test complete user flow
go run test-agent.go
```

## 📚 Documentation

- [📖 API Documentation](docs/api_openapi.yaml) - Complete API specification
- [🚀 Deployment Guide](docs/DEPLOYMENT.md) - Production deployment instructions
- [🔗 Frontend Integration](docs/FRONTEND_INTEGRATION.md) - Frontend integration guide
- [🛠️ Troubleshooting](docs/TROUBLESHOOTING.md) - Common issues and solutions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/pedulicarbon/issues)
- **Email**: support@pedulicarbon.com

---

**Made with ❤️ for a greener future** 🌍 