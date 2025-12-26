# Project Structure - Quick Reference

## ✅ ACTIVE Directories (Use These)

### `/web/` - Main React Application
- **Purpose**: Production React UI
- **Build**: `npm run build` (outputs to `dist/`)
- **Framework**: Vite + React
- **Server Location**: `/opt/emr/web/dist/`
- **URL**: http://165.232.54.109

### `/services/node-api/` - Node.js API
- **Purpose**: Backend API
- **Port**: 3001
- **Service**: `emr-api.service`
- **Endpoints**: http://165.232.54.109/api/

### `/services/mcp-node-research/` - AI Research (Node.js)
- **Purpose**: MCP research server
- **Port**: 3007
- **Start**: `./scripts/start-ai-research.sh`

### `/services/mcp-python-research/` - AI Research (Python)
- **Purpose**: MCP research server
- **Port**: 3008
- **Start**: `./scripts/start-ai-research.sh`

### `/services/mcp-go-research/` - AI Research (Go)
- **Purpose**: MCP research server
- **Port**: 3009
- **Start**: `./scripts/start-ai-research.sh`

### `/ai-research-dashboard.html` - AI Research UI
- **Purpose**: Dashboard for AI research MCP servers
- **URL**: http://165.232.54.109/ai-research/

---

## ⚠️ DEPRECATED Directories (Ignore These)

### `/services/web-ui/` - OLD React App
- **Status**: DEPRECATED
- **Reason**: Replaced by `/web/`
- **Action**: Marked with DEPRECATED.md
- **Note**: node_modules removed to save space

---

## 📝 Deployment

### Main Deployment
```bash
./deployment/deploy-scp.sh
```

Deploys:
- React app from `/web/dist/`
- Node API from `/services/node-api/`
- AI research dashboard

### AI Research Servers (Local)
```bash
./scripts/start-ai-research.sh  # Start all 3 MCP servers
./scripts/stop-ai-research.sh   # Stop all 3 MCP servers
```

---

## 🔧 Server Commands

### SSH Access
```bash
ssh -i ~/.ssh/droplet_key root@165.232.54.109
```

### Service Management
```bash
# API
systemctl status emr-api
systemctl restart emr-api
journalctl -u emr-api -f

# Nginx
systemctl status nginx
systemctl reload nginx
tail -f /var/log/nginx/access.log
```

### File Locations on Server
```
/opt/emr/
├── web/dist/              # React app (ACTIVE)
├── services/
│   ├── node-api/          # API (ACTIVE)
│   ├── web-ui/            # DEPRECATED
│   ├── mcp-node-research/ # AI Research Node
│   ├── mcp-python-research/ # AI Research Python
│   └── mcp-go-research/   # AI Research Go
└── ai-research-dashboard.html
```

---

## 🌐 URLs

- **Main EMR**: http://165.232.54.109
- **API**: http://165.232.54.109/api/
- **AI Research**: http://165.232.54.109/ai-research/
- **API Health**: http://165.232.54.109/api/health

---

## 🚨 If Something Breaks

1. Check services:
   ```bash
   ssh -i ~/.ssh/droplet_key root@165.232.54.109 'systemctl status emr-api nginx'
   ```

2. Check logs:
   ```bash
   ssh -i ~/.ssh/droplet_key root@165.232.54.109 'journalctl -u emr-api -n 50'
   ```

3. Redeploy:
   ```bash
   ./deployment/deploy-scp.sh
   ```

---

**Last Updated**: December 18, 2025
