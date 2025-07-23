# Troubleshooting Guide

## Overview

Dokumentasi ini berisi solusi untuk masalah-masalah umum yang mungkin terjadi saat menggunakan atau mengembangkan PeduliCarbon platform.

## Quick Diagnostic Commands

### System Health Check
```bash
# Check if backend is running
curl http://localhost:8080/health

# Check database connection
psql -h localhost -U pedulicarbon_user -d pedulicarbon -c "SELECT 1;"

# Check ICP canister status
dfx canister status pedulicarbon

# Check system resources
htop
df -h
free -h
```

## Common Issues & Solutions

### 1. Database Issues

#### Problem: Database Connection Failed
**Error Message:**
```
Failed to connect database: dial tcp [::1]:5432: connect: connection refused
```

**Solutions:**
```bash
# 1. Check if PostgreSQL is running
sudo systemctl status postgresql

# 2. Start PostgreSQL if stopped
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 3. Check PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-13-main.log

# 4. Verify connection settings
psql -h localhost -U postgres -c "\l"
```

#### Problem: Permission Denied
**Error Message:**
```
FATAL: password authentication failed for user "pedulicarbon_user"
```

**Solutions:**
```bash
# 1. Reset user password
sudo -u postgres psql
ALTER USER pedulicarbon_user WITH PASSWORD 'new_password';
\q

# 2. Update .env file with correct password
nano .env
# Update DB_PASSWORD

# 3. Test connection
psql -h localhost -U pedulicarbon_user -d pedulicarbon
```

#### Problem: Database Migration Failed
**Error Message:**
```
Failed to migrate database: pq: relation "users" already exists
```

**Solutions:**
```bash
# 1. Drop and recreate database
sudo -u postgres psql
DROP DATABASE pedulicarbon;
CREATE DATABASE pedulicarbon;
GRANT ALL PRIVILEGES ON DATABASE pedulicarbon TO pedulicarbon_user;
\q

# 2. Restart application
go run main.go
```

### 2. ICP/Blockchain Issues

#### Problem: Canister Not Found
**Error Message:**
```
canister_not_found: The specified canister does not exist.
```

**Solutions:**
```bash
# 1. Check canister status
dfx canister status pedulicarbon

# 2. Redeploy canister
cd motoko/pedulicarbon
dfx deploy

# 3. Get new canister ID
dfx canister id pedulicarbon

# 4. Update .env file
nano .env
# Update ICP_CANISTER_ID

# 5. Restart backend
pkill -f "go run main.go"
go run main.go
```

#### Problem: Identity PEM Error
**Error Message:**
```
invalid pem file: failed to decode PEM block
```

**Solutions:**
```bash
# 1. Export identity properly
dfx identity export pedulicarbon > identity.pem

# 2. Check identity format
openssl rsa -in identity.pem -check

# 3. Update .env file
nano .env
# Update IDENTITY_PATH to correct path

# 4. For secp256k1 keys, use fallback mechanism
# The system will automatically use fallback for local testing

# 5. Verify platform principal in .env
# Ensure ICP_PRINCIPAL_ID is set correctly
```

#### Problem: Agent-Go Version Compatibility
**Error Message:**
```
agent-go version incompatible with dfx version
```

**Solutions:**
```bash
# 1. Check versions
dfx --version
go list -m github.com/aviate-labs/agent-go

# 2. Use compatible versions
# - dfx 0.14.x with agent-go v0.7.3
# - Or upgrade to dfx 0.15.x with agent-js

# 3. For local development, fallback mechanism handles this
```

### 3. Application Issues

#### Problem: Port Already in Use
**Error Message:**
```
Failed to start server: listen tcp :8080: bind: address already in use
```

**Solutions:**
```bash
# 1. Find process using port 8080
lsof -i :8080

# 2. Kill the process
kill -9 <PID>

# 3. Or use different port
export PORT=8081
go run main.go
```

#### Problem: Environment Variables Not Loaded
**Error Message:**
```
ICP_PRINCIPAL_ID environment variable is required
```

**Solutions:**
```bash
# 1. Check if .env file exists
ls -la .env

# 2. Create .env file if missing
cp .env.example .env

# 3. Verify environment variables
cat .env

# 4. Restart application after changes
pkill -f "go run main.go"
go run main.go
```

#### Problem: Memory Issues
**Error Message:**
```
fatal error: runtime: out of memory
```

**Solutions:**
```bash
# 1. Check memory usage
free -h

# 2. Increase swap space
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# 3. Optimize Go garbage collection
export GOGC=50
go run main.go
```

### 4. API Issues

#### Problem: 404 Not Found
**Error Message:**
```
404 page not found
```

**Solutions:**
```bash
# 1. Check if server is running
curl http://localhost:8080/health

# 2. Verify endpoint path
# Check router.go for correct paths

# 3. Check request method (GET/POST)
# Use correct HTTP method for endpoint
```

#### Problem: 400 Bad Request
**Error Message:**
```
400 Bad Request: error: invalid request data
```

**Solutions:**
```bash
# 1. Check request format
# Ensure JSON is valid
# Check required fields

# 2. Example correct request:
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### Problem: 500 Internal Server Error
**Error Message:**
```
500 Internal Server Error
```

**Solutions:**
```bash
# 1. Check application logs
# Look for error messages in console

# 2. Enable debug mode
export DEBUG_MODE=true
go run main.go

# 3. Check database connection
psql -h localhost -U pedulicarbon_user -d pedulicarbon -c "SELECT 1;"
```

### 5. Network Issues

#### Problem: CORS Errors (Frontend)
**Error Message:**
```
Access to fetch at 'http://localhost:8080/auth/register' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solutions:**
```bash
# 1. Add CORS middleware to Go backend
# Update router.go to include CORS headers

# 2. Or use proxy in development
# Frontend: proxy requests to backend

# 3. For production, configure nginx properly
```

#### Problem: SSL Certificate Issues
**Error Message:**
```
x509: certificate signed by unknown authority
```

**Solutions:**
```bash
# 1. For development, disable SSL verification
export SKIP_SSL_VERIFY=true

# 2. For production, ensure proper SSL setup
sudo certbot --nginx -d api.pedulicarbon.com

# 3. Check certificate validity
openssl s_client -connect api.pedulicarbon.com:443
```

## Debugging Techniques

### 1. Enable Debug Logging
```bash
# Set debug environment variable
export DEBUG_MODE=true

# Run with verbose logging
go run main.go -v

# Check debug output for detailed information
```

### 2. Database Debugging
```sql
-- Check table structure
\d+ users
\d+ missions
\d+ mission_taken
\d+ user_nft

-- Check data
SELECT * FROM users LIMIT 5;
SELECT * FROM missions LIMIT 5;
SELECT * FROM mission_taken LIMIT 5;

-- Check foreign key relationships
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
WHERE constraint_type = 'FOREIGN KEY';
```

### 3. ICP Debugging
```bash
# Check canister interface
dfx canister call pedulicarbon --help

# Test canister methods directly
dfx canister call pedulicarbon verify_action '(principal "user-principal", 1, "proof-url", "gps")'

# Check canister logs
dfx canister call pedulicarbon --network ic

# Monitor canister calls
dfx canister call pedulicarbon --network ic --output raw
```

### 4. Performance Debugging
```bash
# Monitor CPU and memory usage
top -p $(pgrep pedulicarbon)

# Check database performance
sudo -u postgres psql -d pedulicarbon -c "
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats 
WHERE tablename IN ('users', 'missions', 'mission_taken', 'user_nft')
ORDER BY tablename, attname;
"

# Check slow queries
sudo -u postgres psql -d pedulicarbon -c "
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    rows
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
"
```

## Log Analysis

### 1. Application Logs
```bash
# View real-time logs
tail -f /var/log/pedulicarbon/app.log

# Search for errors
grep -i error /var/log/pedulicarbon/app.log

# Search for specific user actions
grep "user_id: 1" /var/log/pedulicarbon/app.log

# Check API requests
grep "POST /missions" /var/log/pedulicarbon/app.log
```

### 2. Database Logs
```bash
# Enable query logging
sudo nano /etc/postgresql/13/main/postgresql.conf
# Add: log_statement = 'all'

# Restart PostgreSQL
sudo systemctl restart postgresql

# View logs
sudo tail -f /var/log/postgresql/postgresql-13-main.log
```

### 3. System Logs
```bash
# Check system logs
sudo journalctl -u pedulicarbon -f

# Check nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Check system resource usage
dmesg | tail -20
```

## Recovery Procedures

### 1. Database Recovery
```bash
# Restore from backup
pg_restore -h localhost -U pedulicarbon_user -d pedulicarbon backup_file.sql

# Reset database completely
sudo -u postgres psql
DROP DATABASE pedulicarbon;
CREATE DATABASE pedulicarbon;
GRANT ALL PRIVILEGES ON DATABASE pedulicarbon TO pedulicarbon_user;
\q

# Restart application for auto-migration
go run main.go
```

### 2. Application Recovery
```bash
# Restart application
pkill -f "go run main.go"
go run main.go

# Or restart systemd service
sudo systemctl restart pedulicarbon

# Check service status
sudo systemctl status pedulicarbon
```

### 3. ICP Canister Recovery
```bash
# Redeploy canister
cd motoko/pedulicarbon
dfx deploy --network ic

# Update environment variables
nano .env
# Update ICP_CANISTER_ID

# Restart application
sudo systemctl restart pedulicarbon
```

## Performance Optimization

### 1. Database Optimization
```sql
-- Create indexes for better performance
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY idx_missions_status ON missions(status);
CREATE INDEX CONCURRENTLY idx_mission_taken_user_id ON mission_taken(user_id);
CREATE INDEX CONCURRENTLY idx_user_nft_user_id ON user_nft(user_id);

-- Analyze table statistics
ANALYZE users;
ANALYZE missions;
ANALYZE mission_taken;
ANALYZE user_nft;

-- Check index usage
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes 
ORDER BY idx_scan DESC;
```

### 2. Application Optimization
```bash
# Enable Go profiling
export GODEBUG=http2debug=2

# Monitor memory usage
go tool pprof http://localhost:8080/debug/pprof/heap

# Check goroutine count
curl http://localhost:8080/debug/pprof/goroutine?debug=1
```

### 3. System Optimization
```bash
# Optimize PostgreSQL settings
sudo nano /etc/postgresql/13/main/postgresql.conf
# Add/modify:
# shared_buffers = 256MB
# effective_cache_size = 1GB
# work_mem = 4MB
# maintenance_work_mem = 64MB

# Restart PostgreSQL
sudo systemctl restart postgresql
```

## Monitoring Setup

### 1. Health Check Script
```bash
#!/bin/bash
# health-check.sh

# Check if application is responding
if ! curl -f http://localhost:8080/health > /dev/null 2>&1; then
    echo "Application is down!"
    sudo systemctl restart pedulicarbon
    exit 1
fi

# Check database connection
if ! psql -h localhost -U pedulicarbon_user -d pedulicarbon -c "SELECT 1;" > /dev/null 2>&1; then
    echo "Database connection failed!"
    exit 1
fi

# Check disk space
if [ $(df / | awk 'NR==2 {print $5}' | sed 's/%//') -gt 90 ]; then
    echo "Disk space is running low!"
    exit 1
fi

echo "All systems operational"
exit 0
```

### 2. Automated Monitoring
```bash
# Setup cron job for health checks
sudo crontab -e
# Add: */5 * * * * /opt/health-check.sh

# Setup log rotation
sudo nano /etc/logrotate.d/pedulicarbon
```

```
/var/log/pedulicarbon/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 pedulicarbon pedulicarbon
    postrotate
        systemctl reload pedulicarbon
    endscript
}
```

## Support Resources

### 1. Documentation
- [API Documentation](docs/api_openapi.yaml)
- [Frontend Integration Guide](docs/FRONTEND_INTEGRATION.md)
- [Deployment Guide](docs/DEPLOYMENT.md)

### 2. Logs and Debugging
- Application logs: `/var/log/pedulicarbon/`
- Database logs: `/var/log/postgresql/`
- System logs: `journalctl -u pedulicarbon`

### 3. Community Support
- GitHub Issues: [Repository Issues](https://github.com/your-repo/pedulicarbon/issues)
- Email: support@pedulicarbon.com
- Documentation: [docs/](docs/)

### 4. External Resources
- [Go Documentation](https://golang.org/doc/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Internet Computer Documentation](https://internetcomputer.org/docs/)
- [Gin Framework Documentation](https://gin-gonic.com/docs/)

## Emergency Contacts

For critical issues:
- **System Administrator**: admin@pedulicarbon.com
- **Database Administrator**: dba@pedulicarbon.com
- **Blockchain Specialist**: blockchain@pedulicarbon.com
- **Emergency Hotline**: +62-xxx-xxx-xxxx

## Issue Reporting Template

When reporting issues, please include:

1. **Environment**: Development/Staging/Production
2. **Error Message**: Exact error message
3. **Steps to Reproduce**: Detailed steps
4. **Expected Behavior**: What should happen
5. **Actual Behavior**: What actually happened
6. **Logs**: Relevant log entries
7. **System Information**: OS, Go version, PostgreSQL version
8. **Screenshots**: If applicable

Example:
```
Environment: Development
Error: canister_not_found
Steps: 
1. Register user
2. Take mission
3. Submit proof
4. Verify mission
Expected: Mission verified successfully
Actual: canister_not_found error
Logs: [DEBUG] BurnNFT called with NFT ID: NFT-123
System: Ubuntu 20.04, Go 1.21, PostgreSQL 13
``` 