#!/bin/bash

# Vercel Deployment Script
# This script handles environment variables and deployment

set -e

echo "🚀 Starting Vercel deployment process..."

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

# Pull environment variables from Vercel (if they exist)
echo "📥 Pulling environment variables from Vercel..."
vercel env pull .env.production 2>/dev/null || echo "⚠️  No environment variables found in Vercel project"

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🌐 Your app should be available at: https://ai-chatbot.vercel.app"
