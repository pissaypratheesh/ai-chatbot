#!/bin/bash

# Environment Variables Setup Script for Vercel
# This script helps you set up environment variables in Vercel

set -e

echo "🔧 Setting up environment variables for Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Installing..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please log in to Vercel first:"
    vercel login
fi

echo "📝 Setting up environment variables..."

# Set POSTGRES_URL
echo "🔗 Setting POSTGRES_URL..."
read -p "Enter your Neon PostgreSQL connection string: " POSTGRES_URL
vercel env add POSTGRES_URL production <<< "$POSTGRES_URL"

# Set AUTH_SECRET
echo "🔐 Setting AUTH_SECRET..."
read -p "Enter your AUTH_SECRET (or press Enter to generate one): " AUTH_SECRET
if [ -z "$AUTH_SECRET" ]; then
    AUTH_SECRET=$(openssl rand -base64 32)
    echo "Generated AUTH_SECRET: $AUTH_SECRET"
fi
vercel env add AUTH_SECRET production <<< "$AUTH_SECRET"

# Set OPENAI_API_KEY
echo "🤖 Setting OPENAI_API_KEY..."
read -p "Enter your OpenAI API key: " OPENAI_API_KEY
vercel env add OPENAI_API_KEY production <<< "$OPENAI_API_KEY"

# Optional: Set BLOB_READ_WRITE_TOKEN
echo "📁 Setting BLOB_READ_WRITE_TOKEN (optional)..."
read -p "Enter your Vercel Blob token (or press Enter to skip): " BLOB_TOKEN
if [ ! -z "$BLOB_TOKEN" ]; then
    vercel env add BLOB_READ_WRITE_TOKEN production <<< "$BLOB_TOKEN"
fi

echo "✅ Environment variables set up successfully!"
echo "🚀 You can now run: npm run deploy"
