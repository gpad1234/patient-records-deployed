# Model Context Protocol (MCP) Servers

## Overview

This project implements **multi-language MCP servers** for healthcare research and patient data management. MCP (Model Context Protocol) enables AI agents to access external tools and data sources through a standardized interface.

## Available MCP Servers

### 🟢 1. Node.js MCP Server (Port 3007)
**Location**: `services/mcp-node-research/`

**Purpose**: Research paper discovery and web scraping
- PubMed medical research papers
- arXiv scientific preprints
- CrossRef academic publications
- Rate limiting and caching

**Technologies**:
- Express.js
- Axios (HTTP client)
- Cheerio (HTML parsing)
- node-cache (caching layer)

**Endpoints**:
- `GET /health` - Health check
- `POST /search/pubmed` - Search PubMed
- `POST /search/arxiv` - Search arXiv
- `POST /search/crossref` - Search CrossRef
- `GET /stats` - Server statistics

**Start Server**:
```bash
cd services/mcp-node-research
npm install
npm start
# Access: http://localhost:3007
```

---

### �� 2. Python MCP Server (Port 3008)
**Location**: `services/mcp-python-research/`

**Purpose**: Advanced research tools with Selenium and scholarly
- Google Scholar integration
- PDF metadata extraction
- JavaScript-heavy page scraping
- Academic citation analysis

**Technologies**:
- FastAPI
- BeautifulSoup4 (web scraping)
- Selenium (browser automation)
- scholarly (Google Scholar API)
- pdfplumber (PDF processing)

**Endpoints**:
- `GET /health` - Health check
- `POST /mcp/tools/search_sciencedirect` - Science Direct search
- `POST /mcp/tools/search_google_scholar` - Google Scholar
- `POST /mcp/tools/extract_pdf` - PDF metadata extraction
- `GET /mcp/tools` - List all available tools

**Start Server**:
```bash
cd services/mcp-python-research
pip3 install -r requirements.txt
python3 main.py
# Access: http://localhost:3008
```

---

### ☕ 3. Java MCP Server (Integrated)
**Location**: `services/java-service/src/main/java/com/healthcare/java/mcp/`

**Purpose**: WebScraper MCP with Virtual Threads (Java 25)
- High-performance concurrent web scraping
- Structured data extraction
- Virtual Thread-based architecture
- Healthcare-specific data sources

**Technologies**:
- Java 25 Virtual Threads
- Apache HttpClient5
- Gson (JSON parsing)
- Socket-based communication

**Key Features**:
- `WebScraperMCPServer` - Main server implementation
- Built-in tools for medical databases
- Concurrent request handling
- Type-safe JSON responses

**Start Server**:
```bash
cd services/java-service
mvn clean install
java -cp target/patient-records-java-service-1.0.0.jar:target/lib/* \
  com.healthcare.java.mcp.WebScraperMCPServer
```

---

## Starting All MCP Servers

### Automated Start (All 3):
```bash
cd /home/girish/emr-react/patient-records-deployed
./scripts/start-ai-research.sh
```

This script will:
1. Start Node.js MCP on port 3007
2. Start Python MCP on port 3008
3. Attempt to start Go MCP on port 3009 (if available)

### View Logs:
```bash
tail -f /tmp/mcp-node-research.log
tail -f /tmp/mcp-python-research.log
tail -f /tmp/mcp-go-research.log
```

### Stop All Servers:
```bash
./scripts/stop-ai-research.sh
```

---

## MCP Server Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    AI Agent / Client                         │
└───────────────┬─────────────────────────────────────────────┘
                │
                │ MCP Protocol (HTTP/JSON)
                │
        ┌───────┴────────┬──────────────┬──────────────┐
        │                │              │              │
        ▼                ▼              ▼              │
┌───────────────┐ ┌──────────────┐ ┌────────────┐    │
│  Node.js MCP  │ │  Python MCP  │ │  Java MCP  │    │
│   Port 3007   │ │  Port 3008   │ │ Integrated │    │
└───────┬───────┘ └──────┬───────┘ └─────┬──────┘    │
        │                │               │            │
        └────────────────┴───────────────┴────────────┘
                         │
                         ▼
            ┌────────────────────────┐
            │   External Sources     │
            ├────────────────────────┤
            │ • PubMed               │
            │ • arXiv                │
            │ • Google Scholar       │
            │ • CrossRef             │
            │ • ScienceDirect        │
            │ • Medical Databases    │
            └────────────────────────┘
```

---

## MCP Tool Catalog

### Node.js Tools:
| Tool Name         | Description                    | Rate Limit |
|-------------------|--------------------------------|------------|
| search_pubmed     | Medical research papers        | 3/sec      |
| search_arxiv      | Scientific preprints           | 3/sec      |
| search_crossref   | Academic publications          | 3/sec      |
| get_paper_details | Fetch full paper metadata      | 3/sec      |

### Python Tools:
| Tool Name               | Description                  | Requires    |
|-------------------------|------------------------------|-------------|
| search_sciencedirect    | Science Direct papers        | BeautifulSoup |
| search_google_scholar   | Google Scholar integration   | scholarly   |
| extract_pdf_metadata    | PDF text & metadata          | pdfplumber  |
| scrape_javascript_page  | Dynamic content scraping     | Selenium    |

### Java Tools:
| Tool Name           | Description                    | Technology     |
|---------------------|--------------------------------|----------------|
| webscraper_search   | Generic web scraping           | Virtual Threads|
| medical_db_query    | Healthcare database access     | HttpClient5    |
| structured_extract  | Structured data extraction     | Gson           |

---

## Testing MCP Servers

### Test Node.js MCP:
```bash
curl http://localhost:3007/health

# Search PubMed
curl -X POST http://localhost:3007/search/pubmed \
  -H "Content-Type: application/json" \
  -d '{"query": "diabetes treatment", "limit": 10}'
```

### Test Python MCP:
```bash
curl http://localhost:3008/health

# Search Google Scholar
curl -X POST http://localhost:3008/mcp/tools/search_google_scholar \
  -H "Content-Type: application/json" \
  -d '{"query": "machine learning healthcare"}'
```

### Test Java MCP:
```bash
# Java MCP uses Socket protocol on port 9999
cd services/java-service
./client.sh localhost 9999
# Type: HELP to see MCP commands
```

---

## Configuration

### Node.js MCP (`services/mcp-node-research/.env`):
```env
PORT=3007
CACHE_TTL=600
MAX_CONCURRENT_REQUESTS=3
LOG_LEVEL=info
```

### Python MCP (`services/mcp-python-research/.env`):
```env
PORT=3008
DEBUG=False
SELENIUM_HEADLESS=True
SCHOLARLY_TIMEOUT=30
```

### Java MCP (Application Properties):
```properties
server.port=9999
mcp.threads=virtual
mcp.timeout=10000
```

---

## Development

### Add New MCP Tool (Node.js):
```javascript
// services/mcp-node-research/server.js
app.post('/search/new_source', async (req, res) => {
  const { query } = req.body;
  // Implement search logic
  const results = await searchNewSource(query);
  res.json({ results });
});
```

### Add New MCP Tool (Python):
```python
# services/mcp-python-research/main.py
@app.post("/mcp/tools/new_tool")
async def new_tool(request: SearchRequest):
    # Implement tool logic
    results = await search_new_source(request.query)
    return SearchResult(papers=results)
```

### Add New MCP Tool (Java):
```java
// services/java-service/src/main/java/com/healthcare/java/mcp/
public class NewMCPTool implements MCPTool {
    @Override
    public String execute(String params) {
        // Implement tool logic
        return jsonResponse;
    }
}
```

---

## Troubleshooting

### Node.js MCP won't start:
```bash
# Check port
lsof -i :3007
# Kill existing process
kill $(lsof -t -i:3007)
# Check logs
cat /tmp/mcp-node-research.log
```

### Python MCP dependency issues:
```bash
cd services/mcp-python-research
python3 -m pip install --upgrade -r requirements.txt
# For Selenium
sudo apt-get install chromium-chromedriver  # Linux
brew install chromedriver                    # macOS
```

### Java MCP memory issues:
```bash
# Increase heap size
export MAVEN_OPTS="-Xmx2g"
mvn clean install
```

---

## Performance Metrics

| Server   | Avg Response | Concurrent | Memory |
|----------|-------------|-----------|---------|
| Node.js  | ~200ms      | 3 req/s   | 150MB   |
| Python   | ~500ms      | 2 req/s   | 300MB   |
| Java     | ~100ms      | 50+ req/s | 200MB   |

---

## Security Considerations

1. **Rate Limiting**: All servers implement rate limiting
2. **Input Validation**: JSON schema validation on all endpoints
3. **CORS**: Configured for local development
4. **API Keys**: Store in `.env` files (not committed)
5. **Timeouts**: All external requests have 10s timeout

---

## Related Documentation

- [WebScraper MCP Guide](WEBSCRAPER_MCP_GUIDE.md)
- [Future MCP & Agentic AI](FUTURE_DIRECTION_MCP_AGENTIC_AI.md)
- [Python Service README](services/python-service/README.md)
- [Java Service README](services/java-service/README.md)

---

## Quick Reference

**Start all MCP servers:**
```bash
./scripts/start-ai-research.sh
```

**Test all endpoints:**
```bash
curl http://localhost:3007/health  # Node.js
curl http://localhost:3008/health  # Python
echo "HELP" | nc localhost 9999    # Java Socket
```

**Stop all servers:**
```bash
./scripts/stop-ai-research.sh
```

**View all logs:**
```bash
tail -f /tmp/mcp-*.log
```
