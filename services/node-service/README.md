# Node.js API Gateway Service

Central API gateway and service orchestrator for the Patient Records healthcare platform.

## Overview

This service acts as the primary entry point for all client applications and provides:
- HTTP API Gateway
- Service Orchestration
- Request Routing & Load Balancing
- Authentication & Authorization (planned)
- API Documentation & Swagger UI (planned)
- Request/Response Transformation

## Technology Stack

- **Node.js 20 LTS**
- **Framework**: Express.js 4.x
- **HTTP Client**: Axios
- **Logging**: Winston
- **Validation**: Joi
- **Development**: Nodemon

## Project Structure

```
node-service/
├── package.json
├── Dockerfile
├── .env.example
├── README.md (this file)
└── src/
    ├── index.js
    ├── routes/
    │   ├── health.js
    │   ├── patients.js
    │   ├── protocols.js
    │   └── auth.js (planned)
    ├── middleware/
    │   ├── errorHandler.js
    │   ├── requestLogger.js
    │   ├── auth.js (planned)
    │   └── validation.js
    ├── services/
    │   ├── javaClient.js
    │   ├── pythonClient.js
    │   └── serviceRegistry.js
    ├── config/
    │   ├── logger.js
    │   └── constants.js
    └── utils/
        ├── errors.js
        └── validators.js
```

## Development

### Install Dependencies
```bash
npm install
```

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Test
```bash
npm test
```

## API Endpoints

### Health & Info
- `GET /health` - Gateway health check
- `GET /info` - Service information
- `GET /services/health` - All downstream services health

### Patient Endpoints
- `GET /api/patients` - List patients
- `POST /api/patients` - Create patient
- `GET /api/patients/:id` - Get patient details
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Clinical Protocol Endpoints
- `GET /api/protocols` - List clinical protocols
- `GET /api/protocols/:id` - Get protocol details
- `POST /api/protocols/search` - Search protocols

### Lab Results Endpoints
- `GET /api/labs/:patientId` - Get patient lab results
- `POST /api/labs` - Submit lab results

## Configuration

### Environment Variables
```
NODE_ENV=development
PORT=3000
JAVA_SERVICE_URL=http://localhost:8080
PYTHON_SERVICE_URL=http://localhost:5000
LOG_LEVEL=info
SERVICE_NAME=node-service
REQUEST_TIMEOUT=30000
```

### Setup .env File
```bash
cp .env.example .env
# Edit .env with your configuration
```

## Docker

### Build Image
```bash
docker build -t patient-records-node-service .
```

### Run Container
```bash
docker run -p 3000:3000 \
  -e JAVA_SERVICE_URL=http://java-service:8080 \
  -e PYTHON_SERVICE_URL=http://python-service:5000 \
  patient-records-node-service
```

## Dependencies

Key dependencies:
- **express**: Web framework
- **express-cors**: CORS support
- **axios**: HTTP client for service calls
- **winston**: Structured logging
- **joi**: Request validation
- **uuid**: Request ID generation
- **morgan**: HTTP request logging (planned)

See `package.json` for complete list.

## Development Workflow

### Add New Dependency
```bash
npm install <package>
npm install --save-dev <dev-dependency>
```

### Code Quality
```bash
# Linting
npm run lint

# Format code
npm run format

# Check syntax
node -c src/index.js
```

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test
npm test -- --grep "health"

# Watch mode
npm run test:watch
```

## Service Communication

### Calling Java Service
```javascript
const javaResponse = await axios.get(
    `${process.env.JAVA_SERVICE_URL}/api/patients/123`
);
```

### Calling Python Service
```javascript
const pythonResponse = await axios.post(
    `${process.env.PYTHON_SERVICE_URL}/api/protocols`,
    { patientId: 123 }
);
```

### Error Handling
```javascript
try {
    const response = await axios.get(serviceUrl);
    return response.data;
} catch (error) {
    logger.error(`Service call failed: ${error.message}`);
    throw new ServiceError('Downstream service unavailable');
}
```

## Logging

Structured logging with Winston:

```javascript
logger.info('Patient created', { patientId: 123, userId: 'user@example.com' });
logger.warn('High latency detected', { service: 'java-service', ms: 5000 });
logger.error('Service unavailable', { service: 'python-service', error: 'ECONNREFUSED' });
```

## Security Considerations

- Input validation using Joi schemas
- Request rate limiting (planned)
- CORS configuration
- Authentication middleware (planned)
- API key validation (planned)
- Request signing for inter-service communication (planned)

## Performance Optimization

- Connection pooling via axios
- Request timeout configuration
- Circuit breaker pattern for failing services (planned)
- Response caching (planned)
- Compression middleware (planned)

## Troubleshooting

### Downstream Service Unreachable
```bash
# Test connectivity
curl http://java-service:8080/health
curl http://python-service:5000/health

# Check environment variables
env | grep SERVICE_URL
```

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Contributing

1. Follow Node.js best practices
2. Use async/await for asynchronous operations
3. Add error handling for all service calls
4. Update documentation for new endpoints
5. Write tests for critical paths

## Next Steps

- [ ] Implement authentication/authorization
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Implement request caching
- [ ] Add rate limiting
- [ ] Implement circuit breaker pattern
- [ ] Add monitoring & metrics
- [ ] Setup CI/CD pipeline
