#!/bin/bash

# Local Development Environment Setup
# This script sets up your local .env.local file

set -e

echo "🔧 Setting up local development environment..."

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    touch .env.local
fi

echo "📝 Setting up environment variables for local development..."

# Set POSTGRES_URL (local)
echo "🔗 Setting POSTGRES_URL for local development..."
read -p "Enter your local PostgreSQL URL (or press Enter for default): " POSTGRES_URL
if [ -z "$POSTGRES_URL" ]; then
    POSTGRES_URL="postgresql://postgres:password@localhost:5432/postgres"
fi
echo "POSTGRES_URL=\"$POSTGRES_URL\"" >> .env.local

# Set AUTH_SECRET
echo "🔐 Setting AUTH_SECRET..."
read -p "Enter your AUTH_SECRET (or press Enter to generate one): " AUTH_SECRET
if [ -z "$AUTH_SECRET" ]; then
    AUTH_SECRET=$(openssl rand -base64 32)
    echo "Generated AUTH_SECRET: $AUTH_SECRET"
fi
echo "AUTH_SECRET=\"$AUTH_SECRET\"" >> .env.local

# Set OPENAI_API_KEY
echo "🤖 Setting OPENAI_API_KEY..."
read -p "Enter your OpenAI API key: " OPENAI_API_KEY
echo "OPENAI_API_KEY=\"$OPENAI_API_KEY\"" >> .env.local

# Set NEXTAUTH_URL
echo "🌐 Setting NEXTAUTH_URL..."
echo "NEXTAUTH_URL=\"http://localhost:3000\"" >> .env.local

echo "✅ Local environment setup complete!"
echo "📁 Created .env.local file"
echo "🚀 You can now run: npm run dev"
