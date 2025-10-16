# Manual Netlify Deployment Guide

## Option 1: Automatic Deployment (Recommended)
1. Go to [app.netlify.com](https://app.netlify.com)
2. Find your site "narvar-returns-intelligence-dashboard"
3. Go to "Deploys" tab
4. Click "Trigger deploy" → "Deploy site"

## Option 2: Manual Upload
1. Go to [app.netlify.com](https://app.netlify.com)
2. Find your site "narvar-returns-intelligence-dashboard"
3. Go to "Deploys" tab
4. Drag and drop the entire `build/` folder to the deploy area

## Option 3: Netlify CLI (if installed)
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

## What to Expect After Deployment
- Version dropdown should show "RI V1" and "RI V2" (no V3)
- Both versions should have version toggles
- Subtitles should show "RI V1" and "RI V2"
