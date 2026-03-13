# Backend Deployment Guide

## Deploy to Render (Free)

### 1. Create Web Service
1. Go to https://render.com and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: `vaishnavisarasambi-creator/learning-management`

### 2. Configure Service
- **Name**: `lms-backend`
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `node dist/server.js`

### 3. Environment Variables
Add these in Render dashboard:

```
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-long
DATABASE_URL=sqlite:./dev.db
PORT=10000
```

### 4. Database Setup
Render uses ephemeral filesystem, so you need persistent storage:

**Option A: Use Render PostgreSQL (Recommended)**
1. Create new PostgreSQL database on Render
2. Get the connection URL
3. Update `DATABASE_URL` environment variable
4. Run migrations: `npx prisma migrate deploy`

**Option B: Use SQLite with persistent disk**
1. Add a persistent disk in Render dashboard
2. Mount path: `/backend/prisma`
3. Update DATABASE_URL: `file:/backend/prisma/dev.db`

### 5. Deploy
Click "Create Web Service" - it will deploy automatically!

### 6. Get Your URL
After deployment, you'll get a URL like:
```
https://lms-backend-xyz.onrender.com
```

### 7. Update Frontend
In Vercel dashboard, set:
```
NEXT_PUBLIC_API_URL=https://lms-backend-xyz.onrender.com/api
```

## Alternative: Deploy to Railway

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Set Root Directory: `backend`
5. Add environment variables
6. Deploy!

## Test Your Backend

Visit: `https://your-backend-url.onrender.com/api/health`

Should return: `{"status":"ok"}`
