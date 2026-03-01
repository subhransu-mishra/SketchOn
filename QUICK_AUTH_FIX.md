# Quick Production Auth Test Guide

## The Problem

You're getting this error: `GET https://whiteboard-ai-a5pt.onrender.com/api/diagrams 401 (Unauthorized)`

This means your **production backend** is rejecting authentication tokens.

## Quick Test (5 minutes)

### 1. Test Backend Configuration

Open a new browser tab and go to:

```
https://whiteboard-ai-a5pt.onrender.com/health
```

Look for the `auth` section. It should show:

```json
{
  "auth": {
    "clerkConfigured": true,
    "secretKeyType": "production"
  }
}
```

**If you see:**

- `"clerkConfigured": false` → Missing CLERK_SECRET_KEY
- `"secretKeyType": "development"` → Using test key in production
- `"secretKeyType": "invalid"` → Wrong key format

### 2. Test Configuration endpoint

```
https://whiteboard-ai-a5pt.onrender.com/api/debug/config
```

Should return:

```json
{
  "config": {
    "hasClerkKey": true,
    "clerkKeyType": "production"
  }
}
```

### 3. Check Your Production Environment Variables

Go to your deployment platform (Render/Vercel/Railway/etc.):

1. Find "Environment Variables" or "Config Vars"
2. Look for: `CLERK_SECRET_KEY`
3. Value should start with: `sk_live_`

**If missing or wrong:**

1. Go to [Clerk Dashboard](https://clerk.com/dashboard)
2. Select your app
3. Go to "API Keys"
4. Copy the "Secret Key" (starts with `sk_live_`)
5. Set as `CLERK_SECRET_KEY` in your deployment platform
6. **Restart/redeploy your backend**

## Most Common Fix

**90% of the time, this fixes it:**

1. Set `CLERK_SECRET_KEY=sk_live_YOUR_ACTUAL_KEY` in production
2. Restart backend deployment
3. Test again

## Using the Production Debugger

When you visit your production site, you'll see a red debug panel in the top-right. Click "🔍 Test Production Auth" to see exactly what's happening.

---

**Need help?** Check the detailed guide in `PRODUCTION_AUTH_FIX.md`
