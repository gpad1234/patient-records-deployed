#!/bin/zsh
# Initialize PostgreSQL Database
# Usage: ./scripts/init-database.sh

echo "🗄️  Initializing PostgreSQL database..."

# Database credentials
DB_USER="patient_user"
DB_PASSWORD="patient_password"
DB_NAME="patient_records"
DB_HOST="localhost"

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo "❌ psql not found. PostgreSQL may not be installed."
    echo "See LOCAL_SETUP.md for installation instructions"
    exit 1
fi

# Check if PostgreSQL is running
echo "Checking PostgreSQL connection..."
psql -h $DB_HOST -U postgres -c "SELECT 1" > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ PostgreSQL is not running or not accessible"
    echo "Start PostgreSQL with: ./scripts/start-postgres.sh"
    exit 1
fi

echo "✅ PostgreSQL is running"
echo ""

# Create database and user
echo "Creating database and user..."
sudo -u postgres psql << EOF
-- Create user if not exists
DO \$\$ BEGIN
    CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
EXCEPTION WHEN DUPLICATE_OBJECT THEN
    ALTER USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
END \$\$;

-- Create database if not exists
SELECT 'CREATE DATABASE $DB_NAME' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME')\gexec

-- Grant privileges
ALTER ROLE $DB_USER CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
GRANT ALL ON SCHEMA public TO $DB_USER;
EOF

if [ $? -eq 0 ]; then
    echo "✅ Database and user created successfully"
else
    echo "⚠️  Database/user may already exist"
fi

# Test connection
echo ""
echo "Testing database connection..."
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "SELECT 1" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Successfully connected to $DB_NAME as $DB_USER"
else
    echo "❌ Failed to connect to database"
    exit 1
fi

echo ""
echo "✅ Database initialization complete!"
echo ""
echo "Connection string:"
echo "  postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:5432/$DB_NAME"
