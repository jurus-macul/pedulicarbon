# PeduliCarbon System Design

## Overview

PeduliCarbon adalah platform carbon offset yang menggamifikasi aksi lingkungan melalui misi, NFT, dan rewards. Sistem mengintegrasikan backend Go dengan canister Motoko di Internet Computer (ICP) blockchain.

## Arsitektur Sistem

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

## User Flow

### 1. User Registration Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant API as Go API
    participant DB as Database
    
    U->>F: Enter email & password
    F->>API: POST /auth/register
    API->>DB: Check if email exists
    DB-->>API: User not found
    API->>DB: Create new user
    DB-->>API: User created
    API-->>F: Success response
    F-->>U: Registration complete
```

### 2. Mission Completion Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant API as Go API
    participant DB as Database
    participant Motoko as Motoko Canister
    
    U->>F: Submit mission proof
    F->>API: POST /missions/{id}/submit-proof
    API->>DB: Validate mission & user
    API->>DB: Create mission_taken record
    API->>Motoko: VerifyAction(proof)
    Motoko-->>API: Verified
    API->>Motoko: MintNFT(userId, missionId)
    Motoko-->>API: NFT minted
    API->>DB: Store NFT details
    API-->>F: Mission completed
    F-->>U: Success notification
```

## Database Schema

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

## Component Architecture

```mermaid
graph LR
    subgraph "API Layer"
        Router[Router]
    end
    
    subgraph "Handler Layer"
        UserHandler[User Handler]
        MissionHandler[Mission Handler]
        RewardHandler[Reward Handler]
        WalletHandler[Wallet Handler]
    end
    
    subgraph "Service Layer"
        UserService[User Service]
        MissionService[Mission Service]
        RewardService[Reward Service]
        WalletService[Wallet Service]
        MotokoService[Motoko Service]
    end
    
    subgraph "Repository Layer"
        UserRepo[User Repository]
        MissionRepo[Mission Repository]
        RewardRepo[Reward Repository]
        WalletRepo[Wallet Repository]
    end
    
    subgraph "External Layer"
        MotokoClient[Motoko Client]
    end
    
    Router --> UserHandler
    Router --> MissionHandler
    Router --> RewardHandler
    Router --> WalletHandler
    
    UserHandler --> UserService
    MissionHandler --> MissionService
    RewardHandler --> RewardService
    WalletHandler --> WalletService
    
    UserService --> UserRepo
    MissionService --> MissionRepo
    RewardService --> RewardRepo
    WalletService --> WalletRepo
    
    MissionService --> MotokoService
    MotokoService --> MotokoClient
    
    style Router fill:#e3f2fd
    style UserService fill:#f3e5f5
    style MissionService fill:#e8f5e8
    style MotokoService fill:#fff3e0
```

## Technology Stack

### Backend
- **Language**: Go 1.21+
- **Framework**: Gin (HTTP router)
- **Database**: PostgreSQL 15+
- **ORM**: GORM
- **Authentication**: Email-based
- **Blockchain**: Internet Computer (Motoko)

### Frontend (Integration)
- **Framework**: React/Vue.js/Angular
- **HTTP Client**: Fetch/Axios
- **State Management**: Local state atau Redux/Vuex

### Infrastructure
- **Containerization**: Docker
- **Database**: PostgreSQL
- **Blockchain**: Internet Computer

## API Endpoints

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

## Security Considerations

1. **Authentication**: Email-based authentication dengan password hashing
2. **Authorization**: User-based access control
3. **Input Validation**: Validasi input di semua endpoint
4. **Database Security**: Prepared statements via GORM
5. **Blockchain Security**: Ed25519 identity untuk agent-go

## Performance Considerations

1. **Database Indexing**: Index pada email dan foreign keys
2. **Connection Pooling**: GORM connection pooling
3. **Caching**: Future implementation untuk frequently accessed data
4. **Load Balancing**: Multiple API instances untuk production

## Deployment Architecture

```mermaid
graph TB
    subgraph "Development"
        DevEnv[Development Environment]
        DevDB[Local PostgreSQL]
        DevICP[Local Replica]
    end
    
    subgraph "Production"
        ProdEnv[Production Environment]
        ProdDB[Production PostgreSQL]
        ProdICP[Mainnet ICP]
    end
    
    DevEnv --> DevDB
    DevEnv --> DevICP
    
    ProdEnv --> ProdDB
    ProdEnv --> ProdICP
    
    style DevEnv fill:#e8f5e8
    style ProdEnv fill:#ffebee
```

## Monitoring & Observability

1. **Logging**: Structured logging dengan Gin
2. **Error Tracking**: Error handling di semua layers
3. **Health Checks**: `/health` endpoint
4. **Metrics**: Future implementation dengan Prometheus

## Scalability Considerations

1. **Horizontal Scaling**: Multiple API instances
2. **Database Scaling**: Read replicas untuk read-heavy operations
3. **Caching Strategy**: Redis untuk session data
4. **Microservices**: Potential future migration

## Development Workflow

1. **Local Development**: Docker Compose untuk dependencies
2. **Testing**: Unit tests dan integration tests
3. **CI/CD**: GitHub Actions untuk automated testing
4. **Deployment**: Docker containers untuk production

## Future Enhancements

1. **Real-time Updates**: WebSocket integration
2. **Mobile App**: React Native atau Flutter
3. **Advanced Analytics**: User behavior tracking
4. **Social Features**: User interactions dan sharing
5. **AI Integration**: Smart mission recommendations 