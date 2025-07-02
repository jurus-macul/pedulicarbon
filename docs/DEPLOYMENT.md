# Deployment Guide

## Overview

Dokumentasi ini menjelaskan cara deploy PeduliCarbon platform ke berbagai environment (development, staging, production) dengan konfigurasi yang tepat.

## Prerequisites

### System Requirements
- **Go**: 1.21+
- **PostgreSQL**: 13+
- **DFX SDK**: 0.14.x (untuk ICP development)
- **Docker**: 20.10+ (optional)
- **Nginx**: 1.18+ (production)

### Environment Variables
Buat file `.env` dengan konfigurasi berikut:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_NAME=pedulicarbon
DB_PORT=5432

# ICP Configuration
ICP_PRINCIPAL_ID=your_platform_principal_id
ICP_CANISTER_HOST=https://ic0.app
ICP_CANISTER_ID=your_canister_id

# Identity Configuration
IDENTITY_PATH=/path/to/identity.pem
IDENTITY_PASSPHRASE=your_passphrase

# Server Configuration
PORT=8080
NODE_ENV=production
```

## Local Development

### 1. Setup Database
```bash
# Install PostgreSQL
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
CREATE DATABASE pedulicarbon;
CREATE USER pedulicarbon_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE pedulicarbon TO pedulicarbon_user;
\q

# Test connection
psql -h localhost -U pedulicarbon_user -d pedulicarbon
```

### 2. Setup ICP Development Environment
```bash
# Install DFX SDK
sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"

# Create identity
dfx identity new pedulicarbon-dev
dfx identity use pedulicarbon-dev

# Start local replica
dfx start --background

# Deploy canister
cd motoko/pedulicarbon
dfx deploy

# Get canister ID
dfx canister id pedulicarbon
```

### 3. Run Backend
```bash
# Install dependencies
go mod tidy

# Run with hot reload (optional)
go install github.com/cosmtrek/air@latest
air

# Or run directly
go run main.go
```

### 4. Verify Setup
```bash
# Health check
curl http://localhost:8080/health

# Test user registration
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Docker Deployment

### 1. Create Dockerfile
```dockerfile
# Dockerfile
FROM golang:1.21-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o pedulicarbon .

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/

COPY --from=builder /app/pedulicarbon .
COPY --from=builder /app/.env .

EXPOSE 8080
CMD ["./pedulicarbon"]
```

### 2. Create docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - DB_HOST=postgres
      - DB_USER=pedulicarbon
      - DB_PASSWORD=password
      - DB_NAME=pedulicarbon
      - DB_PORT=5432
    depends_on:
      - postgres
    restart: unless-stopped

  postgres:
    image: postgres:13
    environment:
      - POSTGRES_DB=pedulicarbon
      - POSTGRES_USER=pedulicarbon
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped

volumes:
  postgres_data:
```

### 3. Deploy with Docker
```bash
# Build and run
docker-compose up -d

# Check logs
docker-compose logs -f app

# Stop services
docker-compose down
```

## Production Deployment

### 1. Server Setup (Ubuntu 20.04)

#### Install Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Go
wget https://go.dev/dl/go1.21.0.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.21.0.linux-amd64.tar.gz
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
source ~/.bashrc

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Install Nginx
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx

# Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx -y
```

#### Setup Database
```bash
# Create database and user
sudo -u postgres psql
CREATE DATABASE pedulicarbon;
CREATE USER pedulicarbon_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE pedulicarbon TO pedulicarbon_user;
ALTER USER pedulicarbon_user CREATEDB;
\q

# Configure PostgreSQL for production
sudo nano /etc/postgresql/13/main/postgresql.conf
# Add/modify:
# max_connections = 100
# shared_buffers = 256MB
# effective_cache_size = 1GB

sudo nano /etc/postgresql/13/main/pg_hba.conf
# Add:
# host    pedulicarbon    pedulicarbon_user    127.0.0.1/32            md5

sudo systemctl restart postgresql
```

### 2. Deploy Application

#### Create Service User
```bash
# Create user
sudo useradd -r -s /bin/false pedulicarbon

# Create directories
sudo mkdir -p /opt/pedulicarbon
sudo chown pedulicarbon:pedulicarbon /opt/pedulicarbon
```

#### Deploy Code
```bash
# Clone repository
cd /opt
sudo git clone https://github.com/your-repo/pedulicarbon.git
sudo chown -R pedulicarbon:pedulicarbon pedulicarbon

# Build application
cd pedulicarbon
sudo -u pedulicarbon go mod tidy
sudo -u pedulicarbon go build -o pedulicarbon main.go

# Create environment file
sudo -u pedulicarbon nano .env
# Add production environment variables
```

#### Create Systemd Service
```bash
# Create service file
sudo nano /etc/systemd/system/pedulicarbon.service
```

```ini
[Unit]
Description=PeduliCarbon API Server
After=network.target postgresql.service

[Service]
Type=simple
User=pedulicarbon
Group=pedulicarbon
WorkingDirectory=/opt/pedulicarbon
ExecStart=/opt/pedulicarbon/pedulicarbon
Restart=always
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable pedulicarbon
sudo systemctl start pedulicarbon

# Check status
sudo systemctl status pedulicarbon
sudo journalctl -u pedulicarbon -f
```

### 3. Configure Nginx

#### Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/pedulicarbon
```

```nginx
server {
    listen 80;
    server_name api.pedulicarbon.com;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    location / {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://127.0.0.1:8080;
        # ... other proxy settings
    }
}
```

#### Enable Site and SSL
```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/pedulicarbon /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Setup SSL
sudo certbot --nginx -d api.pedulicarbon.com

# Test SSL renewal
sudo certbot renew --dry-run
```

### 4. Deploy ICP Canister

#### Deploy to Mainnet
```bash
# Login to ICP
dfx identity use pedulicarbon-prod
dfx identity get-principal

# Deploy canister
cd motoko/pedulicarbon
dfx deploy --network ic

# Get canister ID
dfx canister id pedulicarbon --network ic

# Update environment variables
sudo -u pedulicarbon nano /opt/pedulicarbon/.env
# Update ICP_CANISTER_ID with mainnet canister ID
# Update ICP_CANISTER_HOST to https://ic0.app

# Restart service
sudo systemctl restart pedulicarbon
```

## Monitoring & Logging

### 1. Application Logs
```bash
# View application logs
sudo journalctl -u pedulicarbon -f

# View nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 2. Database Monitoring
```bash
# Check database connections
sudo -u postgres psql -c "SELECT count(*) FROM pg_stat_activity;"

# Check database size
sudo -u postgres psql -c "SELECT pg_size_pretty(pg_database_size('pedulicarbon'));"
```

### 3. System Monitoring
```bash
# Install monitoring tools
sudo apt install htop iotop nethogs -y

# Monitor system resources
htop
iotop
nethogs
```

## Backup & Recovery

### 1. Database Backup
```bash
# Create backup script
sudo nano /opt/backup-db.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="pedulicarbon"
DB_USER="pedulicarbon_user"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create backup
pg_dump -h localhost -U $DB_USER $DB_NAME > $BACKUP_DIR/pedulicarbon_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/pedulicarbon_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "pedulicarbon_*.sql.gz" -mtime +7 -delete

echo "Backup completed: pedulicarbon_$DATE.sql.gz"
```

```bash
# Make executable and setup cron
sudo chmod +x /opt/backup-db.sh
sudo crontab -e
# Add: 0 2 * * * /opt/backup-db.sh
```

### 2. Application Backup
```bash
# Backup application files
sudo tar -czf /opt/backups/pedulicarbon_app_$(date +%Y%m%d).tar.gz /opt/pedulicarbon

# Backup configuration
sudo cp /etc/systemd/system/pedulicarbon.service /opt/backups/
sudo cp /etc/nginx/sites-available/pedulicarbon /opt/backups/
```

## Security Hardening

### 1. Firewall Configuration
```bash
# Install UFW
sudo apt install ufw -y

# Configure firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 2. Database Security
```bash
# Restrict database access
sudo nano /etc/postgresql/13/main/pg_hba.conf
# Only allow local connections for application user
```

### 3. Application Security
```bash
# Set proper file permissions
sudo chown -R pedulicarbon:pedulicarbon /opt/pedulicarbon
sudo chmod 600 /opt/pedulicarbon/.env

# Disable unnecessary services
sudo systemctl disable postgresql
sudo systemctl enable postgresql
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Error
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connection
psql -h localhost -U pedulicarbon_user -d pedulicarbon

# Check logs
sudo tail -f /var/log/postgresql/postgresql-13-main.log
```

#### 2. Application Won't Start
```bash
# Check service status
sudo systemctl status pedulicarbon

# Check logs
sudo journalctl -u pedulicarbon -n 50

# Check environment variables
sudo -u pedulicarbon cat /opt/pedulicarbon/.env
```

#### 3. ICP Canister Issues
```bash
# Check canister status
dfx canister status pedulicarbon --network ic

# Check canister logs
dfx canister call pedulicarbon --network ic

# Redeploy if needed
dfx deploy --network ic
```

#### 4. Nginx Issues
```bash
# Check nginx configuration
sudo nginx -t

# Check nginx status
sudo systemctl status nginx

# Check error logs
sudo tail -f /var/log/nginx/error.log
```

## Performance Optimization

### 1. Database Optimization
```sql
-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_missions_status ON missions(status);
CREATE INDEX idx_mission_taken_user_id ON mission_taken(user_id);
CREATE INDEX idx_user_nft_user_id ON user_nft(user_id);
```

### 2. Application Optimization
```bash
# Enable Go profiling
export GODEBUG=http2debug=2

# Monitor memory usage
go tool pprof http://localhost:8080/debug/pprof/heap
```

### 3. Nginx Optimization
```nginx
# Add to nginx configuration
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

# Enable caching
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## Scaling

### 1. Horizontal Scaling
```bash
# Use load balancer (HAProxy/Nginx)
# Deploy multiple application instances
# Use database connection pooling
```

### 2. Vertical Scaling
```bash
# Increase server resources
# Optimize database queries
# Use caching (Redis)
```

## Maintenance

### 1. Regular Updates
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Go version
# Update PostgreSQL version
# Update application code
```

### 2. Health Checks
```bash
# Create health check script
curl -f http://localhost:8080/health || exit 1
```

### 3. Monitoring Alerts
```bash
# Setup monitoring with Prometheus/Grafana
# Setup alerting for critical issues
# Monitor disk space, memory, CPU usage
```

## Support

For deployment issues:
- Check logs: `sudo journalctl -u pedulicarbon -f`
- Database issues: Check PostgreSQL logs
- Network issues: Check nginx logs
- ICP issues: Check canister status and logs

Contact: support@pedulicarbon.com 