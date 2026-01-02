#!/bin/bash
# Start Python MCP Service
# Usage: ./scripts/start-python-service.sh

echo "🐍 Starting Python MCP Service..."

SERVICE_DIR="services/python-service"

if [ ! -d "$SERVICE_DIR" ]; then
    echo "❌ Python service directory not found at $SERVICE_DIR"
    exit 1
fi

# Check Python installation
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 not installed. See LOCAL_SETUP.md for installation instructions"
    exit 1
fi

cd "$SERVICE_DIR"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install/update dependencies
echo "📦 Installing dependencies..."
pip install -q -r requirements.txt

# Check environment file
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found, creating from .env.example..."
    cp .env.example .env
    echo "📝 Edit .env if needed: $SERVICE_DIR/.env"
fi

# Start service
echo "✅ Dependencies installed"
echo "🚀 Starting service on port 5000..."
python src/app.py
