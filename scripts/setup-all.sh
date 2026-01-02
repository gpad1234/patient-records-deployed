#!/bin/bash
# Setup All Services
# Usage: ./scripts/setup-all.sh

echo "⚙️  Setting up all services..."
echo ""

# Make scripts executable
chmod +x scripts/*.sh

# Check prerequisites
echo "Checking prerequisites..."
echo ""

if ! command -v java &> /dev/null; then
    echo "⚠️  Java not found. See LOCAL_SETUP.md for installation"
fi

if ! command -v mvn &> /dev/null; then
    echo "⚠️  Maven not found. See LOCAL_SETUP.md for installation"
fi

if ! command -v python3 &> /dev/null; then
    echo "⚠️  Python3 not found. See LOCAL_SETUP.md for installation"
fi

if ! command -v node &> /dev/null; then
    echo "⚠️  Node.js not found. See LOCAL_SETUP.md for installation"
fi

echo ""
echo "Setting up Java service..."
cd services/java-service
mvn clean install -q
echo "✅ Java service ready"
cd ../..

echo ""
echo "Setting up Python service..."
cd services/python-service
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install -q -r requirements.txt
if [ ! -f ".env" ]; then
    cp .env.example .env
fi
deactivate
echo "✅ Python service ready"
cd ../..

echo ""
echo "Setting up Node service..."
cd services/node-service
npm install -q
if [ ! -f ".env" ]; then
    cp .env.example .env
fi
echo "✅ Node service ready"
cd ../..

echo ""
echo "✅ All services configured!"
echo ""
echo "To start services, run in separate terminals:"
echo "  ./scripts/start-postgres.sh"
echo "  ./scripts/start-java-service.sh"
echo "  ./scripts/start-python-service.sh"
echo "  ./scripts/start-node-service.sh"
echo ""
echo "Then test with:"
echo "  ./scripts/test-services.sh"
