# Quick Reference Card - No Docker Setup

## 🚀 One-Time Setup

```bash
# Step 1: Install prerequisites (see START_HERE_NO_DOCKER.md)
# Java 25, Maven 3.9+, Python 3.11+, Node.js 20+
# (SQLite is built-in, no installation needed)

# Step 2: Setup everything
cd /Users/gp/java-code/patient-records
./scripts/setup-all.sh
./scripts/init-database.sh

# Done! ✅
```

## 📍 Service Ports

| Service | Port | Status Endpoint |
|---------|------|---|
| SQLite | - | `data/patient_records.db` |
| Java | 8080 | `curl http://localhost:8080/health` |
| Python | 5000 | `curl http://localhost:5000/health` |
| Node | 3000 | `curl http://localhost:3000/health` |

## 🎯 Daily Startup (3 Terminal Windows)

```bash
# Terminal 1: Java Service (builds on first run)
./scripts/start-java-service.sh

# Terminal 2: Python Service
./scripts/start-python-service.sh

# Terminal 3: Node Service
./scripts/start-node-service.sh

# Terminal 4 (or new window): Test
./scripts/test-services.sh
```

## 📜 Most Common Commands

```bash
# Test all services
./scripts/test-services.sh

# Test specific service
curl http://localhost:3000/health
curl http://localhost:5000/health
curl http://localhost:8080/health

# Kill service on port
./scripts/kill-port.sh 3000
./scripts/kill-port.sh 5000
./scripts/kill-port.sh 8080

# Database
sqlite3 data/patient_records.db ".tables"

# View service logs
# (logs appear in the terminal where service runs)

# Make code changes
# - Edit source file
# - Python/Node: auto-reload
# - Java: Ctrl+C, rebuild, restart
```

## 📁 File Locations

```
~/patient-records/
├── scripts/              # All helper scripts
├── services/
│   ├── java-service/     # Java code
│   ├── python-service/   # Python code
│   └── node-service/     # Node code
├── START_HERE_NO_DOCKER.md    ⭐ Start here
└── NO_DOCKER_SETUP.md         Quick ref
```

## 🔧 Environment Variables

### Database (Auto)
```
Host: localhost:5432
User: patient_user
Pass: patient_password
Database: patient_records
```

### Java Service (Auto)
```
Reads from database env vars
```

### Python Service (~./services/python-service/.env)
```
DATABASE_URL=sqlite:////Users/gp/java-code/patient-records/data/patient_records.db
FLASK_ENV=development
PORT=5000
```

### Node Service (~./services/node-service/.env)
```
JAVA_SERVICE_URL=http://localhost:8080
PYTHON_SERVICE_URL=http://localhost:5000
PORT=3000
```

## 🧪 Quick Tests

```bash
# All services
./scripts/test-services.sh

# Gateway health
curl http://localhost:3000/health

# All services via gateway
curl http://localhost:3000/services/health

# Individual services
curl http://localhost:8080/health
curl http://localhost:5000/health

# Database
sqlite3 data/patient_records.db "SELECT 1"
```

## 🐛 Quick Fixes

```bash
# Service won't start?
lsof -i :<port>                    # Check what's using port
./scripts/kill-port.sh <port>      # Kill it

# Database won't connect?
./scripts/init-database.sh         # Re-initialize

# Java won't build?
cd services/java-service
mvn clean install -U              # Clean build

# Python dependencies missing?
cd services/python-service
source venv/bin/activate
pip install -r requirements.txt

# Node modules missing?
cd services/node-service
npm install
```

## 📊 System Overview

```
┌─────────────────────────────────────┐
│   Your Local Development Setup       │
├─────────────────────────────────────┤
│                                      │
│  ┌─────────────────────────────┐   │
│  │ SQLite (data/patient_records)│   │
│  │   patient_records.db         │   │
│  └──────────┬────────────────┬──┘   │
│             │                │       │
│    ┌────────▼─┐      ┌──────▼────┐  │
│    │  Java    │      │  Python   │  │
│    │ (8080)   │      │  (5000)   │  │
│    └────┬─────┘      └──────┬────┘  │
│         │                   │        │
│         └─────────┬─────────┘        │
│                   │                  │
│             ┌─────▼─────┐            │
│             │Node.js    │            │
│             │ (3000)    │            │
│             └───────────┘            │
│                                      │
└─────────────────────────────────────┘
```

## ⏱️ Expected Startup Times

| Service | First Run | Subsequent |
|---------|-----------|------------|
| SQLite | instant | instant |
| Java | 2-3 min | 30-60s |
| Python | 10s | 3s |
| Node | 10s | 2s |
| **Total** | **~3 min** | **~1 min** |

## 📚 Documentation Quick Links

| Document | Purpose |
|----------|---------|
| `START_HERE_NO_DOCKER.md` | Complete setup guide ⭐ |
| `NO_DOCKER_SETUP.md` | Daily quick reference |
| `LOCAL_SETUP.md` | Installation details |
| `PHASE_1_ARCHITECTURE.md` | System design |
| `CONTRIBUTING.md` | Code standards |
| `services/*/README.md` | Service specifics |

## 🎯 Development Workflow

```
1. Start services (4 terminals)
        ↓
2. Make code changes
        ↓
3. Auto-reload (Python/Node) or rebuild (Java)
        ↓
4. Test with curl or scripts/test-services.sh
        ↓
5. Commit and push
        ↓
6. Repeat from step 2
```

## ✅ Verification Checklist

- [ ] All 3 services show "healthy"
- [ ] `./scripts/test-services.sh` passes
- [ ] Database file exists at `data/patient_records.db`
- [ ] Can reach Node gateway on :3000
- [ ] Can reach Java service on :8080
- [ ] Can reach Python service on :5000

## 💻 Keyboard Shortcuts

```bash
Ctrl+C          Stop service
Ctrl+Z          Suspend service
fg              Resume suspended service
Ctrl+L          Clear terminal
history         See command history
!<num>          Repeat command by number
```

## 🆘 When Things Go Wrong

```bash
# Check all running services
ps aux | grep -E "java|python|node"

# Kill everything and start fresh
./scripts/kill-port.sh 3000
./scripts/kill-port.sh 5000
./scripts/kill-port.sh 8080

# Verify installations
java -version && mvn -version && python3 --version && node --version && sqlite3 --version

# Full reset (nuclear option)
./scripts/setup-all.sh
./scripts/init-database.sh

# Start services again
# (use 4 separate terminals)
```

---

**Save this as a reference!** 📌

For details: Read `START_HERE_NO_DOCKER.md`
