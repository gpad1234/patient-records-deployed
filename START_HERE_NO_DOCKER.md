# No Docker Setup - Complete Guide

## Overview

You can run the entire Patient Records system locally without Docker or Homebrew using native installations of Java, Python, and Node.js. SQLite is built-in to most systems and doesn't require separate installation.

## 📋 Table of Contents

1. [Prerequisites Installation](#prerequisites-installation)
2. [Quick Start](#quick-start)
3. [Service Management](#service-management)
4. [Testing](#testing)
5. [Troubleshooting](#troubleshooting)

---

## Prerequisites Installation

### Java 25

1. **Visit**: https://www.oracle.com/java/technologies/downloads/
2. **Download**: JDK 25 for macOS (Intel or Apple Silicon)
3. **Install**: Run the `.dmg` installer
4. **Verify**:
   ```bash
   java -version
   javac -version
   ```
5. **Optional - Add to PATH** (if needed):
   ```bash
   echo 'export JAVA_HOME=$(/usr/libexec/java_home -v 25)' >> ~/.zprofile
   source ~/.zprofile
   ```

### Maven 3.9+

1. **Download**: https://maven.apache.org/download.cgi (Binary zip)
2. **Extract**: 
   ```bash
   mkdir -p /opt
   cd /opt
   unzip ~/Downloads/apache-maven-3.9.6-bin.zip
   ```
3. **Add to PATH**:
   ```bash
   echo 'export PATH=/opt/apache-maven-3.9.6/bin:$PATH' >> ~/.zprofile
   source ~/.zprofile
   ```
4. **Verify**:
   ```bash
   mvn -version
   ```

### Python 3.11+

1. **Visit**: https://www.python.org/downloads/
2. **Download**: Python 3.11+ installer for macOS
3. **Install**: Run the installer
4. **Verify**:
   ```bash
   python3 --version
   pip3 --version
   ```
5. **Optional - Create alias** (for convenience):
   ```bash
   echo 'alias python=python3' >> ~/.zprofile
   echo 'alias pip=pip3' >> ~/.zprofile
   source ~/.zprofile
   ```

### Node.js 20+

1. **Visit**: https://nodejs.org/
2. **Download**: Node.js 20 LTS (macOS installer)
3. **Install**: Run the installer
4. **Verify**:
   ```bash
   node --version
   npm --version
   ```

### SQLite (Included in Python & Java)

**SQLite is built-in** - no separate installation needed!

1. **Python**: Included with Python 3.11+
2. **Java**: Using sqlite-jdbc driver (included in pom.xml)
3. **Data file**: `data/patient_records.db` (auto-created)

Verify SQLite is available:
```bash
sqlite3 --version
# Should show: 3.x.x
```

### PostgreSQL 16 (OPTIONAL - For Future Production Use)

> **For pilot phase**: Skip this section. We're using SQLite for the pilot. PostgreSQL can be installed later for production.

If you want to prepare for future PostgreSQL migration:

1. **Visit**: https://www.postgresql.org/download/macosx/
2. **Download**: Interactive installer by EDB
3. **Install**: Run the installer (install in default location)
4. **Verify**:
   ```bash
   psql --version
   ```

### Verify All Prerequisites

```bash
java -version
mvn -version
python3 --version
pip3 --version
node --version
npm --version
sqlite3 --version
```

All commands should show version information without errors.

---

## Quick Start

### 1️⃣ Initialize Database

```bash
cd /Users/gp/java-code/patient-records

# Create SQLite database file
mkdir -p data
./scripts/init-database.sh
```

**What it does:**
- Creates `data/` directory if needed
- Creates SQLite database: `data/patient_records.db`
- Sets up initial schema

### 2️⃣ Setup All Services

```bash
./scripts/setup-all.sh
```

**What it does:**
- Makes all scripts executable
- Builds Java service (mvn install)
- Creates Python virtual environment
- Installs Python dependencies
- Installs Node.js packages
- Creates `.env` files

### 3️⃣ Start Services (Open 3 Terminal Windows)

**Terminal 1 - Start Java Service:**
```bash
cd /Users/gp/java-code/patient-records
./scripts/start-java-service.sh
```
- Builds and starts on http://localhost:8080
- Takes 30-60 seconds on first run

**Terminal 2 - Start Python Service:**
```bash
cd /Users/gp/java-code/patient-records
./scripts/start-python-service.sh
```
- Starts on http://localhost:5000
- Auto-reloads on file changes

**Terminal 3 - Start Node Service:**
```bash
cd /Users/gp/java-code/patient-records
./scripts/start-node-service.sh
```
- Starts on http://localhost:3000
- Auto-reloads on file changes

### 4️⃣ Verify Services

In a 4th terminal, run:

```bash
./scripts/test-services.sh
```

Expected output:
```json
{
  "status": "healthy",
  "service": "node-service",
  "version": "1.0.0"
}
```

---

## Service Management

### 📍 Service Endpoints

| Service | URL | Purpose |
|---------|-----|---------|
| Node Gateway | http://localhost:3000 | API Gateway & Orchestration |
| Java Service | http://localhost:8080 | Patient Data & Persistence |
| Python Service | http://localhost:5000 | Clinical Data & AI Features |
| SQLite Database | data/patient_records.db | Local File Database |

### 🤖 Service Responsibilities

**Python Service (Port 5000)** - AI & Clinical Intelligence
- LLM integration (Claude, GPT, etc.)
- Clinical analysis & recommendations
- Patient insights & pattern detection
- Risk assessment algorithms
- Protocol recommendations
- All AI/ML feature development

**Java Service (Port 8080)** - Data Management
- Patient record CRUD operations
- Data validation & integrity
- Insurance claim processing
- Medication management
- Database persistence
- Business logic for data operations

**Node.js Gateway (Port 3000)** - API Orchestration
- Request routing to services
- Response aggregation
- Authentication & authorization
- Load balancing
- Request/response formatting
- **No direct database access**
- **No AI/ML logic**

### Starting Services

**Full setup (first time):**
```bash
./scripts/setup-all.sh
./scripts/init-database.sh
```

**Start all services (separate terminals):**
```bash
# Terminal 1
./scripts/start-java-service.sh

# Terminal 2
./scripts/start-python-service.sh

# Terminal 3
./scripts/start-node-service.sh
```

### Stopping Services

Services run in terminals - press `Ctrl+C` to stop them.

### Restarting a Service

```bash
# Kill the service by port
./scripts/kill-port.sh 3000   # Node
./scripts/kill-port.sh 5000   # Python
./scripts/kill-port.sh 8080   # Java

# Then restart it
./scripts/start-<service>-service.sh
```

---

## Testing

### Test All Services

```bash
./scripts/test-services.sh
```

### Test Individual Services

```bash
# Node Gateway
curl http://localhost:3000/health
curl http://localhost:3000/info

# Java Service
curl http://localhost:8080/health

# Python Service
curl http://localhost:5000/health

# All services health (via gateway)
curl http://localhost:3000/services/health
```

### Run Service Tests

```bash
# Java tests
cd services/java-service
mvn test

# Python tests
cd services/python-service
pytest tests/

# Node tests
cd services/node-service
npm test
```

### SQLite Database Tests

```bash
# Connect to SQLite database
sqlite3 data/patient_records.db

# Run a query
SELECT 1;

# List tables
.tables

# Exit
.quit
```

---

## Configuration

### Environment Variables

Each service uses a `.env` file. These are created automatically by `setup-all.sh`.

**Java Service** - uses SQLite (configured in application.properties)
```properties
spring.datasource.url=jdbc:sqlite:data/patient_records.db
spring.datasource.driver-class-name=org.sqlite.JDBC
```

**Python Service** - `services/python-service/.env`
```ini
FLASK_ENV=development
FLASK_DEBUG=True
PORT=5000
DATABASE_URL=sqlite:////Users/gp/java-code/patient-records/data/patient_records.db
SERVICE_NAME=python-service
LOG_LEVEL=INFO
```

**Node Service** - `services/node-service/.env`
```ini
NODE_ENV=development
PORT=3000
JAVA_SERVICE_URL=http://localhost:8080
PYTHON_SERVICE_URL=http://localhost:5000
LOG_LEVEL=info
SERVICE_NAME=node-service
REQUEST_TIMEOUT=30000
```

### Changing Service Ports

Edit the `.env` file in the service directory:

```bash
# Python service
cd services/python-service
nano .env
# Change PORT=5000 to PORT=5001
# Save and restart service
```

---

## Troubleshooting

### Database (SQLite) Issues

**Database file not created:**
```bash
# Database file is automatically created when services start
# Location: data/patient_records.db
# If missing, it will be created on first service startup

# To verify it exists:
ls -lah data/patient_records.db
```

**Database locked or corrupted:**
```bash
# Stop all services first
# Then remove and recreate
rm data/patient_records.db
./scripts/init-database.sh
```

**Can't connect to database:**
```bash
# Verify database file exists
ls -la data/patient_records.db

# Check file permissions
chmod 666 data/patient_records.db

# Restart services
./scripts/kill-port.sh 8080
./scripts/kill-port.sh 5000
./scripts/start-java-service.sh
./scripts/start-python-service.sh
```

### Java Service Issues

**Won't build:**
```bash
# Verify Java
java -version

# Verify Maven
mvn -version

# Clean build
cd services/java-service
mvn clean install -U
```

**Won't start:**
```bash
# Check if port 8080 is in use
lsof -i :8080

# Kill if necessary
./scripts/kill-port.sh 8080

# Try again
./scripts/start-java-service.sh
```

**Build takes too long:**
- First build: 2-3 minutes (downloading dependencies)
- Subsequent builds: 30-60 seconds
- This is normal

### Python Service Issues

**Virtual environment issues:**
```bash
cd services/python-service

# Remove old venv
rm -rf venv

# Recreate
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**Module not found:**
```bash
cd services/python-service
source venv/bin/activate
pip install -r requirements.txt --force-reinstall
```

**Port already in use:**
```bash
./scripts/kill-port.sh 5000
./scripts/start-python-service.sh
```

### Node Service Issues

**npm install fails:**
```bash
cd services/node-service

# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Port already in use:**
```bash
./scripts/kill-port.sh 3000
./scripts/start-node-service.sh
```

**Module not found:**
```bash
cd services/node-service
npm install
```

### General Issues

**Check all processes:**
```bash
ps aux | grep -E "java|python|node"
```

**Kill all services:**
```bash
./scripts/kill-port.sh 3000
./scripts/kill-port.sh 5000
./scripts/kill-port.sh 8080
```

**Verify installation:**
```bash
java -version
mvn -version
python3 --version
pip3 --version
node --version
npm --version
sqlite3 --version
```

---

## Development Tips

### Code Changes

**Python/Node services** auto-reload on file changes:
- Edit file
- Save
- Service automatically restarts

**Java service** requires manual rebuild:
- Edit file
- Save
- Press `Ctrl+C` in Java terminal
- Run `./scripts/start-java-service.sh` again

### Viewing Logs

Logs appear in the terminal where the service is running. To save logs:

```bash
# Redirect to file
./scripts/start-python-service.sh > python.log 2>&1 &

# View logs
tail -f python.log

# Or with grep to filter
grep "ERROR" python.log
```

### Database Debugging

```bash
# Connect to database
sqlite3 data/patient_records.db

# Common commands
.tables                      # List tables
.schema <table_name>        # Describe table
SELECT * FROM <table>;      # Query data
.quit                       # Exit
```

### Service Communication Testing

```bash
# Test Node → Java connection
curl -X GET http://localhost:3000/api/patients

# Test Node → Python connection
curl -X GET http://localhost:3000/api/protocols

# Test direct Java connection
curl -X GET http://localhost:8080/health

# Test direct Python connection
curl -X GET http://localhost:5000/health
```

---

## Common Tasks

### Make Code Changes

1. Edit source file
2. For Python/Node: Changes apply automatically
3. For Java: Stop service → Rebuild → Restart

### Run Tests

```bash
# All tests
cd services/<service>
# Java: mvn test
# Python: pytest
# Node: npm test
```

### Reset Everything

```bash
# Stop all services (Ctrl+C)

# Reset database
./scripts/init-database.sh

# Rebuild Java
cd services/java-service
mvn clean install

# Reinstall Python
cd services/python-service
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Reinstall Node
cd services/node-service
rm -rf node_modules
npm install

# Start fresh
./scripts/start-java-service.sh  # Terminal 1
./scripts/start-python-service.sh  # Terminal 2
./scripts/start-node-service.sh  # Terminal 3
./scripts/test-services.sh  # Terminal 4
```

### Backup Database

```bash
# Copy SQLite database file
cp data/patient_records.db backup-$(date +%Y%m%d-%H%M%S).db
```

### Restore Database

```bash
# Restore from backup
cp backup-<date>.db data/patient_records.db
```

---

## FAQ

**Q: Can I run services on different machines?**
A: Yes, update the service URLs in `.env` files.

**Q: Can I use a different database?**
A: Yes, update `DATABASE_URL` in Python service and database credentials elsewhere.

**Q: How do I change service ports?**
A: Edit the `PORT` variable in each service's `.env` file.

**Q: Can I run everything in one terminal?**
A: Yes, but you won't see logs from all services. Use separate terminals for better visibility.

**Q: How do I monitor resource usage?**
A: Use `top` or `Activity Monitor` on macOS to see CPU/memory usage.

---

## Next Steps

1. ✅ Install prerequisites
2. ✅ Run `./scripts/setup-all.sh`
3. ✅ Run `./scripts/init-database.sh`
4. ✅ Start all services in separate terminals
5. ✅ Run `./scripts/test-services.sh`
6. 📖 Read architecture docs: `PHASE_1_ARCHITECTURE.md`
7. 💻 Start coding!

---

**Setup Complete!** 🎉

Your Patient Records healthcare platform is ready for development.

For more information:
- Architecture: `PHASE_1_ARCHITECTURE.md`
- Quick Reference: `NO_DOCKER_SETUP.md`
- Detailed Setup: `LOCAL_SETUP.md`
- Contributing: `CONTRIBUTING.md`
