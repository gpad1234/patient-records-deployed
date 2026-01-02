#!/bin/bash

# Initialize Authentication and Appointments Database
# This script adds auth and appointments tables to the existing database

set -e

echo "🔧 Initializing Authentication & Appointments Database..."

# Navigate to project root
cd "$(dirname "$0")/.."

# Database file location
DB_PATH="./services/node-api/data/diabetes.db"
SCHEMA_FILE="./data/auth_and_appointments.sql"

# Check if database exists
if [ ! -f "$DB_PATH" ]; then
    echo "⚠️  Database not found at $DB_PATH"
    echo "Creating new database..."
    mkdir -p "$(dirname "$DB_PATH")"
fi

# Check if schema file exists
if [ ! -f "$SCHEMA_FILE" ]; then
    echo "❌ Schema file not found at $SCHEMA_FILE"
    exit 1
fi

# Apply the schema
echo "📝 Applying authentication and appointments schema..."
sqlite3 "$DB_PATH" < "$SCHEMA_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Authentication and appointments tables created successfully!"
    echo ""
    echo "📊 Database structure:"
    sqlite3 "$DB_PATH" ".tables"
    echo ""
    echo "👥 Default users created:"
    echo "  - admin / password123 (Administrator)"
    echo "  - dr.smith / password123 (Doctor)"
    echo "  - dr.johnson / password123 (Doctor)"
    echo "  - nurse.williams / password123 (Nurse)"
    echo "  - receptionist / password123 (Receptionist)"
    echo ""
    echo "🎉 Ready to use authentication and appointments!"
else
    echo "❌ Failed to apply schema"
    exit 1
fi
