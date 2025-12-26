# 🚀 Local Deployment - Active

**Deployment Date:** December 26, 2025  
**Status:** ✅ All services running

## 📊 Service Status

| Service | Port | Status | PID | Logs |
|---------|------|--------|-----|------|
| **Java MCP Service** | 9999 | ✅ Running | 16303 | `/tmp/java-service.log` |
| **Python Service** | 5000 | ✅ Running | 16500 | `/tmp/python-service.log` |
| **Node API Gateway** | 3000 | ✅ Running | 16727 | `/tmp/node-service.log` |
| **React Web UI** | 3001 | ✅ Running | 16983 | `/tmp/web-ui.log` |
| **MCP Node.js Research** | 3007 | ✅ Running | 21645 | `/tmp/mcp-node-research.log` |
| **MCP Python Research** | 3008 | ✅ Running | 23536 | `/tmp/mcp-python-research.log` |
| **MCP Go Research** | 3009 | ✅ Running | 35445 | `/tmp/mcp-go-research.log` |

## 🌐 Access Points

- **Web Application:** http://localhost:3001/
- **API Gateway:** http://localhost:3000/
- **Python Service:** http://localhost:5000/health
- **MCP Node.js Research:** http://localhost:3007/health
- **MCP Python Research:** http://localhost:3008/health
- **MCP Go Research:** http://localhost:3009/health
- **Java Socket Server:** localhost:9999 (TCP)

## 🔍 Quick Commands

### Check Service Status
```bash
ps aux | grep -E "(java.*SocketServer|python3.*app.py|node.*index.js|vite)" | grep -v grep
```

### View Logs
```bash
# Java Service
tail -f /tmp/java-service.log

# Python Service
tail -f /tmp/python-service.log

# Node Service
tail -f /tmp/node-service.log

# React UI
tail -f /tmp/web-ui.log
```

### Stop All Services
```bash
# Kill by port
kill $(lsof -t -i:9999)  # Java
kill $(lsof -t -i:5000)  # Python
kill $(lsof -t -i:3000)  # Node
kill $(lsof -t -i:3001)  # React
kill $(lsof -t -i:3007)  # MCP Node Research
kill $(lsof -t -i:3008)  # MCP Python Research
kill $(lsof -t -i:3009)  # MCP Go Research

# Or kill by process
pkill -f "SocketServer"
pkill -f "app.py"
pkill -f "node.*index.js"
pkill -f "vite"
pkill -f "mcp-node-research"
```

### Restart Individual Service
```bash
# Java Service
cd /home/girish/latest-react-apps/patient-records/services/java-service
nohup java -cp target/patient-records-java-service-1.0.0.jar com.healthcare.java.patient.SocketServer > /tmp/java-service.log 2>&1 &

# Python Service
cd /home/girish/latest-react-apps/patient-records/services/python-service
source venv/bin/activate && nohup python3 src/app.py > /tmp/python-service.log 2>&1 &

# Node Service
cd /home/girish/latest-react-apps/patient-records/services/node-service
nohup npm start > /tmp/node-service.log 2>&1 &

# React UI
cd /home/girish/latest-react-apps/patient-records/web
nohup npm run dev > /tmp/web-ui.log 2>&1 &

# MCP Node.js Research Server
cd /home/girish/latest-react-apps/patient-records/services/mcp-node-research
nohup npm start > /tmp/mcp-node-research.log 2>&1 &

# MCP Python Research Server
cd /home/girish/latest-react-apps/patient-records/services/mcp-python-research
source venv/bin/activate && nohup python3 main.py > /tmp/mcp-python-research.log 2>&1 &

# MCP Go Research Server
cd /home/girish/latest-react-apps/patient-records/services/mcp-go-research
nohup ./mcp-go-research-linux > /tmp/mcp-go-research.log 2>&1 &
```

## 🧪 Test Services

```bash
# Test Python service health
curl http://localhost:5000/health

# Test Node API Gateway
curl http://localhost:3000/api/health

# Access Web UI
open http://localhost:3001/
```

## 📝 Notes

- All services are running in the background with nohup
- Logs are written to `/tmp/` directory
- SQLite database is used (no PostgreSQL needed)
- Java service uses Virtual Threads (Java 25 feature)

## 🛠️ Troubleshooting

If a service fails to start:

1. Check the logs in `/tmp/*-service.log`
2. Verify the port is not already in use: `lsof -i :<port>`
3. Ensure all dependencies are installed (see build logs)
4. Check Java version: `java -version` (should be 25+)
5. Check Python version: `python3 --version` (should be 3.11+)
6. Check Node version: `node --version` (should be 20+)
