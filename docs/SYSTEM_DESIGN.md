# PeduliCarbon System Design

## Overview

PeduliCarbon is a carbon offset platform that gamifies environmental actions through missions, NFTs, and rewards. The system integrates a Go backend with a Motoko canister on the Internet Computer (ICP) blockchain.

## Architecture Diagram

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[Web/Mobile UI]
        Wallet[ICP Wallet Integration]
    end
    
    subgraph "Backend Layer"
        API[Go REST API]
        Auth[Authentication Service]
        MissionSvc[Mission Service]
        RewardSvc[Reward Service]
        WalletSvc[Wallet Service]
    end
    
    subgraph "Data Layer"
        DB[(PostgreSQL Database)]
        Cache[(Redis Cache)]
    end
    
    subgraph "Blockchain Layer"
        Motoko[Motoko Canister]
        ICP[Internet Computer]
    end
    
    subgraph "External Services"
        Email[Email Service]
        Storage[File Storage]
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
    
    API --> Email
    API --> Storage
    
    style UI fill:#e1f5fe
    style API fill:#f3e5f5
    style DB fill:#e8f5e8
    style Motoko fill:#fff3e0
    style ICP fill:#ffebee
```

## User Flow Diagrams

### 1. User Registration Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant API as Go API
    participant DB as Database
    participant Email as Email Service
    
    U->>F: Enter email & password
    F->>API: POST /api/users/register
    API->>DB: Check if email exists
    DB-->>API: User not found
    API->>DB: Create new user
    API->>Email: Send verification email
    DB-->>API: User created
    Email-->>U: Verification email
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
    participant ICP as Internet Computer
    
    U->>F: Submit mission proof
    F->>API: POST /api/missions/{id}/submit-proof
    API->>DB: Validate mission & user
    API->>DB: Create mission_taken record
    API->>Motoko: VerifyMission(proof)
    alt Canister Available
        Motoko->>ICP: Verify on-chain
        ICP-->>Motoko: Verification result
        Motoko-->>API: Success
    else Canister Unavailable
        API-->>API: Fallback verification
    end
    API->>DB: Update mission status
    API->>Motoko: MintNFT(userId, missionId)
    alt Canister Available
        Motoko->>ICP: Mint NFT
        ICP-->>Motoko: NFT minted
        Motoko-->>API: NFT ID
    else Canister Unavailable
        API-->>API: Fallback NFT creation
    end
    API->>DB: Store NFT details
    API-->>F: Mission completed
    F-->>U: Success notification
```

### 3. NFT Claiming Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant API as Go API
    participant DB as Database
    participant Motoko as Motoko Canister
    participant ICP as Internet Computer
    
    U->>F: Request NFT claim
    F->>API: POST /api/nfts/{id}/claim
    API->>DB: Validate NFT ownership
    API->>Motoko: ClaimNFT(nftId, userPrincipal)
    alt Canister Available
        Motoko->>ICP: Transfer NFT to user
        ICP-->>Motoko: Transfer successful
        Motoko-->>API: Success
    else Canister Unavailable
        API-->>API: Fallback claim process
    end
    API->>DB: Update NFT status
    API-->>F: NFT claimed
    F-->>U: NFT received notification
```

### 4. Reward Redemption Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant API as Go API
    participant DB as Database
    participant Email as Email Service
    
    U->>F: Select reward to redeem
    F->>API: POST /api/rewards/redeem
    API->>DB: Check user points
    API->>DB: Validate reward availability
    API->>DB: Deduct points
    API->>DB: Create reward record
    API->>Email: Send reward details
    Email-->>U: Reward confirmation email
    API-->>F: Reward redeemed
    F-->>U: Success notification
```

## Database Schema

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
    
    wallets {
        uuid id PK
        uuid user_id FK
        string address
        decimal balance
        timestamp created_at
        timestamp updated_at
    }
    
    withdraws {
        uuid id PK
        uuid user_id FK
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
        Middleware[Middleware]
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
        EmailClient[Email Client]
        StorageClient[Storage Client]
    end
    
    Router --> Middleware
    Middleware --> UserHandler
    Middleware --> MissionHandler
    Middleware --> RewardHandler
    Middleware --> WalletHandler
    
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
    UserService --> EmailClient
    MissionService --> StorageClient
    
    style Router fill:#e3f2fd
    style UserService fill:#f3e5f5
    style MissionService fill:#e8f5e8
    style MotokoService fill:#fff3e0
```

## Security Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[Browser/App]
    end
    
    subgraph "Network Layer"
        HTTPS[HTTPS/TLS]
        CORS[CORS Policy]
    end
    
    subgraph "API Gateway"
        RateLimit[Rate Limiting]
        Auth[Authentication]
        Validation[Input Validation]
    end
    
    subgraph "Application Layer"
        Authorization[Authorization]
        Sanitization[Data Sanitization]
        Encryption[Data Encryption]
    end
    
    subgraph "Data Layer"
        DBEncryption[Database Encryption]
        Backup[Secure Backups]
    end
    
    Browser --> HTTPS
    HTTPS --> CORS
    CORS --> RateLimit
    RateLimit --> Auth
    Auth --> Validation
    Validation --> Authorization
    Authorization --> Sanitization
    Sanitization --> Encryption
    Encryption --> DBEncryption
    DBEncryption --> Backup
    
    style HTTPS fill:#e8f5e8
    style Auth fill:#fff3e0
    style Authorization fill:#ffebee
    style DBEncryption fill:#f3e5f5
```

## Performance Architecture

```mermaid
graph TB
    subgraph "Load Balancer"
        LB[Load Balancer]
    end
    
    subgraph "Application Servers"
        API1[API Server 1]
        API2[API Server 2]
        API3[API Server 3]
    end
    
    subgraph "Caching Layer"
        Redis1[Redis Primary]
        Redis2[Redis Replica]
    end
    
    subgraph "Database Layer"
        DB1[PostgreSQL Primary]
        DB2[PostgreSQL Replica]
    end
    
    subgraph "Blockchain Layer"
        Motoko[Motoko Canister]
        ICP[Internet Computer]
    end
    
    LB --> API1
    LB --> API2
    LB --> API3
    
    API1 --> Redis1
    API2 --> Redis1
    API3 --> Redis1
    Redis1 --> Redis2
    
    API1 --> DB1
    API2 --> DB1
    API3 --> DB1
    DB1 --> DB2
    
    API1 --> Motoko
    API2 --> Motoko
    API3 --> Motoko
    Motoko --> ICP
    
    style LB fill:#e3f2fd
    style Redis1 fill:#fff3e0
    style DB1 fill:#e8f5e8
    style Motoko fill:#f3e5f5
```

## Deployment Architecture

```mermaid
graph TB
    subgraph "Development"
        DevEnv[Development Environment]
        DevDB[Local PostgreSQL]
        DevICP[Local Replica]
    end
    
    subgraph "Staging"
        StagingEnv[Staging Environment]
        StagingDB[Staging PostgreSQL]
        StagingICP[Testnet ICP]
    end
    
    subgraph "Production"
        ProdEnv[Production Environment]
        ProdDB[Production PostgreSQL]
        ProdICP[Mainnet ICP]
    end
    
    subgraph "CI/CD Pipeline"
        Build[Build & Test]
        Deploy[Deploy]
        Monitor[Monitor]
    end
    
    DevEnv --> DevDB
    DevEnv --> DevICP
    
    StagingEnv --> StagingDB
    StagingEnv --> StagingICP
    
    ProdEnv --> ProdDB
    ProdEnv --> ProdICP
    
    Build --> Deploy
    Deploy --> Monitor
    Monitor --> Build
    
    style DevEnv fill:#e8f5e8
    style StagingEnv fill:#fff3e0
    style ProdEnv fill:#ffebee
    style Build fill:#f3e5f5
```

## Technology Stack

### Backend
- **Language**: Go 1.21+
- **Framework**: Gin (HTTP router)
- **Database**: PostgreSQL 15+
- **Cache**: Redis 7+
- **Authentication**: JWT tokens
- **Blockchain**: Internet Computer (Motoko)

### Frontend (Integration)
- **Framework**: React/Vue.js/Angular
- **State Management**: Redux/Vuex/NgRx
- **HTTP Client**: Axios/Fetch
- **Wallet Integration**: Internet Identity

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Kubernetes/Docker Compose
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack

## Scalability Considerations

1. **Horizontal Scaling**: Multiple API instances behind load balancer
2. **Database Scaling**: Read replicas for read-heavy operations
3. **Caching Strategy**: Redis for session data and frequently accessed data
4. **CDN**: Static asset delivery
5. **Microservices**: Potential future migration for specific domains
6. **Event-Driven**: Async processing for non-critical operations

## Monitoring & Observability

```mermaid
graph LR
    subgraph "Application"
        API[API Server]
        DB[Database]
        Cache[Redis]
    end
    
    subgraph "Monitoring"
        Metrics[Metrics Collection]
        Logs[Log Aggregation]
        Traces[Distributed Tracing]
        Alerts[Alerting]
    end
    
    subgraph "Visualization"
        Dashboard[Dashboards]
        Reports[Reports]
    end
    
    API --> Metrics
    DB --> Metrics
    Cache --> Metrics
    
    API --> Logs
    DB --> Logs
    Cache --> Logs
    
    API --> Traces
    
    Metrics --> Alerts
    Logs --> Alerts
    
    Metrics --> Dashboard
    Logs --> Dashboard
    Traces --> Dashboard
    
    Dashboard --> Reports
    
    style Metrics fill:#e8f5e8
    style Logs fill:#fff3e0
    style Dashboard fill:#f3e5f5
    style Alerts fill:#ffebee
```

This comprehensive system design provides visual representations of all major components and their interactions, making it easier for developers and stakeholders to understand the architecture and implementation details. 