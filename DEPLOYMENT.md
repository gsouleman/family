# Deployment Guide - Render.com

## Overview

This application consists of **two separate services** deployed on Render.com:
1. **Backend** - Node.js/Express API server (port 3000)
2. **Frontend** - Static files served via Express (port varies)

## Prerequisites

- GitHub repository: `https://github.com/gsouleman/family`
- Neon.tech PostgreSQL database
- Render.com account

## Service Configuration

### Backend Service (family-assets-backend)

**Service Type:** Web Service  
**Runtime:** Node  
**Root Directory:** `server`

**Build Command:**
```bash
npm install && npx prisma generate && npx prisma migrate deploy && npm run build
```

**Start Command:**
```bash
npm start
```

**Environment Variables:**
- `NODE_ENV` = `production`
- `DATABASE_URL` = Your Neon PostgreSQL connection string

**Important:** The DATABASE_URL should be in the format:
```
postgresql://user:password@host/database?sslmode=require
```

### Frontend Service (family-assets-frontend)

**Service Type:** Web Service  
**Runtime:** Node  
**Root Directory:** `.` (project root)

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npm start
```

**Environment Variables:**
- `VITE_API_URL` = Auto-populated from backend service (or `https://family-assets-backend.onrender.com`)
- `BACKEND_URL` = `https://family-assets-backend.onrender.com`

## Deployment Steps

### 1. Deploy Backend Service First

1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name:** `family-assets-backend`
   - **Root Directory:** `server`
   - **Build Command:** `npm install && npx prisma generate && npx prisma migrate deploy && npm run build`
   - **Start Command:** `npm start`
5. Add environment variables:
   - `NODE_ENV` = `production`
   - `DATABASE_URL` = (paste your Neon connection string)
6. Click **Create Web Service**
7. Wait for deployment to complete
8. Test: `https://family-assets-backend.onrender.com/api/health`

### 2. Deploy Frontend Service

1. Click **New +** → **Web Service**
2. Connect the same GitHub repository
3. Configure:
   - **Name:** `family-assets-frontend`
   - **Root Directory:** `.` (leave empty or put `/`)
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
4. Add environment variables:
   - `BACKEND_URL` = `https://family-assets-backend.onrender.com`
   - `VITE_API_URL` = `https://family-assets-backend.onrender.com`
5. Click **Create Web Service**
6. Wait for deployment to complete
7. Access your app: `https://family-assets-frontend.onrender.com`

## Using render.yaml (Recommended)

The repository includes a `render.yaml` file that automatically configures both services. To use it:

1. Go to **Dashboard** → **Blueprints**
2. Click **New Blueprint Instance**
3. Connect your repository
4. Render will detect `render.yaml` and create both services
5. Set the `DATABASE_URL` environment variable for the backend service
6. Deploy

## Common Issues & Troubleshooting

### Issue: "tsx: not found" Error

**Cause:** Build command is using `npm run dev:all` instead of production build commands.

**Fix:**
1. Go to service **Settings** → **Build & Deploy**
2. Verify Build Command is: `npm install && npm run build`
3. Verify Start Command is: `npm start`
4. **NOT**: `npm run dev:all` (this is for local development only)
5. Save changes and trigger manual deployment

### Issue: Backend Build Fails

**Possible causes:**
- Missing `DATABASE_URL` environment variable
- Wrong root directory (should be `server`)
- Prisma generation failed

**Fix:**
1. Check environment variables are set correctly
2. Verify root directory is `server` for backend
3. Check build logs for specific error messages
4. Ensure `DATABASE_URL` is in correct format

### Issue: Frontend Can't Connect to Backend

**Cause:** Environment variables not set correctly.

**Fix:**
1. Verify `BACKEND_URL` points to backend service
2. Check `VITE_API_URL` is set (or will use `/api` which proxies to `BACKEND_URL`)
3. Ensure backend service is deployed and running
4. Check `server.js` proxy configuration

### Issue: Database Connection Fails

**Cause:** Wrong connection string or database not accessible.

**Fix:**
1. Verify your Neon database is active
2. Check connection string format
3. Ensure IP whitelisting allows Render's IPs (if configured)
4. Test connection: `/api/debug/db` endpoint

## Environment Variables Reference

### Backend (`family-assets-backend`)

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | Yes | `production` | Node environment |
| `DATABASE_URL` | Yes | `postgresql://user:pass@host/db?sslmode=require` | Neon database connection |

### Frontend (`family-assets-frontend`)

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `BACKEND_URL` | Yes | `https://family-assets-backend.onrender.com` | Backend API URL |
| `VITE_API_URL` | Optional | Same as BACKEND_URL | Used for API proxy |

## Monitoring & Logs

### View Logs
1. Go to service dashboard
2. Click **Logs** tab
3. Monitor deployment and runtime logs

### Health Checks

- **Backend:** `https://family-assets-backend.onrender.com/api/health`
  - Should return: `{"status":"ok","timestamp":"...","version":"1.2.3"}`

- **Frontend:** `https://family-assets-frontend.onrender.com`
  - Should load the application


## Updating Deployment

### Via Git Push

1. Make changes locally
2. Commit and push to `main` branch
3. Render auto-deploys on push (if auto-deploy is enabled)

### Manual Deploy

1. Go to service dashboard
2. Click **Manual Deploy** → **Deploy latest commit**
3. Or click **Clear build cache & deploy** for clean build

## Performance Tips

1. **Enable Auto-Deploy** for automatic deployments on push
2. **Use Persistent Disk** if you need file storage
3. **Monitor Build Times** - optimize dependencies if builds are slow
4. **Check Logs Regularly** for errors or warnings

## Support

- **Render Status:** https://status.render.com
- **Documentation:** https://render.com/docs
- **Community:** https://community.render.com

## Quick Reference Commands

```bash
# Test backend locally
cd server
npm install
npm run build
npm start

# Test frontend locally  
npm install
npm run build
npm start
```

Remember: **Never use `npm run dev` or `npm run dev:all` in production!**
