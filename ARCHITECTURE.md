# EMR + AI Research Platform Architecture

## Overview

This is a **multi-tier, polyglot architecture** using:
- **Nginx** as the reverse proxy & static file server
- **Node.js** services (Express.js) for the API and Node-based MCP research server
- **Python** services (FastAPI) for ML/data science and Python-based MCP research server  
- **Go** service (Gin framework) for high-performance concurrent research server
- **React.js** frontend compiled to static assets

---

## Component Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT BROWSERS                               │
│                    (Web, Mobile, API Clients)                           │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 │ HTTP/HTTPS (Port 80)
                                 ▼
        ┌────────────────────────────────────────────────────┐
        │                  NGINX (Port 80)                    │
        │          Reverse Proxy + Static File Server         │
        │                                                      │
        │  • Routes /api/* → Node.js API (Port 3001)          │
        │  • Routes /ai-research.html → Static HTML           │
        │  • Routes /static/* → React.js Assets               │
        │  • Routes /* → React.js (SPA catch-all)             │
        │  • Gzip compression enabled                         │
        │  • 30-day caching for static assets                 │
        └────────────┬──────────────┬────────────────┬────────┘
                     │              │                │
                     ▼              ▼                ▼
        ┌──────────────────┐  ┌──────────────┐  ┌────────────────┐
        │  Node.js API     │  │  React.js    │  │ AI Research    │
        │  (Port 3001)     │  │  Static      │  │ Dashboard HTML │
        │                  │  │  Assets      │  │                │
        │ Express.js       │  │              │  │ (Static File)  │
        │ SQLite Patient   │  │ /static/     │  │                │
        │ Database         │  │ /index.html  │  │ Links to:      │
        │                  │  │              │  │ • Port 3007    │
        │ Endpoints:       │  │              │  │ • Port 3008    │
        │ /api/patients    │  │              │  │ • Port 3009    │
        │ /api/diagnoses   │  │              │  │                │
        │ /api/stats       │  │              │  │ (Browser makes │
        └──────────────────┘  └──────────────┘  │  direct calls  │
                                                 │  to ports)     │
                                                 └────────────────┘
                                                         │
                     ┌───────────────────────────────────┼────────────────────┐
                     │                                   │                    │
                     ▼                                   ▼                    ▼
        ┌──────────────────────┐      ┌──────────────────────┐  ┌──────────────────────┐
        │ MCP Node.js Server   │      │  MCP Python Server   │  │  MCP Go Server       │
        │     (Port 3007)      │      │    (Port 3008)       │  │   (Port 3009)        │
        │                      │      │                      │  │                      │
        │ Framework: Express   │      │ Framework: FastAPI   │  │ Framework: Gin       │
        │ Language Runtime: JS │      │ Language Runtime: Py │  │ Language Runtime: Go │
        │                      │      │                      │  │                      │
        │ Research Tools:      │      │ Research Tools:      │  │ Research Tools:      │
        │ • search_pubmed      │      │ • search_google_sch. │  │ • search_crossref    │
        │ • search_arxiv       │      │ • search_scidirect   │  │ • search_doaj        │
        │ • search_crossref    │      │ • extract_pdf        │  │ • parallel_search    │
        │                      │      │                      │  │                      │
        │ Features:            │      │ Features:            │  │ Features:            │
        │ • NodeCache (10min)  │      │ • Async/await        │  │ • Goroutines for     │
        │ • Concurrency limit  │      │ • 3sec timeout       │  │   parallel requests  │
        │ • Fallback data      │      │ • Fallback data      │  │ • In-memory cache    │
        │ • CORS enabled       │      │ • CORS enabled       │  │ • Fallback data      │
        │ • Health check /     │      │ • Health check /     │  │ • CORS enabled       │
        │   health endpoint    │      │   health endpoint    │  │ • Health check /     │
        │                      │      │                      │  │   health endpoint    │
        └──────────────────────┘      └──────────────────────┘  └──────────────────────┘
              │                              │                         │
              │ HTTP calls                   │ HTTP calls              │ HTTP calls
              │ JSON request/response        │ JSON request/response   │ JSON request/response
              ▼                              ▼                        ▼
        ┌──────────────┐              ┌──────────────┐          ┌──────────────┐
        │ PubMed API   │              │ Google       │          │ CrossRef API │
        │ arXiv API    │              │ Scholar      │          │ DOAJ API     │
        │ CrossRef API │              │ ScienceDirect│          │              │
        │              │              │ PDF sources  │          │              │
        └──────────────┘              └──────────────┘          └──────────────┘
```

---

## Web Server/Service Technologies

| Service | Type | Framework | Language | Port | Purpose |
|---------|------|-----------|----------|------|---------|
| **Nginx** | Reverse Proxy | Native | C | **80** | Public entry point, routing, static files, compression |
| **Node.js API** | Web Service | Express.js | JavaScript | **3001** | Patient database API, EMR backend |
| **Node.js MCP** | Research API | Express.js | JavaScript | **3007** | PubMed/arXiv/CrossRef search service |
| **Python MCP** | Research API | FastAPI | Python | **3008** | Google Scholar/ScienceDirect search service |
| **Go MCP** | Research API | Gin | Go | **3009** | CrossRef/DOAJ search service (high-performance) |
| **React.js** | Frontend | React | TypeScript/JSX | - | Compiled to static assets, served by Nginx |
| ~~**node-service**~~ | ~~Legacy~~ | ~~Express~~ | ~~JavaScript~~ | ~~**3000**~~ | ~~Legacy WebScraper MCP (DEPRECATED)~~ |

**Total: 5 active web service/server types** (1 deprecated)

---

## Port Mapping & Traffic Flow

### Public Interface (Port 80 via Nginx)
```
GET  http://165.232.54.109/
  └─> Route: / (try_files $uri /index.html)
      └─> Serve: React.js SPA from /opt/emr/services/web-ui/build/index.html

GET  http://165.232.54.109/api/patients
  └─> Route: /api/*
      └─> Proxy to: http://127.0.0.1:3001/api/patients
          └─> Handled by: Node.js Express API

GET  http://165.232.54.109/ai-research.html
  └─> Route: /ai-research.html (alias)
      └─> Serve: Static file from /opt/emr/services/web-ui/build/ai-research.html

GET  http://165.232.54.109/static/js/main.xyz.js
  └─> Route: /static/* (expires 30 days)
      └─> Serve: React.js compiled assets
```

### Deprecated/Legacy Ports (Not Used)
```
Port 3000: Legacy node-service (WebScraperMCP)
  Status: RUNNING but UNUSED
  Location: /opt/emr/services/node-service/
  Note: Superseded by newer MCP implementations on ports 3007, 3008, 3009
  Action: Should be stopped to free resources (52MB memory)
```

### Private/Direct Access (From Browser via Dashboard)
```
POST http://165.232.54.109:3007/mcp/tools/search_pubmed
  ↑
  └─> Directly accessed by browser (dashboard JavaScript)
      Handled by: Node.js Express MCP Server

POST http://165.232.54.109:3008/mcp/tools/search_google_scholar
  ↑
  └─> Directly accessed by browser (dashboard JavaScript)
      Handled by: Python FastAPI MCP Server

POST http://165.232.54.109:3009/mcp/tools/search_crossref
  ↑
  └─> Directly accessed by browser (dashboard JavaScript)
      Handled by: Go Gin MCP Server
```

---

## Data Flow Examples

### Example 1: Patient Data Retrieval (via Nginx proxy)
```
Browser → GET /api/patients
   ↓
Nginx (port 80)
   ↓ proxy_pass http://127.0.0.1:3001
   ↓
Node.js Express API (port 3001)
   ↓ queries database
   ↓
SQLite (/opt/emr/services/node-api/diabetes.db)
   ↓ returns JSON
   ↓
Nginx (returns to browser)
   ↓
Browser (renders in React UI)
```

### Example 2: Research Paper Search (direct browser call)
```
React Dashboard (browser)
   ↓ POST http://165.232.54.109:3008/mcp/tools/search_google_scholar
   ↓
Python FastAPI (port 3008)
   ↓ queries external API
   ↓
Google Scholar / ScienceDirect APIs
   ↓ returns JSON
   ↓
Python FastAPI (returns to browser)
   ↓
Browser (renders results in dashboard)
```

---

## Deployment Structure

```
Production Server: 165.232.54.109

/opt/emr/services/
├── web-ui/build/                    (React.js compiled)
│   ├── index.html
│   ├── ai-research.html
│   └── static/js/, static/css/, etc.
├── node-api/                        (Node.js API - Port 3001)
│   ├── src/server.js
│   └── diabetes.db
└── node-service/                    (Legacy Node service - Port 3000)

/opt/ai-research/services/
├── mcp-node-research/               (Node.js MCP - Port 3007)
│   ├── server.js
│   └── node.log
├── mcp-python-research/             (Python MCP - Port 3008)
│   ├── main.py
│   ├── venv/
│   └── python.log
└── mcp-go-research/                 (Go MCP - Port 3009)
    ├── mcp-go-research (binary)
    └── go.log

/etc/nginx/sites-available/
└── emr                              (Nginx configuration)
```

---

## Key Architectural Decisions

### 1. **Polyglot Approach**
- **Node.js**: Fast async I/O, easy prototyping, JavaScript ecosystem
- **Python**: Data science libraries, ML-friendly, quick iteration
- **Go**: High-performance concurrency, compiled binary, goroutines for parallel work

### 2. **Nginx as Reverse Proxy**
- Single public entry point (port 80)
- Hides internal port complexity
- Enables load balancing, compression, caching
- Static file serving with long-term caching

### 3. **MCP Servers on Direct Ports**
- Browser calls research servers directly (not through Nginx)
- Avoids proxy overhead for real-time search operations
- Each server can scale independently
- CORS headers enable browser access

### 4. **Fallback & Resilience**
- All MCP servers include fallback data (when APIs blocked/timeout)
- Timeout protection (Node: implicit, Python: 3sec, Go: 8sec)
- Health check endpoints for monitoring
- Graceful degradation if external APIs unavailable

### 5. **Caching Strategies**
- **Static assets**: 30-day cache (React.js files)
- **Research results**: 10-minute in-memory cache (all MCP servers)
- **Database**: No caching (always fresh patient data)

---

## Why Multiple Web Server Types?

| Requirement | Node.js | Python | Go | Nginx |
|-------------|---------|--------|----|----|
| Easy async I/O | ✅ | ✅ | ✅ | N/A |
| ML/Data Science libs | ❌ | ✅ | ❌ | N/A |
| Parallel requests (goroutines) | ❌ | ❌ | ✅ | N/A |
| High throughput static files | ❌ | ❌ | ❌ | ✅ |
| Reverse proxy | ❌ | ❌ | ❌ | ✅ |
| Gzip compression | ✅ | ✅ | ✅ | ✅ |

**Result**: Each tool is purpose-built for its domain, creating optimal performance across the platform.

---

## Performance Characteristics

### Response Times (Production)
- **Nginx static serve**: ~2-5ms
- **Node.js API (patient data)**: ~10-50ms
- **Node.js MCP (PubMed search)**: ~200-400ms (external API dependent)
- **Python MCP (Scholar search)**: ~3-8s (includes timeout/fallback)
- **Go MCP (CrossRef search)**: ~300-500ms (external API dependent)

### Resource Usage (Typical)
- **Nginx**: ~5-10 MB
- **Node.js (API)**: ~40-50 MB
- **Node.js (MCP)**: ~49 MB
- **Python (MCP)**: ~100 MB
- **Go (MCP)**: ~13 MB (compiled binary, very efficient)

### Concurrency Model
- **Nginx**: Event-driven (can handle thousands of concurrent connections)
- **Node.js**: Single-threaded event loop with async/await
- **Python**: Single-threaded with async/await (FastAPI)
- **Go**: Native goroutines (thousands can run concurrently)

---

## Network Diagram (By Layer)

```
OSI Layer 7 (Application):
├── HTTP/HTTPS (REST, JSON)
│   ├── React SPA (GET /*, /static/*, /api/*)
│   ├── MCP Dashboards (POST to :3007, :3008, :3009)
│   └── Patient API (GET /api/*)

OSI Layer 4 (Transport):
├── TCP Port 80   → Nginx
├── TCP Port 3001 → Node.js API
├── TCP Port 3007 → Node.js MCP
├── TCP Port 3008 → Python MCP
└── TCP Port 3009 → Go MCP

OSI Layer 3 (Network):
├── Public IP: 165.232.54.109
├── Private loopback: 127.0.0.1
└── IPv6 support (Nginx, Go server use IPv6)
```

---

## Monitoring & Health Checks

All MCP servers expose health endpoints:
```bash
# Node.js MCP
curl http://165.232.54.109:3007/health
{"status":"healthy","uptime":"2025-12-14T..."}

# Python MCP  
curl http://165.232.54.109:3008/health
{"status":"healthy","uptime":"2025-12-14T..."}

# Go MCP
curl http://165.232.54.109:3009/health
{"status":"healthy","service":"MCP Go Research Server",...}
```

---

## Future Scaling Considerations

### Horizontal Scaling
- Use Docker containers for each service
- Deploy multiple instances behind load balancer
- Use message queue (Redis/RabbitMQ) for inter-service communication

### Vertical Scaling
- Go server is already optimized for multi-core
- Python can use `uvicorn` with multiple workers
- Node.js can use PM2 cluster mode

### Caching Layer
- Redis for distributed caching (research results)
- CDN for static assets (React.js files)

### Database Optimization
- Current SQLite is file-based, fine for dev
- PostgreSQL recommended for production at scale

---

## Tech Stack Summary

| Component | Technology | Version | Status |
|-----------|-----------|---------|--------|
| Reverse Proxy | Nginx | 1.18+ | ✅ Production |
| API Server | Node.js + Express | 16+/4.18+ | ✅ Production |
| Frontend | React.js | 18+ | ✅ Production |
| Research (Fast) | Node.js + Express | 16+/4.18+ | ✅ Production |
| Research (ML) | Python + FastAPI | 3.9+/0.95+ | ✅ Production |
| Research (Concurrent) | Go + Gin | 1.21+/1.9+ | ✅ Production |
| Database | SQLite | 3.x | ✅ Development |
