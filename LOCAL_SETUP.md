# Local Development Setup - No Docker Required

Complete guide to running the Patient Records system locally without Docker or Homebrew.

## Prerequisites Installation

### 1. SQLite Database (Built-in - No Installation Needed)

SQLite 3.x comes pre-installed on macOS, Linux, and most operating systems.

**Verify SQLite is available:**
```bash
sqlite3 --version
# Should output: 3.x.x ...
```

The database file will be created automatically at `data/patient_records.db` when you run the initialization script.

### 2. PostgreSQL Database (OPTIONAL - For Future Production Use)

> **For pilot phase**: Skip this section. We're using SQLite for the pilot. PostgreSQL can be installed later for production migration.

#### macOS - Direct Installation
```bash
# Download PostgreSQL from https://www.postgresql.org/download/macosx/
# Choose "Interactive installer by EDB"
# Install in default location: /Library/PostgreSQL/16
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
```

### 3. Java 25

#### macOS
Download from: https://www.oracle.com/java/technologies/downloads/

```bash
# Download Java 25 JDK
# Run the installer: java_jdk-25_macos-*.dmg

# Verify installation
java -version
javac -version

# Add to PATH if needed
export JAVA_HOME=$(/usr/libexec/java_home -v 25)
export PATH=$JAVA_HOME/bin:$PATH

# Add to ~/.zprofile for permanent setup
echo 'export JAVA_HOME=$(/usr/libexec/java_home -v 25)' >> ~/.zprofile
echo 'export PATH=$JAVA_HOME/bin:$PATH' >> ~/.zprofile
source ~/.zprofile
```

#### Linux
```bash
# Ubuntu/Debian
sudo apt-get install openjdk-25-jdk

# Fedora/RHEL
sudo dnf install java-25-openjdk-devel
```

### 3. Maven

#### macOS - Manual Installation
```bash
# Download from https://maven.apache.org/download.cgi
# Choose binary zip (e.g., apache-maven-3.9.6-bin.zip)

# Extract to /opt
mkdir -p /opt
cd /opt
unzip ~/Downloads/apache-maven-3.9.6-bin.zip

# Add to PATH
export PATH=/opt/apache-maven-3.9.6/bin:$PATH

# Permanent setup
echo 'export PATH=/opt/apache-maven-3.9.6/bin:$PATH' >> ~/.zprofile
source ~/.zprofile

# Verify
mvn -version
```

#### Linux
```bash
# Ubuntu/Debian
sudo apt-get install maven

# Fedora/RHEL
sudo dnf install maven
```

### 4. Python 3.11+

#### macOS
Download from: https://www.python.org/downloads/

```bash
# Run the installer: python-3.11.x-macosx-universal2.pkg

# Verify installation
python3 --version
pip3 --version

# Create alias for convenience
echo 'alias python=python3' >> ~/.zprofile
echo 'alias pip=pip3' >> ~/.zprofile
source ~/.zprofile
```

#### Linux
```bash
# Ubuntu/Debian
sudo apt-get install python3.11 python3.11-venv python3-pip

# Fedora/RHEL
sudo dnf install python3.11 python3-pip
```

### 5. Node.js 20+

#### macOS
Download from: https://nodejs.org/

```bash
# Download Node.js LTS (v20.x)
# Run the installer: node-v20.x-darwin-*.pkg

# Verify installation
node --version
npm --version

# Install nvm (Node Version Manager) for easier management
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Add nvm to ~/.zprofile
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zprofile
echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.zprofile
source ~/.zprofile

# Install Node via nvm
nvm install 20
nvm use 20
```

#### Linux
```bash
# Using NodeSource repository (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install nodejs

# Using dnf (Fedora/RHEL)
sudo dnf install nodejs
```

## Verification

After installing all prerequisites, verify everything:

```bash
java -version
javac -version
mvn -version
python3 --version
pip3 --version
node --version
npm --version
psql --version

# Test database connection
psql -h localhost -U patient_user -d patient_records -c "SELECT 1"
```

Expected output for all commands: version information without errors.

## Running Services Locally

### Setup 1: Java Service

```bash
cd services/java-service

# Build
mvn clean install

# Run
mvn spring-boot:run
```

Service will start on: `http://localhost:8080`

Logs will appear in terminal. Press Ctrl+C to stop.

### Setup 2: Python Service

```bash
cd services/python-service

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # macOS/Linux
# or on Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env if needed:
# DATABASE_URL=postgresql://patient_user:patient_password@localhost:5432/patient_records

# Run
python src/app.py
```

Service will start on: `http://localhost:5000`

Logs will appear in terminal. Press Ctrl+C to stop.

### Setup 3: Node.js Service

```bash
cd services/node-service

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env if needed:
# JAVA_SERVICE_URL=http://localhost:8080
# PYTHON_SERVICE_URL=http://localhost:5000

# Run (development mode with auto-reload)
npm run dev

# or run production mode
npm start
```

Service will start on: `http://localhost:3000`

Logs will appear in terminal. Press Ctrl+C to stop.

## Running All Services

### Terminal 1: PostgreSQL
If PostgreSQL is not running as a system service:
```bash
/Library/PostgreSQL/16/bin/pg_ctl -D /Library/PostgreSQL/16/data start
```

### Terminal 2: Java Service
```bash
cd services/java-service
mvn spring-boot:run
```

### Terminal 3: Python Service
```bash
cd services/python-service
source venv/bin/activate
python src/app.py
```

### Terminal 4: Node.js Service
```bash
cd services/node-service
npm run dev
```

## Verification

Once all services are running:

```bash
# Test Node.js Gateway (Port 3000)
curl http://localhost:3000/health

# Test Java Service (Port 8080)
curl http://localhost:8080/health

# Test Python Service (Port 5000)
curl http://localhost:5000/health

# Test all services health through gateway
curl http://localhost:3000/services/health
```

Expected responses:
```json
{
  "status": "healthy",
  "service": "node-service",
  "version": "1.0.0"
}
```

## Managing Services

### Start/Stop PostgreSQL

```bash
# Start
sudo /Library/PostgreSQL/16/bin/pg_ctl -D /Library/PostgreSQL/16/data start

# Stop
sudo /Library/PostgreSQL/16/bin/pg_ctl -D /Library/PostgreSQL/16/data stop

# Restart
sudo /Library/PostgreSQL/16/bin/pg_ctl -D /Library/PostgreSQL/16/data restart

# Check status
sudo /Library/PostgreSQL/16/bin/pg_ctl -D /Library/PostgreSQL/16/data status
```

### Connect to Database

```bash
# Default connection
psql -h localhost -U patient_user -d patient_records

# With password prompt
psql -h localhost -U patient_user -d patient_records -W

# Connection string
psql postgresql://patient_user:patient_password@localhost:5432/patient_records
```

### Kill Service by Port

If a service is stuck on a port:

```bash
# macOS - Find process using port
lsof -i :8080  # Java service
lsof -i :5000  # Python service
lsof -i :3000  # Node service

# Kill process
kill -9 <PID>

# Example:
kill -9 12345
```

## Environment Files

Create these `.env` files in each service directory:

### services/java-service/.env
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=patient_user
DB_PASSWORD=patient_password
DB_NAME=patient_records
SERVICE_NAME=java-service
JAVA_OPTS=-Xmx512m
```

### services/python-service/.env
```
FLASK_ENV=development
FLASK_DEBUG=True
PORT=5000
DATABASE_URL=postgresql://patient_user:patient_password@localhost:5432/patient_records
SERVICE_NAME=python-service
LOG_LEVEL=INFO
```

### services/node-service/.env
```
NODE_ENV=development
PORT=3000
JAVA_SERVICE_URL=http://localhost:8080
PYTHON_SERVICE_URL=http://localhost:5000
LOG_LEVEL=info
SERVICE_NAME=node-service
REQUEST_TIMEOUT=30000
```

## Troubleshooting

### PostgreSQL Connection Failed
```bash
# Test connection
psql -h localhost -U patient_user -d patient_records

# Check if PostgreSQL is running
ps aux | grep postgres

# Check PostgreSQL logs
tail -f /Library/PostgreSQL/16/data/postgresql.log

# Start PostgreSQL if not running
sudo /Library/PostgreSQL/16/bin/pg_ctl -D /Library/PostgreSQL/16/data start
```

### Java Service Won't Start
```bash
# Verify Java installation
java -version
which java

# Verify Maven installation
mvn -version

# Check if port 8080 is in use
lsof -i :8080

# Clean rebuild
cd services/java-service
mvn clean install
mvn spring-boot:run
```

### Python Service Won't Start
```bash
# Verify Python installation
python3 --version
which python3

# Verify virtual environment is activated
which python  # Should show path to venv

# Reinstall dependencies
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall

# Test Flask app directly
python -c "from flask import Flask; print('Flask OK')"
```

### Node Service Won't Start
```bash
# Verify Node installation
node --version
npm --version

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check if port 3000 is in use
lsof -i :3000
```

## Development Workflow

### Making Code Changes

1. Edit source files
2. Services with auto-reload will update automatically:
   - **Python**: Flask auto-reloads on file changes
   - **Node**: nodemon auto-reloads on file changes
   - **Java**: Need to rebuild and restart

3. For Java changes:
   ```bash
   Ctrl+C  # Stop the running service
   mvn clean install
   mvn spring-boot:run
   ```

### Running Tests

```bash
# Java tests
cd services/java-service
mvn test

# Python tests
cd services/python-service
pytest tests/

# Node tests
cd services/node-service
npm test
```

## Database Management

### Backup Database
```bash
pg_dump -h localhost -U patient_user -d patient_records > backup.sql
```

### Restore Database
```bash
psql -h localhost -U patient_user -d patient_records < backup.sql
```

### Reset Database
```bash
# Warning: This deletes all data
dropdb -h localhost -U patient_user -d patient_records
createdb -h localhost -U patient_user -d patient_records
```

## Performance Monitoring

### Check Resource Usage
```bash
# Java process (find by port)
lsof -i :8080

# Python process (find by port)
lsof -i :5000

# Node process (find by port)
lsof -i :3000

# Memory usage by process ID
ps -o pid,rss,command | grep -E "java|python|node"
```

## Next Steps

1. Install all prerequisites from this guide
2. Verify each installation
3. Start PostgreSQL
4. Run each service in separate terminal windows
5. Test services with curl or Postman
6. Begin development

## Common Commands Reference

```bash
# Database
psql -h localhost -U patient_user -d patient_records

# Java service
cd services/java-service && mvn spring-boot:run

# Python service
cd services/python-service && source venv/bin/activate && python src/app.py

# Node service
cd services/node-service && npm run dev

# Test connectivity
curl http://localhost:3000/health
curl http://localhost:3000/services/health

# Kill stuck process
kill -9 <PID>

# Check port availability
lsof -i :<PORT>
```

---

**Status**: Ready for local development without Docker
**Date**: December 2024
**Next**: Follow "Running Services Locally" section to start development
