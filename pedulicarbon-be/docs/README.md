# PeduliCarbon 🌱

A gamified carbon offset platform that rewards environmental actions with NFTs and points on the Internet Computer blockchain.

## 🏗️ System Architecture

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[🌐 Web/Mobile UI]
        Wallet[💼 ICP Wallet]
    end
    
    subgraph "Backend Layer"
        API[🔧 Go REST API]
        Auth[🔐 Auth Service]
        MissionSvc[🎯 Mission Service]
        RewardSvc[🏆 Reward Service]
        WalletSvc[💰 Wallet Service]
    end
    
    subgraph "Data Layer"
        DB[(🗄️ PostgreSQL)]
        Cache[(⚡ Redis)]
    end
    
    subgraph "Blockchain Layer"
        Motoko[⚡ Motoko Canister]
        ICP[🌐 Internet Computer]
    end
    
    UI --> API
    Wallet --> API
    API --> Auth
    API --> MissionSvc
    API --> RewardSvc
    API --> WalletSvc
    
    MissionSvc --> DB
    RewardSvc --> DB
    WalletSvc --> DB
    Auth --> DB
    
    API --> Cache
    API --> Motoko
    Motoko --> ICP
    
    style UI fill:#e1f5fe
    style API fill:#f3e5f5
    style DB fill:#e8f5e8
    style Motoko fill:#fff3e0
    style ICP fill:#ffebee
```

## 🎯 Core Features

- **🌱 Carbon Offset Missions**: Complete environmental challenges
- **🎨 NFT Rewards**: Earn unique NFTs for completed missions
- **🏆 Point System**: Accumulate points for rewards
- **💼 Digital Wallet**: Manage your carbon credits
- **🔐 Secure Authentication**: Email-based with ICP integration
- **📱 Mobile Ready**: Responsive design for all devices

## 🚀 Quick Start

### Prerequisites

- Go 1.21+
- PostgreSQL 15+
- Redis 7+
- dfx (Internet Computer SDK)
- Node.js 18+ (for testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pedulicarbon.git
   cd pedulicarbon
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start dependencies**
   ```bash
   # Start PostgreSQL and Redis
   docker-compose up -d
   
   # Start local ICP replica
   dfx start --background
   ```

4. **Deploy Motoko canister**
   ```bash
   cd motoko/pedulicarbon
   dfx deploy
   ```

5. **Run the application**
   ```bash
   go run main.go
   ```

## 📊 User Flow

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant F as 🌐 Frontend
    participant API as 🔧 Go API
    participant DB as 🗄️ Database
    participant Motoko as ⚡ Motoko Canister
    
    U->>F: Register/Login
    F->>API: POST /api/users/register
    API->>DB: Create user
    API-->>F: Success
    
    U->>F: Browse missions
    F->>API: GET /api/missions
    API->>DB: Fetch missions
    API-->>F: Mission list
    
    U->>F: Take mission
    F->>API: POST /api/missions/{id}/take
    API->>DB: Create mission_taken
    API-->>F: Mission taken
    
    U->>F: Submit proof
    F->>API: POST /api/missions/{id}/submit-proof
    API->>Motoko: VerifyMission(proof)
    Motoko-->>API: Verified
    API->>Motoko: MintNFT(userId, missionId)
    Motoko-->>API: NFT minted
    API-->>F: Mission completed
    
    U->>F: Claim NFT
    F->>API: POST /api/nfts/{id}/claim
    API->>Motoko: ClaimNFT(nftId, userPrincipal)
    Motoko-->>API: NFT claimed
    API-->>F: NFT received
    
    U->>F: Redeem reward
    F->>API: POST /api/rewards/redeem
    API->>DB: Check points & create reward
    API-->>F: Reward redeemed
```

## 🗄️ Database Schema

```mermaid
erDiagram
    users {
        uuid id PK
        string email UK
        string password_hash
        string principal
        int points
        timestamp created_at
        timestamp updated_at
    }
    
    missions {
        uuid id PK
        string title
        text description
        int carbon_offset
        int points_reward
        string proof_type
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }
    
    mission_taken {
        uuid id PK
        uuid user_id FK
        uuid mission_id FK
        string proof_data
        string status
        timestamp submitted_at
        timestamp verified_at
    }
    
    user_nfts {
        uuid id PK
        uuid user_id FK
        uuid mission_id FK
        string nft_id
        string status
        timestamp minted_at
        timestamp claimed_at
    }
    
    reward_catalog {
        uuid id PK
        string name
        text description
        int points_required
        string reward_type
        boolean is_active
        timestamp created_at
    }
    
    rewards {
        uuid id PK
        uuid user_id FK
        uuid reward_catalog_id FK
        string status
        timestamp redeemed_at
        timestamp delivered_at
    }
    
    users ||--o{ mission_taken : "takes"
    users ||--o{ user_nfts : "owns"
    users ||--o{ rewards : "redeems"
    missions ||--o{ mission_taken : "taken_by"
    missions ||--o{ user_nfts : "generates"
    reward_catalog ||--o{ rewards : "redeemed_as"
```

## 🔧 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile

### Missions
- `GET /api/missions` - List all missions
- `POST /api/missions/{id}/take` - Take a mission
- `POST /api/missions/{id}/submit-proof` - Submit mission proof
- `GET /api/missions/taken` - Get user's taken missions

### NFTs
- `GET /api/nfts` - List user's NFTs
- `POST /api/nfts/{id}/claim` - Claim an NFT

### Rewards
- `GET /api/rewards/catalog` - List reward catalog
- `POST /api/rewards/redeem` - Redeem a reward
- `GET /api/rewards/history` - Get reward history

### Wallet
- `GET /api/wallet/balance` - Get wallet balance
- `POST /api/wallet/withdraw` - Request withdrawal

## 🛠️ Technology Stack

```mermaid
graph LR
    subgraph "Backend"
        Go[Go 1.21+]
        Gin[Gin Framework]
        GORM[GORM ORM]
        JWT[JWT Auth]
    end
    
    subgraph "Database"
        PostgreSQL[PostgreSQL 15+]
        Redis[Redis 7+]
    end
    
    subgraph "Blockchain"
        Motoko[Motoko]
        ICP[Internet Computer]
        AgentGo[agent-go]
    end
    
    subgraph "Infrastructure"
        Docker[Docker]
        DockerCompose[Docker Compose]
        GitHubActions[GitHub Actions]
    end
    
    Go --> Gin
    Gin --> GORM
    GORM --> PostgreSQL
    Gin --> Redis
    Gin --> JWT
    
    Go --> AgentGo
    AgentGo --> Motoko
    Motoko --> ICP
    
    style Go fill:#00ADD8
    style PostgreSQL fill:#336791
    style Redis fill:#DC382D
    style Motoko fill:#FF6B6B
    style ICP fill:#FF6B6B
```

## 📁 Project Structure

```
pedulicarbon/
├── 📁 docs/                    # Documentation
│   ├── 📄 api_openapi.yaml     # API specification
│   ├── 📄 DEPLOYMENT.md        # Deployment guide
│   ├── 📄 FRONTEND_INTEGRATION.md
│   ├── 📄 TROUBLESHOOTING.md   # Troubleshooting guide
│   └── 📄 SYSTEM_DESIGN.md     # System design with diagrams
├── 📁 internal/                # Go application code
│   ├── 📁 api/                 # HTTP handlers
│   ├── 📁 model/               # Data models
│   ├── 📁 repository/          # Data access layer
│   ├── 📁 service/             # Business logic
│   └── 📁 motoko/              # Motoko client
├── 📁 motoko/                  # Motoko canister
│   └── 📁 pedulicarbon/
│       └── 📁 src/
│           └── 📄 main.mo
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

### Production
```bash
# Build and deploy
docker build -t pedulicarbon .
docker-compose -f docker-compose.prod.yml up -d
```

## 🧪 Testing

### API Testing
```bash
# Run all tests
go test ./...

# Run specific test
go test ./internal/api -v

# Run with coverage
go test ./... -cover
```

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
- [🏗️ System Design](docs/SYSTEM_DESIGN.md) - Detailed architecture and design

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/pedulicarbon/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/pedulicarbon/discussions)
- **Email**: support@pedulicarbon.com

## 🔮 Roadmap

- [ ] Mobile app development
- [ ] Advanced mission types
- [ ] Carbon credit marketplace
- [ ] Social features
- [ ] AI-powered mission suggestions
- [ ] Integration with external carbon offset providers

---

**Made with ❤️ for a greener future** 🌍 