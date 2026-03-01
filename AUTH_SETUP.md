# Authentication Setup Guide

## Production Environment Variables

### Backend (.env)

```bash
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/whiteboard-ai

# Clerk Authentication
CLERK_SECRET_KEY=sk_live_YOUR_PRODUCTION_SECRET_KEY_HERE

# Server Configuration
PORT=4000
NODE_ENV=production
```

### Frontend Environment Variables

```bash
# Clerk Publishable Key
VITE_CLERK_PUBLISHABLE_KEY=pk_live_YOUR_PUBLISHABLE_KEY_HERE

# API Base URL (for production)
VITE_API_BASE_URL=https://whiteboard-ai-a5pt.onrender.com/api
```

## Development Environment Variables

### Backend (.env)

```bash
# MongoDB Connection (Local)
MONGODB_URI=mongodb://localhost:27017/whiteboard-ai

# Clerk Authentication (Test Keys)
CLERK_SECRET_KEY=sk_test_YOUR_TEST_SECRET_KEY_HERE

# Server Configuration
PORT=4000
NODE_ENV=development
```

### Frontend Environment Variables (.env)

```bash
# Clerk Publishable Key (Test)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_TEST_PUBLISHABLE_KEY_HERE

# API Base URL (for local development)
VITE_API_BASE_URL=http://localhost:4000/api
```

## Troubleshooting Authentication Issues

1. **401 Unauthorized Errors**:
   - Check that CLERK_SECRET_KEY is correctly set in production
   - Verify the secret key matches your Clerk application
   - Ensure the key starts with `sk_live_` for production

2. **Frontend Auth Issues**:
   - Check VITE_CLERK_PUBLISHABLE_KEY is set
   - Verify the publishable key matches your Clerk application
   - Make sure the key starts with `pk_live_` for production

3. **CORS Issues**:
   - Verify your production frontend domain is in the CORS allowlist
   - Check that API_BASE_URL points to the correct backend URL

4. **Token Issues**:
   - Check browser network tab for auth token in request headers
   - Verify token format: "Bearer <jwt_token>"
   - Test auth with debug endpoint: POST /api/debug/auth-test

## Clerk Dashboard Configuration

1. Go to https://clerk.com/dashboard
2. Select your application
3. Go to "API Keys" section
4. Copy the "Secret Key" for backend
5. Copy the "Publishable Key" for frontend
6. Set these in your environment variables

## Deployment Checklist

- [ ] Set CLERK_SECRET_KEY in production environment
- [ ] Set VITE_CLERK_PUBLISHABLE_KEY in frontend build
- [ ] Configure MONGODB_URI for production database
- [ ] Update CORS settings for production domain
- [ ] Verify API_BASE_URL points to production backend
- [ ] Test authentication flow in production

## Common Issues

**User sees "Authentication not initialized"**:

- Auth hook may not be set up properly
- User might not be fully signed in
- Check React useEffect dependencies

**500 errors on auth**:\*\*

- Missing or incorrect CLERK_SECRET_KEY
- Database connection issues
- Check server logs for detailed errors

**Infinite loading on dashboard**:

- Auth state not properly initialized
- API calls failing due to network/CORS
- Check browser developer tools for errors
