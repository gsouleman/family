# Family Assets Sharing - Development Guide

## Running the Application Locally

This application consists of two parts:
1. **Frontend** (Vite + React) - Runs on port 8080
2. **Backend** (Node.js + Express + Prisma) - Runs on port 3000

### Quick Start (Recommended)

Run both servers together with a single command:

```bash
npm run dev:all
```

This will start:
- **Frontend** (blue prefix): Vite dev server on http://localhost:8080
- **Backend** (green prefix): Express API server on http://localhost:3000

### Individual Commands

If you need to run servers separately:

```bash
# Frontend only
npm run dev

# Backend only  
npm run dev:backend

# Or navigate to server directory
cd server
npm run dev
```

### Viewing the Application

Once both servers are running, open your browser to:
**http://localhost:8080**

The frontend will proxy all `/api/*` requests to the backend on port 3000.

### Stopping the Servers

Press `Ctrl+C` in the terminal to stop both servers.

## Troubleshooting

### "Failed to update user profile" Error

**Cause**: Backend server is not running
**Solution**: Make sure you're using `npm run dev:all` to run both servers

### Port Already in Use

If you get an error that port 3000 or 8080 is already in use:

```bash
# Windows - Find and kill process on port
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Database Connection Issues

Make sure your `.env` file contains:
```
DATABASE_URL="your_neon_database_url"
```

## Available Scripts

- `npm run dev` - Start frontend only (Vite)
- `npm run dev:backend` - Start backend only
- `npm run dev:all` - **Start both frontend and backend**
- `npm run build` - Build frontend for production
- `npm start` - Start production server
