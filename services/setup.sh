#!/bin/bash

echo "🏥 Setting up Diabetes EMR System..."
echo ""

# Create data directory for SQLite
mkdir -p services/node-api/data

# Install Node API dependencies
echo "📦 Installing Node API dependencies..."
cd services/node-api
npm install > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "✓ Node API dependencies installed"
else
  echo "✗ Failed to install Node API dependencies"
  exit 1
fi
cd ../..

# Install React UI dependencies
echo "📦 Installing React UI dependencies..."
cd services/web-ui
npm install > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "✓ React UI dependencies installed"
else
  echo "✗ Failed to install React UI dependencies"
  exit 1
fi
cd ../..

echo ""
echo "✓ Setup complete!"
echo ""
echo "To start the system:"
echo "  1. Terminal 1 (Backend): cd services/node-api && npm run dev"
echo "  2. Terminal 2 (Frontend): cd services/web-ui && npm start"
echo ""
echo "Then visit: http://localhost:3000"
