# Contributing Guide

## Overview

This document outlines guidelines for contributing to the Patient Records healthcare AI platform.

## Code Standards

### Java Service
- Java naming conventions (camelCase for variables/methods, PascalCase for classes)
- Use SLF4J for logging
- Write unit tests for all service methods
- Follow Spring Boot conventions
- Maximum line length: 120 characters

### Python Service
- Follow PEP 8 style guide
- Use type hints in function signatures
- Write docstrings for all modules/functions/classes
- Use Flask conventions
- Maximum line length: 88 characters (Black formatter)

### Node Service
- Use ES6+ syntax (async/await, arrow functions, destructuring)
- Use camelCase for variables/functions
- Write meaningful comments
- Handle errors explicitly
- Use Prettier for code formatting

## Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Commit with clear, descriptive messages
   - Keep commits atomic and focused
   - Reference issues when relevant

3. **Write Tests**
   - Unit tests for new functionality
   - Integration tests for service interaction
   - Maintain >80% code coverage

4. **Code Review**
   - Push to GitHub and create Pull Request
   - Address reviewer feedback
   - Ensure CI/CD passes

5. **Merge**
   - Squash commits if requested
   - Delete feature branch after merge

## Testing Requirements

### Java Service
```bash
cd services/java-service
mvn test
mvn test jacoco:report  # Coverage
```

### Python Service
```bash
cd services/python-service
pytest                  # Run tests
pytest --cov          # Coverage
```

### Node Service
```bash
cd services/node-service
npm test              # Run tests
npm run test:coverage # Coverage
```

## Documentation

- Update README.md for new features
- Add code comments for complex logic
- Update PHASE_1_ARCHITECTURE.md for architecture changes
- Document new APIs in service READMEs

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**: feat, fix, docs, style, refactor, perf, test, chore

**Example**:
```
feat(patient-data): add patient search endpoint

Implement full-text search for patient records
- Added search service with database query
- Created REST endpoint /api/patients/search
- Added unit tests with 90% coverage

Closes #42
```

## Pull Request Process

1. Update documentation
2. Add tests for new functionality
3. Ensure all tests pass locally
4. Update CHANGELOG if applicable
5. Request review from maintainers
6. Address feedback promptly

## Setting Up Development Environment

See QUICKSTART.md for detailed setup instructions.

## Reporting Issues

- Use GitHub Issues for bugs/features
- Provide clear description and steps to reproduce
- Include environment details (OS, versions, etc.)
- Attach logs if applicable

## Questions?

- Check existing documentation first
- Review similar implementations
- Ask in GitHub Discussions
- Reach out to maintainers

---

Thank you for contributing! 🚀
