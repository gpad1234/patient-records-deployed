# Quick Start Guide - Phase 1

Get up and running with the Patient Records mixed-architecture system in minutes.

## Option 1: Docker Compose (Recommended for Quick Start)

### Prerequisites
- Docker Desktop installed and running

### Start All Services
```bash
cd patient-records
docker-compose up -d
```

### Verify Services Are Running
```bash
# Check container status
docker-compose ps

# Check service health
curl http://localhost:3000/health
curl http://localhost:3000/services/health
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f java-service
docker-compose logs -f python-service
docker-compose logs -f node-service
docker-compose logs -f postgres
```

### Stop Services
```bash
docker-compose down
```

## Option 2: Local Development Setup

### Prerequisites
- Java 25+
- Python 3.11+
- Node.js 20+
- PostgreSQL 16+

### 1. Start PostgreSQL
```bash
# macOS with Homebrew
brew services start postgresql

# Or Docker
docker run -d \
  --name patient-records-db \
  -e POSTGRES_USER=patient_user \
  -e POSTGRES_PASSWORD=patient_password \
  -e POSTGRES_DB=patient_records \
  -p 5432:5432 \
  postgres:16-alpine
```

### 2. Start Java Service
```bash
cd services/java-service
mvn clean install
mvn spring-boot:run
```

Service runs on: `http://localhost:8080`

### 3. Start Python Service
```bash
cd services/python-service
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python src/app.py
```

Service runs on: `http://localhost:5000`

### 4. Start Node Service
```bash
cd services/node-service
npm install
npm run dev
```

Service runs on: `http://localhost:3000`

## Testing the System

### Check All Services Are Healthy
```bash
curl http://localhost:3000/services/health
```

Expected response:
```json
{
  "javaService": {
    "status": "healthy",
    "service": "java-service",
    "version": "1.0.0"
  },
  "pythonService": {
    "status": "healthy",
    "service": "python-service",
    "version": "1.0.0"
  }
}
```

### Gateway Info
```bash
curl http://localhost:3000/info
```

### Individual Service Health
```bash
curl http://localhost:8080/health  # Java
curl http://localhost:5000/health  # Python
```

## Common Operations

### View Docker Compose Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs python-service

# Follow logs (tail -f)
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100
```

### Connect to Database
```bash
# Via Docker
docker-compose exec postgres psql -U patient_user -d patient_records

# Via local psql
psql -h localhost -U patient_user -d patient_records
```

### Rebuild Images
```bash
# Rebuild all
docker-compose build

# Rebuild specific service
docker-compose build java-service

# Rebuild without cache
docker-compose build --no-cache
```

### Environment Variables
Create `.env` files for local services:

**services/java-service/.env**:
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=patient_user
DB_PASSWORD=patient_password
DB_NAME=patient_records
```

**services/python-service/.env**:
```
cp .env.example .env
# Edit as needed
```

**services/node-service/.env**:
```
cp .env.example .env
# Edit to point to your local services
```

## Troubleshooting

### Port Already in Use
```bash
# Find what's using the port
lsof -i :3000
lsof -i :5000
lsof -i :8080
lsof -i :5432

# Kill process
kill -9 <PID>
```

### Docker Compose Won't Start
```bash
# Remove containers and volumes
docker-compose down -v

# Rebuild images
docker-compose build --no-cache

# Start again
docker-compose up -d
```

### Service Health Check Failing
```bash
# Check container logs
docker-compose logs <service-name>

# Test service directly
docker-compose exec <service-name> curl http://localhost:<port>/health
```

### Database Connection Failed
```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Test database connection
docker-compose exec postgres psql -U patient_user -d patient_records

# Check environment variables in service
docker-compose exec java-service env | grep DB_
```

## Next Steps

1. **Read Architecture Documentation**: `PHASE_1_ARCHITECTURE.md`
2. **Service-Specific Docs**: 
   - `services/java-service/README.md`
   - `services/python-service/README.md`
   - `services/node-service/README.md`
3. **API Testing**: Use Postman or cURL to test endpoints
4. **Database**: Connect and explore schema
5. **Logging**: Monitor service logs for issues

## Project Structure Overview

```
patient-records/
├── PHASE_1_ARCHITECTURE.md      ← Architecture overview
├── QUICKSTART.md                 ← This file
├── docker-compose.yml            ← Multi-service orchestration
├── services/
│   ├── java-service/            ← Patient data & insurance
│   ├── python-service/          ← Clinical protocols & labs
│   └── node-service/            ← API gateway
└── docs/                        ← Additional documentation
```

## Useful Commands

```bash
# Docker Compose
docker-compose up -d              # Start all services
docker-compose down               # Stop all services
docker-compose ps                 # List services
docker-compose logs -f            # Stream logs
docker-compose exec <svc> bash    # Access service

# Java Service
mvn clean install                 # Build
mvn test                         # Test
mvn spring-boot:run              # Run locally

# Python Service
pip install -r requirements.txt   # Install deps
python src/app.py                # Run locally
pytest                           # Test

# Node Service
npm install                      # Install deps
npm run dev                      # Run with hot reload
npm test                        # Test

# PostgreSQL
psql -h localhost -U patient_user -d patient_records
```

## Support

For detailed information:
- **Architecture**: See `PHASE_1_ARCHITECTURE.md`
- **API Specification**: See `docs/API_SPECIFICATION.md` (Phase 2)
- **Deployment**: See `docs/DEPLOYMENT_GUIDE.md` (Phase 2)

---

**Phase 1 Status**: ✅ Setup Complete
**Ready for**: Development, Integration Testing
**Next Phase**: Phase 2 - Database & Authentication
