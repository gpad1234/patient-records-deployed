# Deployment Guide: LiveResearch Disabled + Separate AI Research Platform

## Changes Summary

### 1. Production EMR Changes (Immediate)
**Status:** ✅ Completed

**Changes:**
- Disabled "Live Feed" tab in AIPredictions.jsx
- Removed LiveResearch component import
- Removed LiveResearch render code
- Button now shows "Live Feed (Research App)" with tooltip

**Files Modified:**
- `services/web-ui/src/components/AIPredictions.jsx`

**Impact:**
- Users see disabled button pointing to separate research app
- No breaking changes to existing 6 prediction tabs
- Maintains "Research" (demo) tab with hardcoded articles

---

### 2. New Separate AI Research Application
**Status:** ✅ Created

**Structure:**
```
/ai-research/
├── services/
│   ├── mcp-node-research/      (Port 3007)
│   ├── mcp-python-research/    (Port 3008)
│   ├── mcp-go-research/        (Port 3009)
│   ├── mcp-spring-research/    (Port 3010 - optional)
│   └── web-ui/                 (React Dashboard - Port 3011)
├── docker-compose.yml
├── nginx.conf
└── AI_RESEARCH_PLATFORMS.md
```

**Four MCP Server Implementations:**

1. **Node.js (Port 3007)**
   - Express + Cheerio + axios
   - Tools: PubMed, arXiv, CrossRef
   - Strengths: JavaScript ecosystem, rapid development

2. **Python (Port 3008)**
   - FastAPI + BeautifulSoup + Selenium
   - Tools: ScienceDirect, Google Scholar, PDF extraction
   - Strengths: Data science libraries, easy async

3. **Go (Port 3009)**
   - Gin + Colly
   - Tools: CrossRef, OpenAlex, parallel search
   - Strengths: Performance, concurrency, single binary

4. **Spring AI (Port 3010 - optional)**
   - Spring Boot 3.x + jsoup + LLM integration
   - Tools: Research synthesis with AI analysis
   - Strengths: Enterprise features, type safety

---

## Deployment Steps

### Step 1: Deploy Production EMR Changes

```bash
cd /opt/emr/services/web-ui

# Build React UI
npm run build

# Copy to Nginx
cp -r build/* /var/www/html/

# Restart Nginx
systemctl restart nginx

# Verify
curl http://localhost/predictions/ai | grep -i "live feed"
```

**Verification:**
- ✅ "Live Feed" button is disabled
- ✅ Tooltip shows "Live research moved to separate research application"
- ✅ No JavaScript errors
- ✅ Other 6 tabs work normally

---

### Step 2: Create AI Research Application Directory

```bash
# On local machine
mkdir -p /Users/gp/ai-research
cd /Users/gp/ai-research

# Create structure
mkdir -p services/{mcp-node-research,mcp-python-research,mcp-go-research,web-ui}

# Copy implementations
# (Files already created above)

# Upload to server
scp -r /Users/gp/ai-research root@165.232.54.109:/opt/
```

---

### Step 3: Build & Deploy MCP Servers

#### Node.js Server
```bash
cd /opt/ai-research/services/mcp-node-research

npm install
npm start

# Verify
curl http://localhost:3007/health
```

#### Python Server
```bash
cd /opt/ai-research/services/mcp-python-research

pip install -r requirements.txt
python main.py

# Verify
curl http://localhost:3008/health
```

#### Go Server
```bash
cd /opt/ai-research/services/mcp-go-research

go mod download
go run main.go

# Verify
curl http://localhost:3009/health
```

---

### Step 4: Setup Docker Compose (Recommended)

```bash
cd /opt/ai-research

# Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  mcp-node:
    build: ./services/mcp-node-research
    ports: ["3007:3007"]
    environment:
      NODE_ENV: production
  
  mcp-python:
    build: ./services/mcp-python-research
    ports: ["3008:3008"]
  
  mcp-go:
    build: ./services/mcp-go-research
    ports: ["3009:3009"]
  
  web-ui:
    build: ./services/web-ui
    ports: ["3011:3000"]
    depends_on:
      - mcp-node
      - mcp-python
      - mcp-go
EOF

# Build and start
docker-compose up -d

# Verify all services
docker-compose ps
```

---

### Step 5: Configure Nginx Routing

```nginx
# Add to /etc/nginx/sites-available/emr

upstream mcp_node { server localhost:3007; }
upstream mcp_python { server localhost:3008; }
upstream mcp_go { server localhost:3009; }
upstream research_ui { server localhost:3011; }

server {
    server_name 165.232.54.109;
    
    # Existing EMR location
    location / {
        proxy_pass http://localhost;  # Main web-ui
    }
    
    # New AI Research application
    location /ai-research/ {
        proxy_pass http://research_ui/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # API routes for MCP servers
    location /api/research/node/ {
        proxy_pass http://mcp_node/;
    }
    
    location /api/research/python/ {
        proxy_pass http://mcp_python/;
    }
    
    location /api/research/go/ {
        proxy_pass http://mcp_go/;
    }
}
```

```bash
# Reload Nginx
nginx -s reload
systemctl restart nginx
```

---

## Testing Checklist

### Production EMR
- [ ] `/predictions/ai` loads without errors
- [ ] 6 prediction tabs work (glucose, complications, medications, etc.)
- [ ] "Research" tab shows demo articles
- [ ] "Live Feed" button is disabled with tooltip
- [ ] Browser console has no errors

### AI Research Platform
- [ ] `http://165.232.54.109/ai-research/` loads
- [ ] Node.js server `/health` returns 200
- [ ] Python server `/health` returns 200
- [ ] Go server `/health` returns 200
- [ ] Dashboard shows all 3 servers status
- [ ] Can search each data source
- [ ] Results appear in comparison view
- [ ] Fallback data loads on API failures

---

## Rollback Plan

### If Production EMR Breaks

```bash
# Revert AIPredictions.jsx
cd /opt/emr
git revert <commit-hash>
npm run build
cp -r build/* /var/www/html/
systemctl restart nginx
```

### If Research App Breaks

```bash
# Stop services
docker-compose down

# Check logs
docker-compose logs -f

# Or restart individual service
docker-compose restart mcp-node
```

---

## Future Enhancements

1. **React Dashboard for AI Research**
   - Server status monitoring
   - Side-by-side result comparison
   - Performance metrics (latency, success rate)
   - Custom search queries

2. **Spring AI Integration** (Optional)
   - LLM-powered result synthesis
   - Cross-source knowledge aggregation
   - Recommendation generation

3. **Additional Data Sources**
   - IEEE Xplore (engineering papers)
   - ResearchGate (researcher profiles)
   - SSRN (social science)
   - Medical imaging archives

4. **Caching & Performance**
   - Redis integration
   - Query result caching
   - Response time optimization

5. **Monitoring & Observability**
   - Prometheus metrics
   - Request logging
   - Error rate tracking
   - Alert system

---

## Documentation Files

- **AI_RESEARCH_PLATFORMS.md** - Full technical specification
- **Deployment Guide** (this file) - Step-by-step deployment
- **README.md** (per service) - Language-specific guides

---

## Support & Troubleshooting

### Port Conflicts
```bash
# Check if ports are in use
lsof -i :3007
lsof -i :3008
lsof -i :3009

# Kill if necessary
kill -9 <PID>
```

### Docker Issues
```bash
# Rebuild from scratch
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### API Key Issues
```bash
# Check environment variables
docker-compose exec mcp-node env | grep API
docker-compose exec mcp-python env | grep API
```

### Nginx Routing
```bash
# Test config
nginx -t

# Check logs
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

---

**Deployment Date:** December 13, 2025
**Status:** Ready for deployment
**Estimated Time:** 30-45 minutes

