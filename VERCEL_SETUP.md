# Vercel Deployment Guide for AI RAG Chatbot

## Issue: Data Loss on Vercel

Vercel serverless functions don't have persistent file storage. Each request gets a fresh environment, causing:
- ❌ "Unexpected token" JSON parsing errors
- ❌ Document uploads not persisting
- ❌ Data loss between requests

## Solution: Use Vercel KV (Redis)

### Step 1: Add Vercel KV to Your Project

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Storage** tab
4. Click **Create** → **KV** (or use Upstash Redis)
5. Follow the prompts to create a new KV store

### Step 2: Update Environment Variables

After creating KV, Vercel automatically adds these env vars:
- `KV_URL`
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`

These will be automatically available in your deployment.

### Step 3: Deploy with Storage

1. Commit your changes:
```bash
git add .
git commit -m "Add Vercel KV storage adapter for persistent data"
git push
```

2. Vercel will automatically redeploy with the new storage configuration

### Step 4: Verify It's Working

After deployment:
1. Visit https://your-app.vercel.app
2. Upload a document
3. Reload the page - document should still be there ✅
4. No more "Unexpected token" errors ✅

## Deployment Checklist

- [ ] Created Vercel KV store in project
- [ ] Environment variables are set (auto-configured by Vercel)
- [ ] Committed storage adapter changes
- [ ] Pushed to main branch
- [ ] Vercel deployment completed
- [ ] Tested document upload persistence
- [ ] Tested on fresh page reload

## Fallback: In-Memory Storage

If you don't want to set up KV:
- Data persists within a single function execution
- Data is lost on new deployments or cold starts
- Suitable for testing/demo only, not production

## Local Development

Local development uses file system storage by default:
```bash
npm run dev
```

All data is persisted in `data/documents.json` and `data/embeddings.json`

## Troubleshooting

### Data still not persisting

1. Check that KV store is created in Vercel dashboard
2. Verify env vars are set (Settings → Environment Variables)
3. Check function logs in Vercel deployment
4. Redeploy after adding KV

### "Unexpected token" errors

This indicates storage adapter isn't initialized. Check logs for:
```
✅ Using Vercel KV Redis for storage
✅ Using local file system storage
⚠️  Running on Vercel without KV storage
```

### Can't upload documents

1. Check GROQ_API_KEY is set
2. Check file size isn't too large (limit: 10MB)
3. Check browser console for errors
4. Verify API endpoint responds: `curl https://your-app.vercel.app/api/documents`
