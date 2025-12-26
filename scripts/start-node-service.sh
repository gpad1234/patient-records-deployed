#!/bin/zsh
# Start Node.js API Gateway Service
# Usage: ./scripts/start-node-service.sh

echo "🟢 Starting Node.js API Gateway Service..."

SERVICE_DIR="services/node-service"

if [ ! -d "$SERVICE_DIR" ]; then
    echo "❌ Node service directory not found at $SERVICE_DIR"
    exit 1
fi

# Check Node installation
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not installed. See LOCAL_SETUP.md for installation instructions"
    exit 1
fi

# Check npm installation
if ! command -v npm &> /dev/null; then
    echo "❌ npm not installed. See LOCAL_SETUP.md for installation instructions"
    exit 1
fi

cd "$SERVICE_DIR"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check environment file
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found, creating from .env.example..."
    cp .env.example .env
    echo "📝 Edit .env if needed: $SERVICE_DIR/.env"
fi

# Start service
echo "✅ Dependencies installed"
echo "🚀 Starting service on port 3000 (development mode with hot-reload)..."
npm run dev
