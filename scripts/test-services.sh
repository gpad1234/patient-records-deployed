#!/bin/bash
# Test All Services Health
# Usage: ./scripts/test-services.sh

echo "🧪 Testing all services..."
echo ""

# Test Node Gateway
echo "Testing Node.js Gateway (Port 3000)..."
curl -s http://localhost:3000/health | python3 -m json.tool || echo "❌ Node service unavailable"
echo ""

# Test Java Service
echo "Testing Java Service (Port 8080)..."
curl -s http://localhost:8080/health | python3 -m json.tool || echo "❌ Java service unavailable"
echo ""

# Test Python Service
echo "Testing Python Service (Port 5000)..."
curl -s http://localhost:5000/health | python3 -m json.tool || echo "❌ Python service unavailable"
echo ""

# Test aggregated health
echo "Testing Aggregated Services Health (via Gateway)..."
curl -s http://localhost:3000/services/health | python3 -m json.tool || echo "❌ Gateway unavailable"
echo ""

echo "✅ Health check complete"
