# 🚀 Deployment Guide

This guide explains how to deploy your AI Chatbot to Vercel with environment variable management.

## 📋 Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **Neon Database** - Sign up at [neon.tech](https://neon.tech)
3. **OpenAI API Key** - Get from [platform.openai.com](https://platform.openai.com/api-keys)

## 🔧 Environment Variables Setup

### Option 1: One-Time Setup (Recommended)

Run the setup script to configure environment variables in Vercel:

```bash
npm run deploy:setup
```

This will prompt you for:
- Neon PostgreSQL connection string
- AUTH_SECRET (auto-generated if not provided)
- OpenAI API key
- Optional Vercel Blob token

### Option 2: Manual Setup

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add the following variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `POSTGRES_URL` | Neon database connection string | `postgresql://user:pass@ep-xxx.neon.tech/db` |
| `AUTH_SECRET` | Authentication secret | `ZAPVY2BJuwb9Bpkqk/ovavLlQHB7smIqqgw/pMhYXyA=` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-your-openai-api-key-here` |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token (optional) | `vercel_blob_xxx` |

## 🚀 Deployment Commands

### Quick Deploy
```bash
npm run deploy
```

### Manual Deploy
```bash
npm run vercel:deploy
```

### Preview Deploy
```bash
npm run vercel:preview
```

## 🔄 Environment Variable Management

### Pull from Vercel
```bash
npm run vercel:env:pull
```

### Add New Variable
```bash
npm run vercel:env:push
```

## 🏠 Local Development Setup

Set up local environment variables:

```bash
npm run setup:local
```

This creates a `.env.local` file with:
- Local PostgreSQL connection
- Generated AUTH_SECRET
- Your OpenAI API key
- Local NextAuth URL

## 📁 File Structure

```
scripts/
├── deploy.sh          # Main deployment script
├── setup-env.sh        # Vercel environment setup
└── setup-local.sh      # Local environment setup

env.example             # Environment variables template
```

## 🔒 Security Notes

- **Never commit** `.env.local` or `.env.production` files
- **Environment variables** are stored securely in Vercel
- **AUTH_SECRET** should be unique for each environment
- **API keys** should be kept private

## 🐛 Troubleshooting

### Build Errors
```bash
npm run build
```

### Check Environment Variables
```bash
vercel env ls
```

### View Deployment Logs
Check your Vercel dashboard → Functions → View Function Logs

## 📞 Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Neon Docs**: [neon.tech/docs](https://neon.tech/docs)
- **OpenAI Docs**: [platform.openai.com/docs](https://platform.openai.com/docs)
