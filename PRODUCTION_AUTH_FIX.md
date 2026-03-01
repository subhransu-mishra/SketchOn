# 🚨 Production Authentication Fix Guide

## Understanding the Error

The error `GET https://whiteboard-ai-a5pt.onrender.com/api/diagrams 401 (Unauthorized)` indicates that your **production backend** is rejecting authentication tokens from your **production frontend**.

## Root Cause Analysis

The error shows:

- ✅ Frontend is successfully deployed and running
- ✅ Frontend can reach the backend API
- ❌ Backend is rejecting the authentication token
- ❌ This suggests environment configuration issues

## Step-by-Step Fix

### 1. Check Backend Environment Variables (CRITICAL)

Your **production backend** must have these environment variables set:

```bash
# In your render.com or deployment platform dashboard
CLERK_SECRET_KEY=sk_live_YOUR_ACTUAL_PRODUCTION_SECRET_KEY
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/whiteboard-ai
NODE_ENV=production
```

**🔧 How to fix:**

1. Go to your deploy platform (Render/Vercel/etc.)
2. Navigate to Environment Variables
3. Set `CLERK_SECRET_KEY` with your **LIVE** secret key (starts with `sk_live_`)

### 2. Check Frontend Environment Variables

Your **production frontend** build must have:

```bash
# In your frontend build environment
VITE_CLERK_PUBLISHABLE_KEY=pk_live_YOUR_ACTUAL_PRODUCTION_PUBLISHABLE_KEY
```

### 3. Verify Clerk Configuration

1. Go to [Clerk Dashboard](https://clerk.com/dashboard)
2. Select your application
3. Go to **"API Keys"** section
4. Copy the **"Secret Key"** (starts with `sk_live_`)
5. Copy the **"Publishable Key"** (starts with `pk_live_`)

### 4. Common Production Issues

#### Issue: Using Test Keys in Production

```bash
# ❌ Wrong - Test keys in production
CLERK_SECRET_KEY=sk_test_...

# ✅ Correct - Live keys in production
CLERK_SECRET_KEY=sk_live_...
```

#### Issue: Missing Environment Variables

The backend logs will show:

```
Clerk secret key not configured
```

#### Issue: Wrong Domain Configuration

1. In Clerk Dashboard → **"Settings"** → **"Domains"**
2. Add your production domain (e.g., `yourapp.onrender.com`)

### 5. Debug Using Production Debugger

I've added a **ProductionAuthDebugger** component that will appear when you visit your production site:

1. Visit your production website
2. Look for a red debug panel in the top-right corner
3. Click **"🔍 Test Production Auth"**
4. This will show you exactly what's happening

### 6. Backend Debug Logs

Check your production backend logs for:

```bash
# Good - Auth working
Auth middleware called: { hasAuth: true, nodeEnv: 'production' }
Clerk auth successful, user ID: user_xyz123

# Bad - Missing token
Auth middleware called: { hasAuth: false, nodeEnv: 'production' }
Clerk auth error: Invalid token

# Bad - Missing secret key
Clerk secret key not configured
```

### 7. Quick Test Commands

#### Test Backend Health

```bash
curl https://whiteboard-ai-a5pt.onrender.com/health
```

#### Test Frontend Auth (in browser console)

```javascript
// Check if Clerk is loaded
console.log(window.Clerk);

// Get current user
console.log(await window.Clerk.user);

// Get token
console.log(await window.Clerk.session.getToken());
```

## Production Environment Variable Template

Copy this template and fill in your actual values:

### Backend (.env or Environment Variables)

```bash
MONGODB_URI=mongodb+srv://[USERNAME]:[PASSWORD]@[CLUSTER].mongodb.net/whiteboard-ai
CLERK_SECRET_KEY=sk_live_[YOUR_SECRET_KEY]
NODE_ENV=production
PORT=4000
```

### Frontend Build Environment

```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_live_[YOUR_PUBLISHABLE_KEY]
VITE_API_BASE_URL=https://whiteboard-ai-a5pt.onrender.com/api
```

## Verification Checklist

- [ ] Production backend has `CLERK_SECRET_KEY` environment variable
- [ ] Secret key starts with `sk_live_` (not `sk_test_`)
- [ ] Frontend built with `VITE_CLERK_PUBLISHABLE_KEY`
- [ ] Publishable key starts with `pk_live_` (not `pk_test_`)
- [ ] Production domain added to Clerk dashboard
- [ ] MongoDB URI is correct for production database
- [ ] Backend deployment is successful and running

## Still Not Working?

If you're still seeing 401 errors after setting the environment variables:

1. **Restart your backend deployment** after setting environment variables
2. **Rebuild and redeploy your frontend** with correct environment variables
3. Use the **ProductionAuthDebugger** component to see detailed auth info
4. Check backend logs for specific error messages

## Emergency Backup Solution

If you need a quick fix while debugging, you can temporarily enable a bypass:

```javascript
// In backend/middleware/clerkAuth.js - TEMPORARY ONLY
if (process.env.EMERGENCY_BYPASS === "true") {
  req.auth = { userId: "temp-user" };
  req.clerkUserId = "temp-user";
  return next();
}
```

**⚠️ WARNING: Remove this before going live!**

---

The most common cause is **missing or incorrect CLERK_SECRET_KEY** in production. Set this environment variable and redeploy your backend.
