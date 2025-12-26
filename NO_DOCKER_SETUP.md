# No Docker Setup - Quick Reference

Complete quick reference for running Patient Records locally without Docker or Homebrew.

## 📋 Quick Start (5 Steps)

### Step 1: Install Prerequisites
Visit `LOCAL_SETUP.md` and install:
- Java 25
- Maven 3.9+
- Python 3.11+
- Node.js 20+

> SQLite is built-in to macOS and doesn't require installation

### Step 2: Initialize Database
```bash
cd /Users/gp/java-code/patient-records
./scripts/init-database.sh
```

### Step 3: Setup All Services
```bash
./scripts/setup-all.sh
```

### Step 4: Start Services (in separate terminals)

**Terminal 1 - Java Service:**
```bash
./scripts/start-java-service.sh
```

**Terminal 2 - Python Service:**
```bash
./scripts/start-python-service.sh
```

**Terminal 3 - Node Service:**
```bash
./scripts/start-node-service.sh
```

### Step 5: Test Services
```bash
./scripts/test-services.sh
```

## 🎯 Service Endpoints

| Service | Port | Endpoint | Status |
|---------|------|----------|--------|
| Node Gateway | 3000 | http://localhost:3000/health | ✅ |
| Java Service | 8080 | http://localhost:8080/health | ✅ |
| Python Service | 5000 | http://localhost:5000/health | ✅ |
| SQLite Database | - | data/patient_records.db | ✅ |

## 📜 Available Scripts

### Database Management
```bash
./scripts/init-database.sh       # Initialize SQLite database
```

### Service Management
```bash
./scripts/start-java-service.sh   # Start Java service (builds + runs)
./scripts/start-python-service.sh # Start Python service (venv + runs)
./scripts/start-node-service.sh   # Start Node service (npm install + runs)
```

### Utilities
```bash
./scripts/test-services.sh        # Test all service health endpoints
./scripts/kill-port.sh <port>     # Kill process on specific port
./scripts/setup-all.sh            # Setup all services (initial setup)
```

## ⚙️ Configuration Files

Each service has environment configuration:

**Java Service:**
- Location: `services/java-service/.env`
- Database connection via environment variables

**Python Service:**
- Location: `services/python-service/.env`
- Template: `services/python-service/.env.example`
- Key: `DATABASE_URL`

**Node Service:**
- Location: `services/node-service/.env`
- Template: `services/node-service/.env.example`
- Keys: `JAVA_SERVICE_URL`, `PYTHON_SERVICE_URL`

## 🧪 Testing

### Test All Services
```bash
./scripts/test-services.sh
```

### Test Individual Service
```bash
curl http://localhost:3000/health  # Node
curl http://localhost:8080/health  # Java
curl http://localhost:5000/health  # Python
```

### Test Database Connection
```bash
sqlite3 data/patient_records.db ".tables"
```

### Aggregated Service Health
```bash
curl http://localhost:3000/services/health
```

## 🔧 Common Tasks

### Restart a Service
```bash
# Kill the service
./scripts/kill-port.sh <port>

# Restart it
./scripts/start-<service>-service.sh
```

### View Service Logs
Each service runs in the terminal, so logs appear directly. To save logs:

```bash
# Redirect to file
./scripts/start-<service>-service.sh > service.log 2>&1
```

### Change Service Port
Edit `.env` file in service directory:

**Python Service (.env):**
```
PORT=5001  # Change from 5000
```

**Node Service (.env):**
```
PORT=3001  # Change from 3000
```

Restart the service for changes to take effect.

### Database Management

**Connect to Database:**
```bash
sqlite3 data/patient_records.db
```

**Backup Database:**
```bash
cp data/patient_records.db backup-$(date +%Y%m%d-%H%M%S).db
```

**Restore Database:**
```bash
cp backup-<date>.db data/patient_records.db
```

**Reset Database:**
```bash
rm data/patient_records.db
./scripts/init-database.sh
```

## 🐛 Troubleshooting

### Service Won't Start

**Java Service:**
```bash
# Verify Java
java -version

# Verify Maven
mvn -version

# Check port 8080
lsof -i :8080

# Kill stuck process
./scripts/kill-port.sh 8080
```

**Python Service:**
```bash
# Verify Python
python3 --version

# Check virtual environment
cd services/python-service
source venv/bin/activate
python -c "import flask; print('Flask OK')"

# Check port 5000
./scripts/kill-port.sh 5000
```

**Node Service:**
```bash
# Verify Node
node --version

# Clear npm cache
cd services/node-service
npm cache clean --force
rm -rf node_modules
npm install

# Check port 3000
./scripts/kill-port.sh 3000
```

### Database Connection Failed

```bash
# Check if database file exists
ls -la data/patient_records.db

# If missing, initialize it
./scripts/init-database.sh

# Test connection
sqlite3 data/patient_records.db ".tables"
```

### Port Already in Use

```bash
# Check what's using the port
lsof -i :<port>

# Kill the process
./scripts/kill-port.sh <port>
```

## 📊 Process Overview

```
SQLite Database (data/patient_records.db)
  ↓
Java Service (Port 8080) ──┐
                           ├── Node.js Gateway (Port 3000)
Python Service (Port 5000) ┘
```

## 🎓 File Structure

```
patient-records/
├── LOCAL_SETUP.md              # Detailed installation guide
├── NO_DOCKER_SETUP.md          # This file
├── scripts/                    # Helper scripts
│   ├── init-database.sh
│   ├── start-java-service.sh
│   ├── start-python-service.sh
│   ├── start-node-service.sh
│   ├── test-services.sh
│   ├── kill-port.sh
│   └── setup-all.sh
├── data/                       # SQLite database
│   └── patient_records.db      # Created on first run
└── services/
    ├── java-service/
    │   ├── pom.xml
    │   ├── src/
    │   └── .env (after init)
    ├── python-service/
    │   ├── requirements.txt
    │   ├── .env.example
    │   ├── src/app.py
    │   └── venv/ (created by setup)
    └── node-service/
        ├── package.json
        ├── .env.example
        ├── src/
        └── node_modules/ (created by setup)
```

## 🚀 Development Workflow

### 1. Initial Setup
```bash
./scripts/setup-all.sh
./scripts/init-database.sh
```

### 2. Daily Development
```bash
# Terminal 1
./scripts/start-postgres.sh

# Terminal 2
./scripts/start-java-service.sh

# Terminal 3
./scripts/start-python-service.sh

# Terminal 4
./scripts/start-node-service.sh

# Terminal 5
./scripts/test-services.sh
```

### 3. Making Changes
- Edit source files
- Python/Node services auto-reload
- Java service requires rebuild (Ctrl+C and rerun)

### 4. Testing
```bash
# Each service has test directory
cd services/java-service && mvn test
cd services/python-service && pytest
cd services/node-service && npm test
```

## 📝 Environment Variables

### SQLite Database
```
Location: data/patient_records.db
Type: File-based (no server needed)
Backup: cp data/patient_records.db backup.db
```

### Java Service (SQLite)
```
DATASOURCE_URL=jdbc:sqlite:data/patient_records.db
DATASOURCE_DRIVER=org.sqlite.JDBC
```

### Python Service
```
DATABASE_URL=sqlite:////Users/gp/java-code/patient-records/data/patient_records.db
FLASK_ENV=development
PORT=5000
```

### Node Service
```
JAVA_SERVICE_URL=http://localhost:8080
PYTHON_SERVICE_URL=http://localhost:5000
PORT=3000
```

## 📞 Support

- **Installation Issues**: See `LOCAL_SETUP.md`
- **Architecture Questions**: See `PHASE_1_ARCHITECTURE.md`
- **Service Details**: See `services/*/README.md`
- **Troubleshooting**: See section above

## ✅ Checklist

- [ ] Java 25 installed
- [ ] Maven 3.9+ installed
- [ ] Python 3.11+ installed
- [ ] Node.js 20+ installed
- [ ] SQLite 3.x verified (built-in to macOS)
- [ ] All scripts are executable (chmod +x)
- [ ] Database initialized
- [ ] All services setup
- [ ] Services tested and working

---

**Status**: Ready for local development without Docker
**Last Updated**: December 2024
**Next**: Follow "Quick Start (5 Steps)" above
