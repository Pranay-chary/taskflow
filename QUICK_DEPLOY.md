# 🚀 Quick Deployment Checklist

Follow these steps in order to deploy TaskFlow:

## ✅ Pre-Deployment Checklist

- [ ] Code is pushed to GitHub
- [ ] MongoDB Atlas database is set up and accessible
- [ ] You have accounts on Vercel and Render

---

## 📦 Backend Deployment (Render)

### Step 1: Deploy Backend
1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Configure:
   - **Name**: `taskflow-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### Step 2: Set Environment Variables
Add these in Render's Environment tab:
```
MONGODB_URI=your_mongodb_connection_string
PORT=10000
NODE_ENV=production
FRONTEND_URL=https://placeholder.vercel.app
```
*(Update FRONTEND_URL after frontend deployment)*

### Step 3: Deploy & Get URL
- Click "Create Web Service"
- Wait for deployment
- **Copy the backend URL**: `https://your-backend.onrender.com`

---

## 🌐 Frontend Deployment (Vercel)

### Step 1: Deploy Frontend
1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import GitHub repository
4. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite (auto-detected)

### Step 2: Set Environment Variable
Add in Vercel's Environment Variables:
```
VITE_API_URL=https://your-backend.onrender.com/api
```
*(Use the backend URL from Step 3 above)*

### Step 3: Deploy & Get URL
- Click "Deploy"
- Wait for deployment
- **Copy the frontend URL**: `https://your-app.vercel.app`

---

## 🔄 Update Backend CORS

1. Go back to Render dashboard
2. Update `FRONTEND_URL` environment variable:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
   *(Use the frontend URL from above)*
3. Redeploy backend (or wait for auto-redeploy)

---

## ✅ Verify Deployment

1. **Test Backend**: Visit `https://your-backend.onrender.com/api/health`
   - Should return: `{"message": "Server is running"}`

2. **Test Frontend**: Visit `https://your-app.vercel.app`
   - Try logging in
   - Create a task
   - Check browser console for errors

---

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| CORS errors | Update `FRONTEND_URL` in Render with exact Vercel URL |
| API calls failing | Check `VITE_API_URL` includes `/api` at the end |
| Backend not starting | Verify `PORT=10000` and MongoDB connection |
| Build fails | Check logs in Vercel/Render dashboard |

---

## 📝 URLs to Save

- **Backend URL**: `https://____________________.onrender.com`
- **Frontend URL**: `https://____________________.vercel.app`

---

**Need detailed instructions?** See `DEPLOYMENT.md`

