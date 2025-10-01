#!/bin/bash

# PostgreSQL Startup Script
# This script checks if PostgreSQL is running and starts it if needed

set -e

echo "🐘 Checking PostgreSQL status..."

# Function to check if PostgreSQL is running
check_postgres_running() {
    # Try to connect to PostgreSQL with different user options
    if pg_isready -h localhost -p 5432 -U postgres >/dev/null 2>&1; then
        return 0  # PostgreSQL is running
    elif pg_isready -h localhost -p 5432 -U $(whoami) >/dev/null 2>&1; then
        return 0  # PostgreSQL is running with current user
    else
        return 1  # PostgreSQL is not running
    fi
}

# Function to start PostgreSQL via Homebrew
start_postgres_brew() {
    echo "🍺 Starting PostgreSQL via Homebrew..."
    if command -v brew >/dev/null 2>&1; then
        brew services start postgresql@17 || brew services start postgresql
        echo "✅ PostgreSQL started via Homebrew"
        return 0
    else
        echo "❌ Homebrew not found"
        return 1
    fi
}

# Function to start PostgreSQL via system service
start_postgres_system() {
    echo "🔧 Starting PostgreSQL via system service..."
    if command -v brew >/dev/null 2>&1; then
        # Try Homebrew first
        start_postgres_brew
    else
        # Try system service
        sudo launchctl load -w /Library/LaunchDaemons/org.postgresql.postgres.plist 2>/dev/null || {
            echo "❌ Failed to start PostgreSQL via system service"
            return 1
        }
        echo "✅ PostgreSQL started via system service"
    fi
}

# Function to start PostgreSQL manually
start_postgres_manual() {
    echo "🔧 Starting PostgreSQL manually..."
    
    # Try different common PostgreSQL installation paths
    POSTGRES_PATHS=(
        "/opt/homebrew/bin/postgres"
        "/usr/local/bin/postgres"
        "/usr/bin/postgres"
        "/Applications/Postgres.app/Contents/Versions/latest/bin/postgres"
        "/Users/$(whoami)/miniconda3/bin/postgres"
        "/Users/$(whoami)/anaconda3/bin/postgres"
        "/opt/miniconda3/bin/postgres"
        "/opt/anaconda3/bin/postgres"
    )
    
    # Try different data directory paths
    DATA_DIRS=(
        "/opt/homebrew/var/postgresql@17"
        "/opt/homebrew/var/postgresql@16"
        "/opt/homebrew/var/postgresql@15"
        "/usr/local/var/postgres"
        "/var/lib/postgresql/data"
        "/usr/local/pgsql/data"
        "/Users/$(whoami)/miniconda3/var/lib/postgresql/data"
        "/Users/$(whoami)/anaconda3/var/lib/postgresql/data"
        "/opt/miniconda3/var/lib/postgresql/data"
        "/opt/anaconda3/var/lib/postgresql/data"
        "/Users/$(whoami)/postgres_data"
        "./postgres_data"
    )
    
    for postgres_path in "${POSTGRES_PATHS[@]}"; do
        if [ -f "$postgres_path" ]; then
            echo "📁 Found PostgreSQL at: $postgres_path"
            
            # Try different data directories
            for data_dir in "${DATA_DIRS[@]}"; do
                if [ -d "$data_dir" ]; then
                    echo "📁 Found data directory: $data_dir"
                    # Start PostgreSQL in background
                    "$postgres_path" -D "$data_dir" >/dev/null 2>&1 &
                    sleep 3
                    if check_postgres_running; then
                        echo "✅ PostgreSQL started manually with data directory: $data_dir"
                        return 0
                    fi
                fi
            done
        fi
    done
    
    echo "❌ Could not find PostgreSQL installation or valid data directory"
    return 1
}

# Main execution
if check_postgres_running; then
    echo "✅ PostgreSQL is already running"
    exit 0
fi

echo "⚠️  PostgreSQL is not running. Attempting to start..."

# Try different methods to start PostgreSQL
if start_postgres_brew; then
    echo "✅ PostgreSQL started successfully via Homebrew"
elif start_postgres_system; then
    echo "✅ PostgreSQL started successfully via system service"
elif start_postgres_manual; then
    echo "✅ PostgreSQL started successfully manually"
else
    echo "❌ Failed to start PostgreSQL. Please start it manually:"
    echo "   - If using Homebrew: brew services start postgresql"
    echo "   - If using Postgres.app: Start the application"
    echo "   - If using system installation: sudo systemctl start postgresql"
    echo ""
    echo "💡 If PostgreSQL starts but you get authentication errors:"
    echo "   - Create postgres user: createuser -s postgres"
    echo "   - Or use your system user: createdb -U $(whoami) postgres"
    exit 1
fi

# Wait a moment for PostgreSQL to fully start
sleep 3

# Verify PostgreSQL is running
if check_postgres_running; then
    echo "✅ PostgreSQL is now running and ready to accept connections"
else
    echo "❌ PostgreSQL failed to start properly"
    exit 1
fi
