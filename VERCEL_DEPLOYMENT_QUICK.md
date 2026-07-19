# 🚀 Vercel Deployment - Quick Guide

## Fix Applied ✅

The `vercel.json` configuration has been fixed to remove secret references that were causing deployment errors.

## Deploy Now in 3 Steps

### Step 1: Go to Vercel New Project
```
https://vercel.com/new
```

### Step 2: Import Your GitHub Repository

1. Click "Import Git Repository"
2. Search for: `AI_RAG_ChatBot` 
3. Select: `Waseem771/AI_RAG_ChatBot`
4. Click "Import"

### Step 3: Configure & Deploy

**Project Name:**
- Use: `ai-rag-chatbot-waseem` (or your preferred name)
- **NOT** `ai-rag-chat-bot-yfx3` (that one already exists)

**Environment Variables:**
Add these in the Environment Variables section:

1. **GROQ_API_KEY**
   - Name: `GROQ_API_KEY`
   - Value: `gsk_your_actual_key_here` (from https://console.groq.com)
   - Environments: Select all (Production, Preview, Development)

2. **GROQ_MODEL**
   - Name: `GROQ_MODEL`
   - Value: `qwen/qwen3.6-27b`
   - Environments: Select all

3. **NODE_ENV** (Optional but recommended)
   - Name: `NODE_ENV`
   - Value: `production`
   - Environments: Production only

**Deploy:**
- Click the "Deploy" button
- Wait for build to complete (2-3 minutes)
- ✅ Your app is LIVE!

## What to Expect

- **Build Time:** 2-3 minutes
- **Deploy URL:** `https://your-project-name.vercel.app`
- **Auto-redeployment:** Every push to `main` branch triggers automatic deployment

## Troubleshooting

### Error: "Environment Variable references Secret which does not exist"

**Solution:** 
- Make sure you're entering actual values, NOT references like `@groq_api_key`
- Use your real Groq API key: `gsk_...`

### Deployment Still Fails

1. Check build logs in Vercel Dashboard
2. Verify all environment variables are set
3. Ensure GitHub repo is connected properly
4. Try redeploying from Vercel Dashboard

### App Deploys but Shows Errors

1. Check application logs in Vercel
2. Verify GROQ_API_KEY is correct
3. Check if Groq API key is still valid

## Success Indicators

When deployment succeeds, you should see:
- ✅ Green checkmark in Vercel Dashboard
- ✅ Live URL: `https://your-project.vercel.app`
- ✅ Can upload documents
- ✅ Can ask questions
- ✅ Get AI responses

## After Deployment

### Continuous Updates
Every time you push to `main` branch:
```bash
git push origin main
```
Vercel automatically redeploys!

### Monitor Your App
- Check Vercel Dashboard for logs
- Monitor error rates
- Track API usage

### Custom Domain (Optional)
In Vercel Settings → Domains:
- Add your own domain
- Connect to your Vercel project

---

**You're all set! Deploy now and your AI RAG Chatbot will be live in minutes!** 🎉
