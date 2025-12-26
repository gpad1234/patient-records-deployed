# AI Research Platforms - Multi-Language MCP Servers

## Project Overview

A dedicated research application focusing on **web scraping techniques** using comparable open-source MCP servers implemented in multiple languages and frameworks. This separate from the production EMR.

**URL (when deployed):** `http://165.232.54.109/ai-research/`

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│           React Web UI (/ai-research/)                       │
│   - MCP Server Dashboard                                    │
│   - Multi-source Research Integration                       │
│   - Web Scraping Technique Comparison                       │
│   - Performance & Reliability Metrics                       │
└─────────────────────────────────────────────────────────────┘
                           ↓
        ┌──────────────────┼──────────────────┐
        ↓                  ↓                  ↓
   ┌────────────┐   ┌─────────────┐   ┌─────────────┐
   │ Node.js    │   │ Python      │   │ Go          │
   │ Express    │   │ FastAPI     │   │ Gin         │
   │ MCP        │   │ MCP         │   │ MCP         │
   │ Server     │   │ Server      │   │ Server      │
   │ (3007)     │   │ (3008)      │   │ (3009)      │
   └────────────┘   └─────────────┘   └─────────────┘
        ↓                  ↓                  ↓
   PubMed/arXiv    ScienceDirect/     CrossRef/
   APIs            Google Scholar      OpenAlex
```

---

## Language-Specific Implementations

### 1. Node.js Implementation (Port 3007)

**Framework:** Express + MCP SDK
**Strengths:** JavaScript ecosystem, rapid development, great async support

```javascript
// File: services/mcp-node-research/server.js

const express = require('express');
const { MCPServer } = require('@anthropic-ai/sdk');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const mcp = new MCPServer();

// MCP Tools
mcp.tool('search_pubmed', {
  description: 'Search PubMed API for medical research papers',
  inputSchema: {
    type: 'object',
    properties: {
      query: { type: 'string' },
      max_results: { type: 'number', default: 20 }
    },
    required: ['query']
  },
  handler: async (query, max_results) => {
    // Implementation using REST API
  }
});

mcp.tool('scrape_arxiv_metadata', {
  description: 'Scrape arXiv for AI/ML papers',
  inputSchema: {
    type: 'object',
    properties: {
      category: { type: 'string', default: 'cs.AI' },
      max_results: { type: 'number', default: 20 }
    }
  },
  handler: async (category, max_results) => {
    // Implementation using Cheerio
  }
});

app.post('/mcp/tools', (req, res) => {
  // MCP protocol handler
});

app.listen(3007);
```

**Key Libraries:**
- `@anthropic-ai/sdk` - MCP protocol
- `axios` - HTTP requests
- `cheerio` - DOM parsing
- `pqueue` - Rate limiting

---

### 2. Python Implementation (Port 3008)

**Framework:** FastAPI + MCP Protocol
**Strengths:** Data science libraries, excellent async, clean syntax

```python
# File: services/mcp-python-research/main.py

from fastapi import FastAPI
from mcp import Server, Tool
from mcp.types import TextContent
import httpx
from bs4 import BeautifulSoup
from scholarly import scholarly
import asyncio

app = FastAPI()
mcp_server = Server("ai-research-python")

@mcp_server.tool()
async def search_sciencedirect(query: str, max_results: int = 20) -> TextContent:
    """
    Search ScienceDirect using Selenium + BeautifulSoup
    Slower but more comprehensive results
    """
    # Implementation with Selenium for JavaScript-heavy pages
    pass

@mcp_server.tool()
async def search_google_scholar(query: str, max_results: int = 20) -> TextContent:
    """
    Search Google Scholar via scholarly library
    Free access without API keys
    """
    async for pub in scholarly.search_pubs(query):
        # Process publication
        pass

@mcp_server.tool()
async def extract_pdf_metadata(pdf_url: str) -> TextContent:
    """
    Extract text and metadata from PDF
    Using PyPDF2 and pdfplumber
    """
    pass

@app.post("/mcp/tools")
async def mcp_handler(request):
    # MCP protocol handler
    pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3008)
```

**Key Libraries:**
- `fastapi` - Web framework
- `beautifulsoup4` - HTML parsing
- `selenium` - Browser automation
- `scholarly` - Google Scholar access
- `httpx` - Async HTTP
- `pdfplumber` - PDF text extraction

---

### 3. Go Implementation (Port 3009)

**Framework:** Gin + MCP Protocol
**Strengths:** High performance, built-in concurrency, single binary deployment

```go
// File: services/mcp-go-research/main.go

package main

import (
	"github.com/gin-gonic/gin"
	"github.com/colly/colly"
	"github.com/PuerkitoBio/goquery"
	"net/http"
	"sync"
)

type MCPServer struct {
	router *gin.Engine
	tools  map[string]Tool
	mu     sync.RWMutex
}

func NewMCPServer() *MCPServer {
	return &MCPServer{
		router: gin.Default(),
		tools:  make(map[string]Tool),
	}
}

// Tool: Search CrossRef API for academic metadata
func (s *MCPServer) SearchCrossRef(query string, maxResults int) interface{} {
	// Implementation using native Go HTTP
	// Direct API call without wrappers - blazing fast
	return nil
}

// Tool: Scrape OpenAlex for researcher profiles
func (s *MCPServer) ScrapeOpenAlex(author string, maxResults int) interface{} {
	// Implementation using Colly scraper
	collector := colly.NewCollector()
	
	collector.OnRequest(func(_ *colly.Request) {
		// Pre-request setup
	})
	
	collector.OnError(func(_ *colly.Request, err error) {
		// Error handling with retries
	})
	
	return nil
}

// Tool: Parallel search multiple sources
func (s *MCPServer) ParallelSearch(query string) interface{} {
	// Leverage Go goroutines for concurrent searches
	var wg sync.WaitGroup
	results := make(chan interface{})
	
	// Concurrently hit 5 different sources
	return nil
}

func (s *MCPServer) Start(port string) {
	s.router.POST("/mcp/tools", s.handleMCPCall)
	s.router.GET("/health", s.health)
	s.router.Run(":" + port)
}

func main() {
	server := NewMCPServer()
	server.Start("3009")
}
```

**Key Libraries:**
- `gin-gonic/gin` - Web framework
- `colly/colly` - Web scraping
- `PuerkitoBio/goquery` - HTML parsing
- Standard `net/http` - No external HTTP deps needed

---

### 4. Spring AI (Java) Enhancement (Port 3010)

**Framework:** Spring Boot 3.x + Spring AI
**Strengths:** Enterprise features, type safety, existing integration

```java
// File: services/mcp-spring-research/src/main/java/com/research/MCP.java

package com.research.mcp;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.web.bind.annotation.*;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import io.github.resilience4j.retry.annotation.Retry;

@RestController
@RequestMapping("/api/research")
public class ResearchMCPController {

    private final ChatClient chatClient;
    private final ResearchService researchService;

    public ResearchMCPController(ChatClient chatClient, ResearchService researchService) {
        this.chatClient = chatClient;
        this.researchService = researchService;
    }

    @PostMapping("/tools/search_pubmed")
    @Retry(name = "pubmedApi")
    public MCPToolResult searchPubMed(
        @RequestParam String query,
        @RequestParam(defaultValue = "20") int maxResults) {
        
        // Integrated with Spring AI for LLM-powered result synthesis
        String synthesis = chatClient.prompt()
            .user("Summarize key findings from these medical papers: " + query)
            .call()
            .content();
            
        return new MCPToolResult(synthesis);
    }

    @PostMapping("/tools/scrape_with_ai")
    public MCPToolResult scrapeWithAI(@RequestParam String url) {
        // Scrape + AI analysis in one call
        Document doc = Jsoup.connect(url).get();
        String content = doc.body().text();
        
        String analysis = chatClient.prompt()
            .user("Analyze and extract key research findings from: " + content)
            .call()
            .content();
            
        return new MCPToolResult(analysis);
    }

    @GetMapping("/tools")
    public List<MCPTool> listTools() {
        // Return all available MCP tools
        return researchService.getAvailableTools();
    }
}
```

**Key Libraries:**
- `spring-ai-core` - AI capabilities
- `jsoup` - HTML parsing
- `resilience4j` - Fault tolerance
- `webflux` - Async/reactive

---

## Web Scraping Techniques by Language

| Technique | Node.js | Python | Go | Spring AI |
|-----------|---------|--------|----|-----------| 
| **REST API** | axios | httpx, requests | net/http | RestTemplate |
| **HTML Parsing** | cheerio | BeautifulSoup | goquery | jsoup |
| **JavaScript Rendering** | puppeteer | selenium, playwright | chromedp | Selenium |
| **Rate Limiting** | pqueue | tenacity | time.Ticker | Resilience4j |
| **Caching** | redis | redis-py | go-cache | Spring Cache |
| **Error Handling** | try/catch | exception handling | defer | @Retry |
| **Concurrency** | Promise.all | asyncio | goroutines | Flux/Mono |

---

## Data Sources & APIs

### Public APIs (No Authentication)
- **PubMed** - Free REST API (ncbi.nlm.nih.gov)
- **arXiv** - Free XML/JSON API (arxiv.org)
- **CrossRef** - Free metadata API (crossref.org)
- **OpenAlex** - Free research metadata (openalex.org)

### Scraped Sources (with fallback)
- **Google Scholar** - scholarly library (Python)
- **ScienceDirect** - Selenium-based (Python)
- **ResearchGate** - Cheerio-based (Node.js)

### Rate Limits & Strategies
```
PubMed:        3 req/sec (with backoff)
arXiv:         1 req/sec
CrossRef:      50 req/sec
OpenAlex:      100 req/sec (free tier)
Google Scholar: 1 req/sec (via scholarly)
```

---

## Directory Structure

```
/ai-research/
├── services/
│   ├── mcp-node-research/          # Node.js MCP Server
│   │   ├── server.js
│   │   ├── tools/
│   │   │   ├── pubmed.js
│   │   │   ├── arxiv.js
│   │   │   └── cache.js
│   │   ├── package.json
│   │   └── Dockerfile
│   │
│   ├── mcp-python-research/        # Python MCP Server
│   │   ├── main.py
│   │   ├── tools/
│   │   │   ├── sciencedirect.py
│   │   │   ├── scholar.py
│   │   │   └── pdf_extract.py
│   │   ├── requirements.txt
│   │   └── Dockerfile
│   │
│   ├── mcp-go-research/            # Go MCP Server
│   │   ├── main.go
│   │   ├── tools/
│   │   │   ├── crossref.go
│   │   │   ├── openalex.go
│   │   │   └── parallel.go
│   │   ├── go.mod
│   │   └── Dockerfile
│   │
│   ├── mcp-spring-research/        # Spring AI Server
│   │   ├── src/main/java/
│   │   │   └── com/research/
│   │   ├── pom.xml
│   │   └── Dockerfile
│   │
│   └── web-ui/                     # React Dashboard
│       ├── src/components/
│       │   ├── MCPServerDashboard.jsx
│       │   ├── ResearchComparison.jsx
│       │   └── PerformanceMetrics.jsx
│       ├── package.json
│       └── Dockerfile
│
├── docker-compose.yml
├── Nginx.conf
└── README.md
```

---

## React UI Components

### MCPServerDashboard.jsx
```jsx
// Display status of all 4 MCP servers
// Show real-time metrics:
// - Request latency
// - Success rate
// - Sources queried
// - Cached vs live data
// - Error distribution
```

### ResearchComparison.jsx
```jsx
// Compare results from same query across:
// - Node.js (Cheerio)
// - Python (BeautifulSoup + Selenium)
// - Go (Colly)
// - Spring AI (jsoup + LLM)
// 
// Show:
// - Result count per source
// - Quality metrics
// - Query time per implementation
// - UI responsiveness per language
```

### PerformanceMetrics.jsx
```jsx
// Dashboard showing:
// - Throughput (requests/sec per language)
// - Latency (p50, p95, p99)
// - Memory usage
// - CPU usage
// - Cache hit rate
// - Source reliability scorecard
```

---

## Deployment Architecture

### Docker Compose (Development)
```yaml
version: '3.8'

services:
  mcp-node:
    build: ./services/mcp-node-research
    ports:
      - "3007:3007"
    environment:
      - PUBMED_MAX_RETRIES=3
      - ARXIV_TIMEOUT=10000
      - CACHE_TTL=3600

  mcp-python:
    build: ./services/mcp-python-research
    ports:
      - "3008:3008"
    environment:
      - SCHOLAR_TIMEOUT=15
      - SELENIUM_HEADLESS=true

  mcp-go:
    build: ./services/mcp-go-research
    ports:
      - "3009:3009"
    environment:
      - MAX_GOROUTINES=100
      - CACHE_SIZE=1000

  mcp-spring:
    build: ./services/mcp-spring-research
    ports:
      - "3010:3010"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - SPRING_PROFILES_ACTIVE=production

  web-ui:
    build: ./services/web-ui
    ports:
      - "3011:3000"
    depends_on:
      - mcp-node
      - mcp-python
      - mcp-go
      - mcp-spring

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
```

### Nginx Routing (Production)
```nginx
upstream mcp_node { server localhost:3007; }
upstream mcp_python { server localhost:3008; }
upstream mcp_go { server localhost:3009; }
upstream mcp_spring { server localhost:3010; }
upstream research_ui { server localhost:3011; }

server {
    server_name 165.232.54.109;
    
    location /ai-research/ {
        proxy_pass http://research_ui/;
    }
    
    location /api/research/node/ {
        proxy_pass http://mcp_node/;
    }
    
    location /api/research/python/ {
        proxy_pass http://mcp_python/;
    }
    
    location /api/research/go/ {
        proxy_pass http://mcp_go/;
    }
    
    location /api/research/spring/ {
        proxy_pass http://mcp_spring/;
    }
}
```

---

## Success Metrics

### Technical Metrics
- **Throughput:** Requests/sec per language
- **Latency:** Response time p95, p99
- **Reliability:** % uptime per MCP server
- **Cache Efficiency:** Hit rate by source

### Research Metrics
- **Result Quality:** Unique papers found per source
- **Scraping Success:** % successful requests
- **API Coverage:** Sources successfully queried
- **Fallback Activation:** % API failures vs cached data

### Educational Value
- **Code Comparison:** Feature parity across languages
- **Framework Lessons:** MCP protocol understanding
- **Web Scraping Techniques:** Best practices per language
- **Performance Trade-offs:** Speed vs. features

---

## Implementation Timeline

**Phase 1 (Week 1-2):** Node.js & Python implementations
**Phase 2 (Week 3):** Go implementation  
**Phase 3 (Week 4):** Spring AI integration
**Phase 4 (Week 5):** React dashboard
**Phase 5 (Week 6):** Production deployment

---

## Research Questions This Answers

1. **Which language is best for web scraping MCP servers?**
   - Go: Fastest, lowest memory
   - Node.js: Easiest development
   - Python: Most libraries
   - Spring: Best for enterprise

2. **How to handle API rate limits?**
   - Per-language strategies
   - Queue-based backoff
   - Circuit breaker patterns
   - Cache fallback systems

3. **What makes a robust MCP server?**
   - Error handling
   - Retry logic
   - Monitoring/observability
   - Graceful degradation

4. **How to compare MCP frameworks?**
   - Side-by-side dashboard
   - Same data sources
   - Same queries
   - Real performance metrics

---

## References

- [MCP Protocol Spec](https://modelcontextprotocol.io/)
- [Spring AI Docs](https://docs.spring.io/spring-ai/docs/)
- [Go Web Scraping Guide](https://pkg.go.dev/github.com/colly/colly)
- [Python BeautifulSoup](https://www.crummy.com/software/BeautifulSoup/)
- [Node.js Cheerio](https://cheerio.js.org/)

---

**Status:** Planning & Design Phase
**Created:** December 13, 2025
**Next Step:** Begin Node.js & Python implementation
