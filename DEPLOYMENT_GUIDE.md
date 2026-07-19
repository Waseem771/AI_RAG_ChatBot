# Deployment Guide - GitHub & Vercel

## Quick Start Deployment

### 1. GitHub Repository ✅
Your code is hosted at: https://github.com/Waseem771/AI_RAG_ChatBot

### 2. Vercel Deployment

#### Prerequisites
- GitHub account with your repository
- Vercel account (free at https://vercel.com)
- Groq API key (free at https://console.groq.com)

#### Deployment Steps

**Step 1: Connect to Vercel**

1. Visit https://vercel.com
2. Click "New Project"
3. Click "Import Git Repository"
4. Search for and select: `AI_RAG_ChatBot`
5. Click "Import"

**Step 2: Configure Environment Variables**

Vercel will show you a configuration screen:

1. Under "Environment Variables", add:
   - Name: `GROQ_API_KEY`
   - Value: `gsk_your_actual_key_here`
   - Environments: Select all (Production, Preview, Development)
   - Click "Add"

2. Add more variables if needed:
   - `GROQ_MODEL`: `qwen/qwen3.6-27b`
   - `NODE_ENV`: `production`
   - `PORT`: `3000`

**Step 3: Deploy**

1. Click "Deploy"
2. Wait for build to complete (~2-3 minutes)
3. Once done, you'll get a live URL: `https://your-project.vercel.app`

#### Auto-Deployment

Every time you push to `main` branch:
- Vercel automatically detects the change
- Builds and deploys your app
- You'll get a deployment confirmation email

#### Manual Redeploy

If needed, redeploy from Vercel Dashboard:
1. Go to Vercel → Your Project
2. Click "Deployments"
3. Find your deployment
4. Click "Redeploy"

## Environment Variables Reference

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| GROQ_API_KEY | ✅ Yes | - | Groq API authentication key |
| GROQ_MODEL | ✅ Yes | qwen/qwen3.6-27b | AI model to use |
| PORT | No | 3000 | Server port |
| NODE_ENV | No | development | Environment (development/production) |
| MAX_CONTEXT_LENGTH | No | 4000 | Max context tokens |
| MAX_TOKENS | No | 2048 | Max response tokens |
| TOP_K_RESULTS | No | 5 | Documents to retrieve |
| MIN_SIMILARITY_SCORE | No | 0.3 | Minimum relevance score |

## Local Development vs Production

### Local (.env.local)
```env
GROQ_API_KEY=your_dev_key
NODE_ENV=development
PORT=3000
```

### Production (Vercel Dashboard)
```env
GROQ_API_KEY=your_prod_key
NODE_ENV=production
PORT=3000
```

## Troubleshooting

### Deployment Failed: "Missing GROQ_API_KEY"

**Solution:**
1. Go to Vercel → Project Settings → Environment Variables
2. Verify `GROQ_API_KEY` is set
3. Redeploy

### Build Error: "Cannot find module"

**Solution:**
1. Check `package.json` is in root directory
2. Ensure `npm install` can run
3. Verify Node version compatibility (18+)

### App runs locally but fails on Vercel

**Solution:**
1. Ensure all environment variables are set in Vercel
2. Check `vercel.json` configuration
3. View deployment logs in Vercel Dashboard

### "GROQ_API_KEY is undefined" on live site

**Solution:**
1. Verify environment variables in Vercel Settings
2. Make sure it's set for Production environment
3. Redeploy after adding variables

## Getting Groq API Key

1. Visit: https://console.groq.com
2. Sign up (free)
3. Go to "API Keys"
4. Click "Create API Key"
5. Copy the key: `gsk_...`
6. Add to Vercel environment variables

## CI/CD Pipeline (Optional)

### Auto-test before deploy

Create `.github/workflows/test.yml`:

```yaml
name: Test

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
```

## Performance Tips

### Reduce Cold Starts
- Keep function size small
- Minimize dependencies
- Use efficient code

### Optimize Build
- Use production builds
- Enable caching
- Compress assets

## Monitoring

### Vercel Monitoring
1. Go to Vercel Dashboard
2. View real-time logs
3. Check performance metrics
4. Monitor errors

### Application Logs
- Check `/health` endpoint
- Monitor API responses
- Track document uploads

## Rollback

If deployment breaks:
1. Go to Vercel → Deployments
2. Find previous working version
3. Click "Redeploy"
4. Instant rollback!

## Support

- **Groq Issues:** https://console.groq.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **GitHub Help:** https://docs.github.com

---

**Your live application will be automatically updated whenever you push to GitHub!**
