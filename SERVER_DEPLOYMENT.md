# Server Deployment Guide

## Quick Start

### Option 1: Automated Deployment (Recommended)

From your laptop:

```bash
cd /Users/gp/java-code/patient-records

# Deploy to server
./deployment/deploy-quick.sh 165.232.54.109
```

This will:
1. Clone the latest code from GitHub
2. Install Node.js and Nginx
3. Build the React app
4. Configure Nginx as reverse proxy
5. Start services with systemd
6. Output access URL

### Option 2: Manual SSH Deployment

```bash
# SSH into server
ssh root@165.232.54.109

# Run deployment script
bash /tmp/emr-deploy.sh
```

## Architecture on Server

```
Client Browser
    ↓ HTTP :80
┌─────────────────────┐
│  Nginx Reverse      │
│  Proxy              │
└─────────────────────┘
    ↓ :3001        ↓ :80 (static)
┌──────────────────────────────┐
│  Node.js API  │ React Build   │
│  :3001        │ /var/www/emr  │
└──────────────────────────────┘
    ↓
┌──────────────────┐
│  SQLite DB       │
└──────────────────┘
```

## Server Structure

```
/opt/emr/
├── services/
│   ├── node-api/
│   │   ├── src/
│   │   ├── data/
│   │   │   └── diabetes.db
│   │   └── node_modules/
│   ├── web-ui/
│   │   ├── build/  (served by Nginx)
│   │   └── node_modules/
│   └── reverse-proxy/
├── nginx.conf
└── .git/
```

## Accessing the Application

### From Anywhere

```
http://165.232.54.109
```

### Add to Local Hosts (Optional)

```bash
# Edit /etc/hosts
echo "165.232.54.109 emr" | sudo tee -a /etc/hosts
```

Then access: `http://emr`

## Server Commands

### View Logs

```bash
# API logs (real-time)
ssh root@165.232.54.109 "sudo journalctl -u emr-api -f"

# Nginx logs
ssh root@165.232.54.109 "sudo tail -f /var/log/nginx/access.log"
ssh root@165.232.54.109 "sudo tail -f /var/log/nginx/error.log"
```

### Manage Services

```bash
# Restart API
ssh root@165.232.54.109 "sudo systemctl restart emr-api"

# Restart Nginx
ssh root@165.232.54.109 "sudo systemctl restart nginx"

# Service status
ssh root@165.232.54.109 "sudo systemctl status emr-api"
ssh root@165.232.54.109 "sudo systemctl status nginx"
```

### Update Code

```bash
# From server (SSH)
cd /opt/emr
git pull origin react-ui-emr

# Rebuild React
cd services/web-ui
npm install
npm run build

# Restart Nginx (to serve new build)
sudo systemctl restart nginx
```

## Database Access

### Backup Database

```bash
ssh root@165.232.54.109 "cp /opt/emr/services/node-api/data/diabetes.db /opt/emr/services/node-api/data/diabetes.db.backup"
```

### Download Database

```bash
scp root@165.232.54.109:/opt/emr/services/node-api/data/diabetes.db ./diabetes-backup.db
```

## Health Check

```bash
# Check API
curl http://165.232.54.109/api/admin/seed-status

# Check frontend
curl -I http://165.232.54.109
```

## Troubleshooting

### API Not Responding

```bash
ssh root@165.232.54.109 "sudo systemctl restart emr-api && sudo journalctl -u emr-api -n 20"
```

### Nginx Issues

```bash
ssh root@165.232.54.109 "sudo nginx -t && sudo systemctl restart nginx"
```

### Port Conflicts

```bash
ssh root@165.232.54.109 "sudo lsof -i :80 && sudo lsof -i :3001"
```

## Environment Variables

Edit `/opt/emr/services/node-api/.env`:

```bash
ssh root@165.232.54.109 "nano /opt/emr/services/node-api/.env"
```

Available variables:
- `PORT=3001` - API port
- `NODE_ENV=production` - Environment
- `DATABASE_URL=./data/diabetes.db` - Database path
- `API_CORS=*` - CORS settings

## Server Info

- **IP**: 165.232.54.109
- **User**: root
- **App Dir**: /opt/emr
- **API Port**: 3001 (internal)
- **Web Port**: 80 (external)
- **Services**: emr-api, nginx
- **Init System**: systemd

## Summary

| Component | Location | Status Command |
|-----------|----------|---|
| Node API | /opt/emr/services/node-api | `systemctl status emr-api` |
| React Build | /opt/emr/services/web-ui/build | Served by Nginx |
| Nginx Proxy | /etc/nginx/sites-enabled/emr | `systemctl status nginx` |
| Database | /opt/emr/services/node-api/data | SQLite3 |

## Keep Laptop Clean

✅ No local services running
✅ All code still on laptop (via git)
✅ Server handles deployment
✅ Access via browser or API clients
