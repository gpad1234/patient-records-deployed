# Phase 1: Mixed Architecture Setup

## Overview

This phase establishes a multi-service architecture combining Java, Python, and Node.js to build a comprehensive healthcare AI agent system. Each service handles specific responsibilities through the Model Context Protocol (MCP).

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│         Client Applications                                  │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────▼────────────┐
        │  Node.js API Gateway    │ (Port 3000)
        │  - Request routing      │
        │  - Service orchestration│
        │  - Authentication       │
        └────────────┬────────────┘
                     │
        ┌────────────┴─────────────────────┐
        │                                  │
   ┌────▼──────────┐         ┌────────────▼────┐
   │ Java Service  │         │ Python Service  │
   │ (Port 8080)   │         │ (Port 5000)     │
   │               │         │                 │
   │ - Patient     │         │ - Clinical      │
   │   Data MCP    │         │   Protocols MCP │
   │ - Insurance   │         │ - Lab Results   │
   │   MCP         │         │   MCP           │
   └────┬──────────┘         └────────┬────────┘
        │                            │
        └────────────┬───────────────┘
                     │
            ┌────────▼──────────┐
            │  PostgreSQL DB    │ (Port 5432)
            │                   │
            │ - Patient Records │
            │ - Clinical Data   │
            │ - Lab Results     │
            └───────────────────┘
```

## Service Responsibilities

### 1. Node.js Service (API Gateway)
- **Purpose**: Central API gateway and service orchestrator
- **Port**: 3000
- **Responsibilities**:
  - HTTP request routing
  - Service health monitoring
  - Request/response aggregation
  - Authentication & authorization
  - API documentation
- **Key Endpoints**:
  - `GET /health` - Service health check
  - `GET /info` - Service information
  - `GET /services/health` - Downstream services health

### 2. Java Service (MCP Servers)
- **Purpose**: Core healthcare data processing
- **Port**: 8080
- **Responsibilities**:
  - Patient Data MCP Server (demographics, history)
  - Insurance MCP Server (coverage, claims)
  - Medication MCP Server (drug interactions)
  - Tool orchestration
- **Framework**: Spring Boot (planned)
- **Database**: PostgreSQL

### 3. Python Service (MCP Servers)
- **Purpose**: Clinical intelligence and analysis
- **Port**: 5000
- **Responsibilities**:
  - Clinical Protocol MCP Server (guidelines, best practices)
  - Lab Results MCP Server (test results, analysis)
  - Data science integration
  - AI/ML model integration
- **Framework**: Flask
- **Database**: PostgreSQL

## Project Structure

```
patient-records/
├── docker-compose.yml              # Multi-service orchestration
├── README.md                        # Main documentation
├── PHASE_1_ARCHITECTURE.md          # This file
│
├── services/
│   ├── java-service/
│   │   ├── pom.xml                 # Maven configuration
│   │   ├── Dockerfile              # Container definition
│   │   ├── src/
│   │   │   └── main/java/com/healthcare/java/service/
│   │   │       └── JavaMCPServiceApp.java
│   │   └── README.md               # Java service docs
│   │
│   ├── python-service/
│   │   ├── requirements.txt         # Python dependencies
│   │   ├── Dockerfile              # Container definition
│   │   ├── .env.example             # Environment template
│   │   ├── src/
│   │   │   └── app.py              # Flask application
│   │   └── README.md               # Python service docs
│   │
│   └── node-service/
│       ├── package.json            # NPM configuration
│       ├── Dockerfile              # Container definition
│       ├── .env.example             # Environment template
│       ├── src/
│       │   └── index.js            # Express app
│       └── README.md               # Node service docs
│
├── config/
│   ├── database.yaml               # Database configuration
│   └── services.yaml               # Service configuration
│
└── docs/
    ├── API_SPECIFICATION.md        # REST API docs
    ├── MCP_PROTOCOL.md             # MCP details
    └── DEPLOYMENT_GUIDE.md         # Deployment steps
```

## Getting Started

### Prerequisites
- Docker & Docker Compose (for containerized deployment)
- Java 25+ (for local Java service development)
- Python 3.11+ (for local Python service development)
- Node.js 20+ (for local Node service development)
- PostgreSQL 16+ (if running without Docker)

### Quick Start with Docker Compose

```bash
# Clone and navigate to project
cd patient-records

# Start all services
docker-compose up -d

# Verify services are running
docker-compose ps

# Check service health
curl http://localhost:3000/health
curl http://localhost:3000/services/health

# View logs
docker-compose logs -f
```

### Local Development Setup

#### Java Service
```bash
cd services/java-service
mvn clean install
mvn spring-boot:run
```

#### Python Service
```bash
cd services/python-service
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python src/app.py
```

#### Node Service
```bash
cd services/node-service
npm install
npm run dev
```

## Service Communication

### Inter-Service Communication
- Services communicate via HTTP REST APIs
- Node.js gateway acts as a single entry point
- Service discovery via environment variables
- Load balancing handled at reverse proxy level

### Database Access
- All services share PostgreSQL instance
- Schema isolation per service (planned)
- Connection pooling via service layer
- Migration management via Flyway/Alembic

## Configuration

### Environment Variables

**Node Service** (.env):
```
NODE_ENV=development
PORT=3000
JAVA_SERVICE_URL=http://localhost:8080
PYTHON_SERVICE_URL=http://localhost:5000
LOG_LEVEL=info
```

**Java Service** (.env):
```
JAVA_OPTS=-Xmx512m
SERVICE_NAME=java-service
DB_HOST=localhost
DB_PORT=5432
DB_USER=patient_user
DB_PASSWORD=patient_password
DB_NAME=patient_records
```

**Python Service** (.env):
```
FLASK_ENV=development
FLASK_DEBUG=True
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/patient_records
SERVICE_NAME=python-service
LOG_LEVEL=INFO
```

## Health Checks

Each service implements health check endpoints:

```bash
# Node Gateway
curl http://localhost:3000/health

# Java Service
curl http://localhost:8080/health

# Python Service
curl http://localhost:5000/health

# All services via gateway
curl http://localhost:3000/services/health
```

## Testing

### Unit Tests
```bash
# Java
cd services/java-service && mvn test

# Python
cd services/python-service && pytest tests/

# Node
cd services/node-service && npm test
```

### Integration Tests
```bash
docker-compose up -d
npm run integration-tests
```

## Deployment

### Docker Compose (Development/Testing)
```bash
docker-compose up -d
```

### Kubernetes (Production - Phase 2)
- Helm charts for service deployment
- Service mesh integration (Istio)
- Auto-scaling policies
- Rolling updates

### Cloud Deployment (Azure/AWS - Phase 3)
- Container registries
- Managed databases
- API management
- CI/CD pipelines

## Monitoring & Logging

### Logging
- Centralized logging via ELK stack (planned)
- Service-level logging to stdout
- Correlation IDs for request tracing
- Log levels configurable via environment

### Monitoring
- Health check endpoints
- Prometheus metrics (planned)
- Service dependency monitoring
- Performance metrics collection

## Next Steps (Phase 2)

1. **Database Layer**
   - Schema design & migrations
   - Connection pooling configuration
   - Backup & recovery strategies

2. **Authentication & Authorization**
   - OAuth 2.0 / SAML integration
   - JWT token management
   - Role-based access control

3. **API Documentation**
   - OpenAPI/Swagger specifications
   - Interactive API explorer
   - Postman collections

4. **Advanced Features**
   - Service mesh (Istio)
   - Rate limiting & throttling
   - Caching strategies
   - Event-driven communication

## Troubleshooting

### Service Won't Start
```bash
# Check logs
docker-compose logs <service-name>

# Verify ports are available
lsof -i :<port>

# Rebuild images
docker-compose build --no-cache <service-name>
```

### Database Connection Issues
```bash
# Test PostgreSQL connection
psql -h localhost -U patient_user -d patient_records

# Check environment variables
env | grep DATABASE
```

### Inter-Service Communication Failures
```bash
# Test service connectivity from gateway
docker-compose exec node-service curl http://java-service:8080/health
docker-compose exec node-service curl http://python-service:5000/health
```

## Support & Documentation

- **Architecture Details**: See `docs/MCP_PROTOCOL.md`
- **API Reference**: See `docs/API_SPECIFICATION.md`
- **Deployment**: See `docs/DEPLOYMENT_GUIDE.md`

---

**Last Updated**: December 2024
**Status**: Phase 1 - Initial Setup Complete
**Next Review**: Phase 2 Planning
