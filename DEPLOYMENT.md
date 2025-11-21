# Vercel Deployment Guide

## Fixed Issues

### 1. 504 Gateway Timeout ✅
**Problem**: API route was timing out after 10 seconds (Vercel default)
**Solution**:
- Added `maxDuration: 300` in [src/app/api/process-invoices/route.ts](src/app/api/process-invoices/route.ts)
- Updated [vercel.json](vercel.json) to configure function timeout to 300 seconds (5 minutes)

### 2. 403 Forbidden on Nutrient Viewer CDN ✅
**Problem**: CDN was returning 403 for version 1.9.0
**Solution**:
- Changed to stable version `1.8.0` in `.env.local` and `vercel.json`
- Moved `<Script>` tag from `<head>` to `<body>` with `strategy="afterInteractive"`
- Removed problematic `<link rel="preload">` that was causing CORS issues

### 3. CORS Preload Warning ✅
**Problem**: Preload link had mismatched credentials mode
**Solution**:
- Removed preload link entirely (causes more issues than it solves)
- Kept DNS prefetch and preconnect for performance
- Let Next.js Script component handle loading naturally

## Environment Variables Required in Vercel

Go to your Vercel project settings → Environment Variables and add:

```bash
NUTRIENT_AUTH_TOKEN=D5866799-4283-45DF-9E3A-263D4EDE07A3
NEXT_PUBLIC_NUTRIENT_API_URL=https://api.xtractflow.com
NEXT_PUBLIC_WEB_SDK_VERSION=1.8.0
```

## Vercel Plan Requirements

- **Hobby Plan**: Maximum `maxDuration` is 60 seconds (won't work for 11 invoices)
- **Pro Plan**: Maximum `maxDuration` is 300 seconds (5 minutes) ✅ Recommended

If you're on the Hobby plan, you have two options:
1. Upgrade to Pro plan
2. Reduce the number of invoices processed or implement a queue/background job system

## Files Modified

1. [src/app/api/process-invoices/route.ts](src/app/api/process-invoices/route.ts) - Added route config
2. [src/app/layout.tsx](src/app/layout.tsx) - Fixed script loading
3. [vercel.json](vercel.json) - Added function timeout configuration
4. [.env.local](.env.local) - Updated SDK version to 1.8.0

## Deployment Steps

1. Commit all changes:
   ```bash
   git add .
   git commit -m "fix: resolve Vercel deployment timeout and CDN errors"
   git push
   ```

2. Vercel will automatically deploy

3. Verify environment variables are set in Vercel dashboard

4. Test the deployment at your Vercel URL

## Testing After Deployment

1. Visit `/preview` page
2. Click "Process All Invoices"
3. Wait for processing (should take ~60-90 seconds for 11 invoices)
4. Check browser console - should see no 403 or 504 errors
5. Verify results page shows extracted invoice data

## Known Limitations

- Processing 11 invoices takes ~60-90 seconds
- Requires Vercel Pro plan for longer timeout
- First load might be slower due to cold start
