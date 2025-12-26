# Patient Records - Complete Setup Index

## 🎯 Where to Start?

### ⭐ **If you don't have Docker:** 
→ Read **`START_HERE_NO_DOCKER.md`** (Complete guide for native setup)

### 🐳 **If you have Docker:**
→ Read **`QUICKSTART.md`** (Docker Compose setup)

---

## 📚 Documentation Map

### Getting Started
| Document | Purpose | Audience |
|----------|---------|----------|
| **START_HERE_NO_DOCKER.md** ⭐ | Complete native setup guide | Everyone without Docker |
| **QUICKSTART.md** | Docker Compose setup | Docker users |
| **QUICK_REFERENCE.md** | One-page cheat sheet | Daily development |

### Setup & Installation
| Document | Purpose | Audience |
|----------|---------|----------|
| **LOCAL_SETUP.md** | Detailed prerequisites installation | Those installing tools |
| **NO_DOCKER_SETUP.md** | Quick reference for commands | Daily development |
| **NO_DOCKER_COMPLETE.md** | Summary of new files & setup | Understanding what's new |

### Understanding the System
| Document | Purpose | Audience |
|----------|---------|----------|
| **PHASE_1_ARCHITECTURE.md** | System design, architecture, MCP overview | Everyone |
| **PHASE_1_COMPLETE.md** | Phase 1 delivery summary | Project overview |
| **README.md** | Main project documentation | New developers |
| **CONTRIBUTING.md** | Code standards & contribution guidelines | Contributors |

### Service-Specific Documentation
| Document | Purpose | Service |
|----------|---------|---------|
| **services/java-service/README.md** | Java service setup & development | Java developers |
| **services/python-service/README.md** | Python service setup & development | Python developers |
| **services/node-service/README.md** | Node service setup & development | Node developers |

---

## 🛠️ Helper Scripts

All scripts are in the `scripts/` directory and are executable.

### Database Management
```bash
./scripts/init-database.sh        # One-time: Create & initialize database
./scripts/start-postgres.sh       # Start PostgreSQL
./scripts/stop-postgres.sh        # Stop PostgreSQL
```

### Service Management
```bash
./scripts/start-java-service.sh   # Build and start Java service
./scripts/start-python-service.sh # Setup venv and start Python service
./scripts/start-node-service.sh   # Install deps and start Node service
```

### Utilities
```bash
./scripts/test-services.sh        # Test all services health
./scripts/kill-port.sh <port>     # Kill process on specific port
./scripts/setup-all.sh            # One-command setup (first time only)
```

---

## 🚀 Quick Start (Choose One)

### Without Docker (Recommended if no Docker)

**Step 1:** Read `START_HERE_NO_DOCKER.md`

**Step 2:** Install prerequisites (Java, Maven, Python, Node, PostgreSQL)

**Step 3:** Run setup
```bash
./scripts/setup-all.sh
./scripts/init-database.sh
```

**Step 4:** Start services (4 terminal windows)
```bash
./scripts/start-postgres.sh      # Terminal 1
./scripts/start-java-service.sh  # Terminal 2
./scripts/start-python-service.sh # Terminal 3
./scripts/start-node-service.sh  # Terminal 4
```

**Step 5:** Verify
```bash
./scripts/test-services.sh
```

---

### With Docker (If available)

**Step 1:** Read `QUICKSTART.md`

**Step 2:** Run
```bash
docker-compose up -d
curl http://localhost:3000/health
```

---

## 📋 Service Overview

### Java Service (Port 8080)
- **Purpose**: Patient Data Management, Insurance Processing
- **Technology**: Java 25, Spring Boot (planned)
- **Files**: `services/java-service/`
- **Docs**: `services/java-service/README.md`

### Python Service (Port 5000)
- **Purpose**: Clinical Protocols, Lab Results
- **Technology**: Python 3.11, Flask
- **Files**: `services/python-service/`
- **Docs**: `services/python-service/README.md`

### Node Service (Port 3000)
- **Purpose**: API Gateway, Service Orchestration
- **Technology**: Node.js 20, Express.js
- **Files**: `services/node-service/`
- **Docs**: `services/node-service/README.md`

### PostgreSQL (Port 5432)
- **Purpose**: Shared database for all services
- **Technology**: PostgreSQL 16
- **Setup**: `./scripts/init-database.sh`

---

## 🎯 Daily Development Workflow

### Morning: Start Services
```bash
# Terminal 1
./scripts/start-postgres.sh

# Terminal 2
./scripts/start-java-service.sh

# Terminal 3
./scripts/start-python-service.sh

# Terminal 4
./scripts/start-node-service.sh

# Terminal 5 (verify)
./scripts/test-services.sh
```

### During Day: Make Changes
1. Edit source files in `services/*/src/`
2. Python & Node auto-reload
3. Java requires rebuild (Ctrl+C, rerun)

### Evening: Stop Services
- Press `Ctrl+C` in each terminal
- Or run `./scripts/kill-port.sh <port>`

---

## 🔍 Common Tasks

### Test Services
```bash
./scripts/test-services.sh

# Or individual tests
curl http://localhost:3000/health
curl http://localhost:5000/health
curl http://localhost:8080/health
```

### Connect to Database
```bash
psql -h localhost -U patient_user -d patient_records
# Password: patient_password
```

### Kill a Service
```bash
./scripts/kill-port.sh 3000  # Node
./scripts/kill-port.sh 5000  # Python
./scripts/kill-port.sh 8080  # Java
./scripts/kill-port.sh 5432  # PostgreSQL
```

### Run Service Tests
```bash
# Java
cd services/java-service && mvn test

# Python
cd services/python-service && pytest

# Node
cd services/node-service && npm test
```

---

## ❓ FAQ

**Q: Which document should I read first?**
- Without Docker: `START_HERE_NO_DOCKER.md`
- With Docker: `QUICKSTART.md`

**Q: How do I know what to install?**
→ See `LOCAL_SETUP.md` for each tool with links

**Q: How do I start services?**
→ Use the scripts: `./scripts/start-*.sh`

**Q: How do I test if everything works?**
→ Run `./scripts/test-services.sh`

**Q: Which files should I edit?**
→ See `services/*/src/` directories and individual service READMEs

**Q: What if something goes wrong?**
→ See troubleshooting in `START_HERE_NO_DOCKER.md` or `NO_DOCKER_SETUP.md`

---

## 📁 File Organization

```
patient-records/
│
├── 📖 Documentation (Start with ⭐)
│   ├── ⭐ START_HERE_NO_DOCKER.md      ← Read this first (no Docker)
│   ├── QUICKSTART.md                    ← Read this first (with Docker)
│   ├── QUICK_REFERENCE.md              Cheat sheet
│   ├── PHASE_1_ARCHITECTURE.md         System design
│   ├── PHASE_1_COMPLETE.md             Phase 1 summary
│   ├── LOCAL_SETUP.md                  Installation details
│   ├── NO_DOCKER_SETUP.md              Daily reference
│   ├── NO_DOCKER_COMPLETE.md           What's new summary
│   ├── README.md                       Main documentation
│   └── CONTRIBUTING.md                 Code standards
│
├── 🛠️ Scripts (All executable)
│   ├── setup-all.sh                    One-time setup
│   ├── init-database.sh                Database initialization
│   ├── start-postgres.sh               Start PostgreSQL
│   ├── stop-postgres.sh                Stop PostgreSQL
│   ├── start-java-service.sh           Start Java service
│   ├── start-python-service.sh         Start Python service
│   ├── start-node-service.sh           Start Node service
│   ├── test-services.sh                Test all services
│   └── kill-port.sh                    Kill service by port
│
├── 📦 Services
│   ├── java-service/
│   │   ├── pom.xml
│   │   ├── Dockerfile
│   │   ├── README.md
│   │   ├── src/
│   │   └── .env (created by setup)
│   │
│   ├── python-service/
│   │   ├── requirements.txt
│   │   ├── Dockerfile
│   │   ├── .env.example
│   │   ├── README.md
│   │   ├── src/
│   │   └── venv/ (created by setup)
│   │
│   └── node-service/
│       ├── package.json
│       ├── Dockerfile
│       ├── .env.example
│       ├── README.md
│       ├── src/
│       └── node_modules/ (created by setup)
│
└── 🐳 Docker Files
    ├── docker-compose.yml             Multi-service orchestration
    └── .gitignore                     Git configuration
```

---

## 🎓 Reading Guide by Role

### New Developer (First Day)
1. Read: `START_HERE_NO_DOCKER.md` (or `QUICKSTART.md` if Docker available)
2. Run: `./scripts/setup-all.sh && ./scripts/init-database.sh`
3. Start services
4. Read: `PHASE_1_ARCHITECTURE.md` for understanding
5. Check service READMEs for your service

### Backend Developer
1. Service-specific README: `services/java-service/README.md` or `services/python-service/README.md`
2. See database setup: `LOCAL_SETUP.md` → PostgreSQL section
3. Daily reference: `QUICK_REFERENCE.md`
4. Code standards: `CONTRIBUTING.md`

### Frontend/Gateway Developer
1. Service README: `services/node-service/README.md`
2. Architecture overview: `PHASE_1_ARCHITECTURE.md`
3. Daily reference: `QUICK_REFERENCE.md`
4. Code standards: `CONTRIBUTING.md`

### DevOps/Infrastructure
1. Architecture: `PHASE_1_ARCHITECTURE.md`
2. Docker setup: `QUICKSTART.md`
3. Scripts: Check `scripts/` directory
4. Next phases: See roadmap in `PHASE_1_ARCHITECTURE.md`

---

## ✅ Setup Verification Checklist

- [ ] Read appropriate getting started guide
- [ ] Installed all prerequisites
- [ ] Ran `./scripts/setup-all.sh`
- [ ] Ran `./scripts/init-database.sh`
- [ ] Started all 4 services (4 terminals)
- [ ] Ran `./scripts/test-services.sh` - all passed
- [ ] Can connect to database via psql
- [ ] Read `PHASE_1_ARCHITECTURE.md`
- [ ] Bookmarked `QUICK_REFERENCE.md`
- [ ] Ready to code! ✅

---

## 🚀 Next Steps

### Immediate
1. Choose your setup path (Docker or native)
2. Read the appropriate getting started guide
3. Run setup scripts
4. Start services
5. Verify everything works

### This Week
1. Get familiar with codebase
2. Read architecture documentation
3. Make your first code changes
4. Run tests

### Next Week
1. Pick a feature to implement
2. Create feature branch
3. Make changes
4. Submit pull request
5. Follow code review process

---

## 📞 Getting Help

### For Installation Issues
→ `LOCAL_SETUP.md` section for your tool

### For Setup/Startup Issues
→ Troubleshooting section in `START_HERE_NO_DOCKER.md`

### For Daily Development
→ `QUICK_REFERENCE.md` or `NO_DOCKER_SETUP.md`

### For Architecture Questions
→ `PHASE_1_ARCHITECTURE.md`

### For Code Standards
→ `CONTRIBUTING.md` and individual service READMEs

### For Service-Specific Help
→ `services/<service>/README.md`

---

## 🎉 Welcome to Patient Records!

Your healthcare AI platform is ready for development.

**Start here:** Choose `START_HERE_NO_DOCKER.md` or `QUICKSTART.md` based on your setup option.

---

**Documentation Version**: 1.0
**Phase**: 1 (Core Setup)
**Last Updated**: December 2024
**Status**: ✅ Complete and Ready
