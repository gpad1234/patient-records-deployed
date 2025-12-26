# Healthcare Platform - Production Version

**Repository:** https://github.com/gpad1234/patient-records-deployed  
**Created:** December 26, 2025  
**Location:** `/home/girish/latest-react-apps/healthcare-platform`

## 🚀 Quick Start

```bash
cd /home/girish/latest-react-apps/healthcare-platform

# Build all services
./scripts/setup-all.sh

# Start all 9 services
./scripts/start-java-service.sh &
./scripts/start-python-service.sh &
./scripts/start-node-service.sh &
./scripts/start-ai-research.sh &
cd web && npm run dev &
```

## 📦 What's Included

- **Java 25 Service** - Patient records with Virtual Threads (Port 9999)
- **Python Service** - Flask API (Port 5000)
- **Node API Gateway** - Express (Port 3000)
- **React Web UI** - Vite dev server (Port 3001)
- **3 MCP Research Servers** - Node.js (3007), Python (3008), Go (3009)

## 📚 Documentation

- [DEPLOYMENT_LOCAL_STATUS.md](DEPLOYMENT_LOCAL_STATUS.md) - Service management
- [QUICKSTART.md](QUICKSTART.md) - Detailed setup guide
- [NO_DOCKER_SETUP.md](NO_DOCKER_SETUP.md) - Local deployment without Docker

## 🔧 Development

```bash
# Make changes
git add .
git commit -m "Your changes"
git push origin main
```

This is the clean production version. Do not use the old `/home/girish/latest-react-apps/patient-records` folder.
