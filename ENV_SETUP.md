# Environment Setup Guide

## Overview

This project uses environment variables to manage sensitive configuration like API keys. We follow security best practices:

- ✅ `.env.example` - Committed to git (template only, no real secrets)
- ✅ `.env.local` - NOT committed (your local secrets)
- ✅ Vercel Dashboard - Manage production secrets
- ✅ GitHub Actions - (Optional) Use for CI/CD

## Local Development Setup

### Step 1: Copy .env.example to .env.local

```bash
cp .env.example .env.local
```

### Step 2: Add Your API Keys

Edit `.env.local` and replace placeholders:

```env
GROQ_API_KEY=gsk_your_actual_key_here
GROQ_MODEL=qwen/qwen3.6-27b
PORT=3000
NODE_ENV=development
```

### Step 3: Run Locally

```bash
npm install
npm run dev
```

Visit: http://localhost:3000

## Vercel Deployment

### Step 1: Connect GitHub Repository

1. Go to https://vercel.com
2. Click "New Project"
3. Select your GitHub repository: `AI_RAG_ChatBot`
4. Vercel will auto-detect Node.js

### Step 2: Add Environment Variables

In Vercel Dashboard:

1. Go to **Settings → Environment Variables**
2. Add the following variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `GROQ_API_KEY` | Your Groq API key | Production, Preview, Development |
| `GROQ_MODEL` | `qwen/qwen3.6-27b` | Production, Preview, Development |
| `NODE_ENV` | `production` | Production |
| `PORT` | `3000` | All |

### Step 3: Deploy

1. Click "Deploy"
2. Vercel will:
   - Install dependencies
   - Build the project
   - Deploy to live URL
3. Your app will be live at: `https://your-project.vercel.app`

### Step 4: Redeploy on Changes

- Every push to `main` branch = automatic redeploy
- Or manually redeploy from Vercel Dashboard

## GitHub Actions (Optional - for CI/CD)

If you want automatic testing before deployment, create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@v4
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## Environment Variables Explained

### Required Variables

- **GROQ_API_KEY** - Your Groq API key (get from https://console.groq.com)
- **GROQ_MODEL** - The Groq model to use (currently: `qwen/qwen3.6-27b`)

### Optional Variables

- **PORT** - Server port (default: 3000)
- **NODE_ENV** - Environment mode (development/production)
- **MAX_CONTEXT_LENGTH** - Max tokens for context (default: 4000)
- **MAX_TOKENS** - Max response tokens (default: 2048)
- **TOP_K_RESULTS** - Number of documents to retrieve (default: 5)
- **MIN_SIMILARITY_SCORE** - Minimum similarity threshold (default: 0.3)

## Security Best Practices

### ✅ DO

- ✅ Use `.env.local` for local development
- ✅ Add `.env*` to `.gitignore`
- ✅ Use Vercel Dashboard for production secrets
- ✅ Rotate API keys regularly
- ✅ Never share API keys
- ✅ Use different keys for dev/prod

### ❌ DON'T

- ❌ Commit `.env` or `.env.local` files
- ❌ Put real API keys in `.env.example`
- ❌ Share secrets in chat/email/Slack
- ❌ Use development keys in production
- ❌ Hard-code secrets in source code

## Troubleshooting

### "GROQ_API_KEY is not defined"

**Solution:** Make sure `.env.local` exists with your API key

```bash
cp .env.example .env.local
# Edit .env.local and add your Groq API key
```

### "Vercel deployment failed"

**Solution:** Check environment variables in Vercel Dashboard

1. Go to Vercel → Settings → Environment Variables
2. Verify `GROQ_API_KEY` is set
3. Redeploy

### "Works locally but fails on Vercel"

**Solution:** Ensure all environment variables are set in Vercel Dashboard

Different variables can cause different behavior:
- Development: Uses `.env.local`
- Production (Vercel): Uses Dashboard variables

## Getting Groq API Key

1. Visit: https://console.groq.com
2. Sign up (free, no credit card required)
3. Go to API Keys
4. Create new API key
5. Copy and paste into `.env.local`

---

**Questions?** Check `.env.example` for all available variables or visit Groq documentation.
