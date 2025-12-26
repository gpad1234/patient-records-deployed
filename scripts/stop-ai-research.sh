#!/bin/bash

# Stop AI Research MCP Servers
# Stops Node.js (3007), Python (3008), Go (3009)

set -e

echo "🛑 Stopping AI Research MCP Servers..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Stop service by PID file
stop_service() {
    local name=$1
    local pid_file=$2
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p $pid > /dev/null 2>&1; then
            echo -e "Stopping $name (PID: $pid)..."
            kill $pid
            rm -f "$pid_file"
            echo -e "${GREEN}✅ $name stopped${NC}"
        else
            echo -e "${YELLOW}⚠️  $name not running${NC}"
            rm -f "$pid_file"
        fi
    else
        echo -e "${YELLOW}⚠️  $name PID file not found${NC}"
    fi
}

# Stop each service
stop_service "Node.js MCP" "/tmp/mcp-node-research.pid"
stop_service "Python MCP" "/tmp/mcp-python-research.pid"
stop_service "Go MCP" "/tmp/mcp-go-research.pid"

# Also kill by port as backup
echo ""
echo "Checking for processes on ports..."

for port in 3007 3008 3009; do
    pid=$(lsof -ti:$port 2>/dev/null || true)
    if [ ! -z "$pid" ]; then
        echo "Killing process on port $port (PID: $pid)"
        kill $pid 2>/dev/null || true
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ All AI Research MCP Servers stopped${NC}"
echo ""
