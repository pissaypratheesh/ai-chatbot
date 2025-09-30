# Neon Database Integration Guide

## 🚀 Production Deployment with Neon Database

This guide explains how to deploy your Vercel AI Chatbot with Neon PostgreSQL database for production.

## 📋 Prerequisites

1. **Neon Account**: Sign up at [neon.tech](https://neon.tech)
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **OpenAI API Key**: Get from [platform.openai.com](https://platform.openai.com/api-keys)

## 🗄️ Neon Database Setup

### Step 1: Create Neon Database
1. Go to [Neon Console](https://console.neon.tech)
2. Click "Create Project"
3. Choose your region (recommend same as Vercel)
4. Set project name (e.g., "ai-chatbot-prod")
5. Click "Create Project"

### Step 2: Get Connection String
1. In your Neon project dashboard
2. Go to "Connection Details"
3. Copy the connection string (format: `postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb`)

## 🔧 Vercel Environment Variables

Add these environment variables in your Vercel project settings:

### Required Variables
```bash
# OpenAI API Key
OPENAI_API_KEY=sk-your-openai-api-key-here

# Authentication Secret (generate new random string)
AUTH_SECRET=your-production-auth-secret-here

# Neon Database Connection
POSTGRES_URL=postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb
```

### Optional Variables
```bash
# Vercel Blob Storage (for file uploads)
BLOB_READ_WRITE_TOKEN=your-blob-token

# Redis Cache (if using Upstash)
REDIS_URL=your-redis-url

# AI Gateway (if using Vercel AI Gateway)
AI_GATEWAY_API_KEY=your-gateway-key
```

## 🚀 Deployment Steps

### Step 1: Connect Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Choose "Next.js" framework

### Step 2: Set Environment Variables
1. In project settings → "Environment Variables"
2. Add all required variables from above
3. Set environment to "Production", "Preview", and "Development"

### Step 3: Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Your app will be available at `https://your-project.vercel.app`

## 🔄 Database Migration

The app automatically runs migrations on first deployment. If you need to run migrations manually:

```bash
# Install Vercel CLI
npm i -g vercel

# Link to your project
vercel link

# Run migrations
vercel env pull .env.local
pnpm db:migrate
```

## 🔍 MCP Configuration for Production

Update your `~/.cursor/mcp.json` for production database access:

```json
{
  "mcpServers": {
    "postgresql-local": {
      "command": "postgres-mcp",
      "args": ["postgresql://postgres:postgres@localhost:5432/postgres"],
      "disabled": false
    },
    "postgresql-production": {
      "command": "postgres-mcp",
      "args": ["postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb"],
      "disabled": false
    },
    "github": {
      "command": "mcp-github",
      "env": { "GITHUB_TOKEN": "your-github-token" },
      "disabled": false
    }
  }
}
```

## 🧪 Testing Production Setup

### 1. Test Database Connection
```bash
# Test with psql
psql "postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb"

# Test with MCP
postgres-mcp "postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb"
```

### 2. Test Application
1. Visit your deployed URL
2. Create a new chat
3. Send a message
4. Check if data is saved in Neon database

## 🔒 Security Best Practices

1. **Never commit secrets** to your repository
2. **Use different AUTH_SECRET** for production
3. **Rotate API keys** regularly
4. **Enable Neon connection pooling** for better performance
5. **Set up Neon backups** for data protection

## 📊 Monitoring & Analytics

### Neon Monitoring
- Monitor database performance in Neon Console
- Set up alerts for connection limits
- Monitor query performance

### Vercel Analytics
- Enable Vercel Analytics for user insights
- Monitor API usage and performance
- Set up error tracking

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check POSTGRES_URL format
   - Verify Neon project is active
   - Check IP allowlist settings

2. **Migration Errors**
   - Ensure database is empty or compatible
   - Check migration file syntax
   - Verify user permissions

3. **Environment Variables Not Loading**
   - Check Vercel environment variable settings
   - Ensure variables are set for correct environment
   - Redeploy after adding variables

### Support Resources
- [Neon Documentation](https://neon.tech/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

## 🎯 Next Steps

1. **Set up custom domain** in Vercel
2. **Configure CDN** for better performance
3. **Set up monitoring** and alerts
4. **Implement backup strategy**
5. **Scale database** as needed

Your Vercel AI Chatbot is now ready for production with Neon database! 🎉
