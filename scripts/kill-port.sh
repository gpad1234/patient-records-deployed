#!/bin/zsh
# Kill Services by Port
# Usage: ./scripts/kill-port.sh [port]

if [ -z "$1" ]; then
    echo "Usage: ./scripts/kill-port.sh <port>"
    echo "Examples:"
    echo "  ./scripts/kill-port.sh 3000  # Kill Node service"
    echo "  ./scripts/kill-port.sh 5000  # Kill Python service"
    echo "  ./scripts/kill-port.sh 8080  # Kill Java service"
    exit 1
fi

PORT=$1

echo "🔍 Finding process on port $PORT..."

# Get PID of process using the port
PID=$(lsof -t -i :$PORT)

if [ -z "$PID" ]; then
    echo "❌ No process found on port $PORT"
    exit 1
fi

echo "Found process: $PID"
echo "🔪 Killing process..."

kill -9 $PID

if [ $? -eq 0 ]; then
    echo "✅ Process killed successfully"
else
    echo "❌ Failed to kill process"
    exit 1
fi
