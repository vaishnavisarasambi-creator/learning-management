# LMS - Learning Management System

A full-stack learning management system built with Next.js and Express.

## 🚀 Deployment

### Frontend (Vercel)

1. Push code to GitHub (already done)
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_API_URL` = Your backend API URL

### Backend (Render/Railway/Heroku)

1. Deploy backend separately
2. Get the production URL
3. Update frontend's `NEXT_PUBLIC_API_URL` environment variable

## 🛠️ Local Development

```bash
# Install dependencies
cd frontend && npm install
cd backend && npm install

# Start backend
cd backend
npm run dev

# Start frontend (new terminal)
cd frontend
npm run dev
```

Visit http://localhost:3000

## 📦 Features

- User authentication (JWT)
- Course management
- Sequential learning with locked lessons
- Progress tracking
- YouTube video integration
