#!/bin/bash

# Start AI Research MCP Servers
# Node.js (3007), Python (3008), Go (3009)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "🔬 Starting AI Research MCP Servers..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if ports are already in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        echo -e "${YELLOW}⚠️  Port $port is already in use${NC}"
        return 1
    fi
    return 0
}

# Start Node.js MCP Server (Port 3007)
start_node_mcp() {
    echo -e "\n${BLUE}📦 Starting Node.js MCP Server (Port 3007)...${NC}"
    cd "$PROJECT_ROOT/services/mcp-node-research"
    
    if [ ! -d "node_modules" ]; then
        echo "Installing Node.js dependencies..."
        npm install
    fi
    
    if check_port 3007; then
        npm start > /tmp/mcp-node-research.log 2>&1 &
        echo $! > /tmp/mcp-node-research.pid
        echo -e "${GREEN}✅ Node.js MCP started (PID: $!)${NC}"
    else
        echo -e "${RED}❌ Failed to start - port 3007 in use${NC}"
    fi
}

# Start Python MCP Server (Port 3008)
start_python_mcp() {
    echo -e "\n${BLUE}🐍 Starting Python MCP Server (Port 3008)...${NC}"
    cd "$PROJECT_ROOT/services/mcp-python-research"
    
    # Check if requirements are installed
    if ! python3 -c "import fastapi" 2>/dev/null; then
        echo "Installing Python dependencies..."
        pip3 install -r requirements.txt
    fi
    
    if check_port 3008; then
        python3 main.py > /tmp/mcp-python-research.log 2>&1 &
        echo $! > /tmp/mcp-python-research.pid
        echo -e "${GREEN}✅ Python MCP started (PID: $!)${NC}"
    else
        echo -e "${RED}❌ Failed to start - port 3008 in use${NC}"
    fi
}

# Start Go MCP Server (Port 3009)
start_go_mcp() {
    echo -e "\n${BLUE}🚀 Starting Go MCP Server (Port 3009)...${NC}"
    cd "$PROJECT_ROOT/services/mcp-go-research"
    
    if check_port 3009; then
        # Check if binary exists, otherwise compile
        if [ -f "./mcp-go-research" ]; then
            ./mcp-go-research > /tmp/mcp-go-research.log 2>&1 &
        else
            echo "Compiling Go binary..."
            go build -o mcp-go-research main.go
            ./mcp-go-research > /tmp/mcp-go-research.log 2>&1 &
        fi
        echo $! > /tmp/mcp-go-research.pid
        echo -e "${GREEN}✅ Go MCP started (PID: $!)${NC}"
    else
        echo -e "${RED}❌ Failed to start - port 3009 in use${NC}"
    fi
}

# Start all services
start_node_mcp
start_python_mcp
start_go_mcp

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ AI Research MCP Servers started${NC}"
echo ""
echo "Services:"
echo "  • Node.js MCP:  http://localhost:3007"
echo "  • Python MCP:   http://localhost:3008"
echo "  • Go MCP:       http://localhost:3009"
echo ""
echo "Logs:"
echo "  • Node.js:  /tmp/mcp-node-research.log"
echo "  • Python:   /tmp/mcp-python-research.log"
echo "  • Go:       /tmp/mcp-go-research.log"
echo ""
echo "To stop all services:"
echo "  ./scripts/stop-ai-research.sh"
echo ""
