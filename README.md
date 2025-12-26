# PatientRecords - Healthcare AI Agent

Agentic healthcare system using Model Context Protocol (MCP) servers for intelligent clinical decision support.

**Status**: Development - Technical specification complete, ready for implementation

## Quick Links

- 📋 [Technical Specification](../PatientRecords-TechnicalSpec.md)
- 🏥 Architecture: Patient Data + Clinical Protocols + Medication + Labs + Insurance
- 🤖 Agent: Intelligent reasoning with tool orchestration
- 🔒 Security: HIPAA-compliant with audit trails

## Getting Started

### ⚡ Quick Start Options

**Option 1: Local Development (No Docker)**
```bash
# Follow the quick reference
cat NO_DOCKER_SETUP.md

# Then run:
./scripts/setup-all.sh
./scripts/init-database.sh
```

**Option 2: Docker Compose (Recommended if available)**
```bash
docker-compose up -d
curl http://localhost:3000/health
```

### 📚 Setup Documentation

- **Local Development**: See [`NO_DOCKER_SETUP.md`](NO_DOCKER_SETUP.md) - Complete guide for running without Docker
- **Detailed Setup**: See [`LOCAL_SETUP.md`](LOCAL_SETUP.md) - Prerequisites installation instructions
- **Docker Setup**: See [`QUICKSTART.md`](QUICKSTART.md) - Docker Compose quick start
- **Architecture**: See [`PHASE_1_ARCHITECTURE.md`](PHASE_1_ARCHITECTURE.md) - System design & overview

### 🔧 Helper Scripts

Convenient scripts for local development:

```bash
./scripts/setup-all.sh              # Initialize all services
./scripts/init-database.sh          # Setup PostgreSQL
./scripts/start-postgres.sh         # Start database
./scripts/start-java-service.sh     # Start Java service
./scripts/start-python-service.sh   # Start Python service
./scripts/start-node-service.sh     # Start Node gateway
./scripts/test-services.sh          # Test all services
./scripts/kill-port.sh <port>       # Kill service by port
```

### Prerequisites

#### For Local Development (No Docker)
- **Java 25+** - See [LOCAL_SETUP.md](LOCAL_SETUP.md#java-25)
- **Maven 3.9+** - See [LOCAL_SETUP.md](LOCAL_SETUP.md#maven)
- **Python 3.11+** - See [LOCAL_SETUP.md](LOCAL_SETUP.md#python-311)
- **Node.js 20+** - See [LOCAL_SETUP.md](LOCAL_SETUP.md#nodejs-20)
- **PostgreSQL 16+** - See [LOCAL_SETUP.md](LOCAL_SETUP.md#postgresql-database)

#### For Docker Setup
- Docker Desktop
- Docker Compose

### Project Structure
```
src/main/java/com/healthcare/
├── app/
│   └── PatientRecordsApp.java          (Main entry point)
├── mcp/
│   ├── MCPServer.java                  (Base class)
│   ├── PatientDataMCPServer.java       (Patient info)
│   ├── ClinicalProtocolMCPServer.java  (Guidelines)
│   ├── MedicationMCPServer.java        (Drug info)
│   ├── LabResultsMCPServer.java        (Lab data)
│   ├── InsuranceMCPServer.java         (Coverage)
│   └── MCPServerManager.java           (Orchestration)
├── agent/
│   └── HealthcareAgent.java            (Agentic reasoning)
├── service/
│   ├── PatientDataService.java         (Database access)
│   ├── EHRIntegration.java             (EHR system integration)
│   └── ProtocolService.java            (Clinical protocol management)
└── api/
    ├── HealthcareWebServer.java        (HTTP REST API)
    └── AuthenticationService.java      (OAuth 2.0 / SAML)
```

## MCP Servers Overview

| Server | Purpose | Tools | Status |
|--------|---------|-------|--------|
| PatientDataMCPServer | Patient demographics & history | 7 tools | 🔲 TODO |
| ClinicalProtocolMCPServer | Treatment guidelines | 6 tools | 🔲 TODO |
| MedicationMCPServer | Drug information | 7 tools | 🔲 TODO |
| LabResultsMCPServer | Lab test data | 7 tools | 🔲 TODO |
| InsuranceMCPServer | Coverage & billing | 7 tools | 🔲 TODO |

## Development Roadmap

### Phase 1: MVP (Core functionality)
- [ ] Base MCP infrastructure
- [ ] PatientDataMCPServer implementation
- [ ] ClinicalProtocolMCPServer implementation
- [ ] HealthcareAgent with reasoning loop
- [ ] REST API endpoints
- [ ] Basic authentication
- [ ] Logging and error handling

### Phase 2: Extended (More MCP servers)
- [ ] MedicationMCPServer
- [ ] LabResultsMCPServer
- [ ] Advanced caching layer
- [ ] Response optimization

### Phase 3: Production (Security & Compliance)
- [ ] InsuranceMCPServer
- [ ] HIPAA audit trail
- [ ] Role-based access control
- [ ] Data encryption (at rest & in transit)
- [ ] Load testing and optimization

### Phase 4: Enhancement (Advanced features)
- [ ] More sophisticated agent reasoning
- [ ] ML-based clinical predictions
- [ ] Real-time alerts
- [ ] Mobile app integration

## Testing

```bash
# Run all tests
mvn test

# Run specific test
mvn test -Dtest=PatientDataMCPServerTest

# Run with coverage
mvn clean test jacoco:report
```

## Building

```bash
# Build package
mvn clean package

# Run application
mvn exec:java -Dexec.mainClass="com.healthcare.app.PatientRecordsApp"

# Build JAR
mvn clean package -DskipTests=true
java -jar target/patient-records-1.0.0.jar
```

## Documentation

- **Technical Specification**: See PatientRecords-TechnicalSpec.md (system design)
- **Architecture**: System diagrams and component interactions
- **API Documentation**: REST endpoints and request/response formats
- **Security**: HIPAA compliance, authentication, encryption
- **Operations**: Deployment, monitoring, disaster recovery

## Key Features

✅ **Agentic Reasoning**: Multi-step reasoning with tool use
✅ **MCP Servers**: Modular healthcare data providers
✅ **Security**: HIPAA-compliant with audit trails
✅ **Performance**: Virtual threads for high concurrency
✅ **Reliability**: Graceful degradation and error handling
✅ **Extensibility**: Easy to add new MCP servers

## Contributing

Guidelines for adding new MCP servers:
1. Extend `MCPServer` abstract class
2. Register tools in `initializeTools()`
3. Implement tool logic with proper error handling
4. Add comprehensive tests
5. Update documentation

## References

- Original Implementation: `/Users/gp/java-code/scaling-potato-java/`
- MCP Framework: Based on Scaling Potato's proven architecture
- HIPAA Requirements: FDA/OCR guidelines
- HL7 FHIR Standard: Healthcare data interoperability

---

**Version**: 1.0.0-SNAPSHOT
**Status**: Pre-development
**Last Updated**: December 9, 2025
