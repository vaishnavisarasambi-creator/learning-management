# Render Deployment Script

## Quick Deploy Steps

### 1. Sign up to Render
- Go to https://render.com
- Click "Get Started for Free"
- Sign up with GitHub (recommended) or email

### 2. Create Web Service
1. Click **"New +"** button
2. Select **"Web Service"**
3. Click **"Connect a repository"**
4. Find and select: `vaishnavisarasambi-creator/learning-management`

### 3. Configure Service Settings

Fill in these fields:

| Field | Value |
|-------|-------|
| **Name** | `lms-backend` (or any name you like) |
| **Region** | Choose closest to your users |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `node dist/server.js` |
| **Instance Type** | `Free` |

### 4. Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** and add:

```
NODE_ENV=production
JWT_SECRET=your-very-secret-jwt-key-min-32-characters-long-random-string
DATABASE_URL=file:./prisma/dev.db
PORT=10000
```

**Important:** For `JWT_SECRET`, generate a random string. You can use:
- https://generate-secret.vercel.app/32
- Or run: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### 5. Add Persistent Disk (IMPORTANT!)

Since Render's free tier has ephemeral storage, you need a persistent disk:

1. Scroll down to **"Persistent Disk"** section
2. Click **"Add Persistent Disk"**
3. Configure:
   - **Mount Path**: `/backend/prisma`
   - **Size**: `1 GB` (free tier)
4. Click **"Save"**

This ensures your database is not deleted on every deployment!

### 6. Deploy!

1. Click **"Create Web Service"**
2. Wait for deployment (2-5 minutes)
3. Once deployed, you'll see a green checkmark ✅

### 7. Get Your Backend URL

Your backend will be available at:
```
https://lms-backend-xyz.onrender.com
```

Copy this URL!

### 8. Test the Backend

Visit in browser:
```
https://lms-backend-xyz.onrender.com/api/health
```

You should see:
```json
{"status":"ok"}
```

### 9. Update Frontend on Vercel

1. Go to https://vercel.com/dashboard
2. Select your `learning-management` project
3. Click **"Settings"** tab
4. Click **"Environment Variables"**
5. Click **"Add Environment Variable"**
6. Add:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://lms-backend-xyz.onrender.com/api`
   - (Replace with YOUR actual backend URL)
7. Click **"Save"**
8. Go to **"Deployments"** tab
9. Click **"Redeploy"** on the latest deployment

### 10. Test Your Full App!

Visit your Vercel URL:
```
https://learning-management-sable.vercel.app
```

It should now work with the backend! 🎉

---

## Troubleshooting

### Backend shows "Application Not Found" on Render
- Make sure Root Directory is set to `backend`
- Check deployment logs for errors

### Database errors
- Verify persistent disk is mounted at `/backend/prisma`
- Check DATABASE_URL path matches mount path

### CORS errors
- Backend already allows all origins (configured in app.ts)
- Make sure API URL is correct in frontend

### Can't connect to database
- Run migrations manually via Render shell:
  ```
  cd backend
  npx prisma migrate deploy
  npx prisma db seed
  ```

---

## Alternative: Railway Deployment (Easier!)

If Render seems complex, try Railway:

1. Go to https://railway.app
2. Click **"Start a New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository
5. Click **"..."** → **"Edit Project"**
6. Set **Root Directory**: `backend`
7. Add environment variables (same as Render)
8. Railway auto-deploys!

Railway gives you $5/month free credits, which is enough for a small backend.
