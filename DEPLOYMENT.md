# Deployment Guide: TaskFlow

This guide will help you deploy TaskFlow to production:
- **Frontend**: Vercel
- **Backend**: Render

---

## 📋 Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Render Account** - Sign up at [render.com](https://render.com)
4. **MongoDB Atlas** - Database (already configured)

---

## 🚀 Step 1: Deploy Backend to Render

### 1.1 Prepare Backend

1. Ensure your backend code is pushed to GitHub
2. The `render.yaml` file is already configured in the `backend/` directory

### 1.2 Deploy on Render

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +"** → **"Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service**:
   - **Name**: `taskflow-backend` (or your preferred name)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or choose a paid plan)

### 1.3 Set Environment Variables in Render

Go to **Environment** tab and add:

```
MONGODB_URI=mongodb+srv://abhimongodb_db_user:CPMzfi1JUoApZCVK@cluster0.f2wceie.mongodb.net/?appName=Cluster0
PORT=10000
NODE_ENV=production
FRONTEND_URL=https://your-vercel-app.vercel.app
```

**Important**: 
- Replace `your-vercel-app.vercel.app` with your actual Vercel URL (you'll get this after deploying frontend)
- Render uses port 10000 by default for free tier

### 1.4 Deploy

Click **"Create Web Service"** and wait for deployment to complete.

### 1.5 Get Backend URL

After deployment, Render will provide a URL like:
```
https://taskflow-backend.onrender.com
```

**Save this URL** - you'll need it for frontend configuration!

---

## 🌐 Step 2: Deploy Frontend to Vercel

### 2.1 Prepare Frontend

1. Ensure your frontend code is pushed to GitHub
2. The `vercel.json` file is already configured in the `frontend/` directory

### 2.2 Deploy on Vercel

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Click "Add New..."** → **"Project"**
3. **Import your GitHub repository**
4. **Configure the project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

### 2.3 Set Environment Variables in Vercel

Go to **Settings** → **Environment Variables** and add:

```
VITE_API_URL=https://taskflow-backend.onrender.com/api
```

**Important**: Replace `taskflow-backend.onrender.com` with your actual Render backend URL!

### 2.4 Deploy

Click **"Deploy"** and wait for deployment to complete.

### 2.5 Get Frontend URL

After deployment, Vercel will provide a URL like:
```
https://taskflow.vercel.app
```

---

## 🔄 Step 3: Update Backend CORS (Important!)

After getting your Vercel frontend URL, update the backend environment variable:

1. Go back to **Render Dashboard** → Your backend service
2. Go to **Environment** tab
3. Update `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://your-actual-vercel-url.vercel.app
   ```
4. **Redeploy** the backend service (or it will auto-redeploy)

---

## ✅ Step 4: Verify Deployment

### 4.1 Test Backend

Visit your backend health check endpoint:
```
https://your-backend.onrender.com/api/health
```

You should see:
```json
{
  "message": "Server is running"
}
```

### 4.2 Test Frontend

1. Visit your Vercel URL
2. Try logging in
3. Test creating a task
4. Verify API calls are working

### 4.3 Check Browser Console

Open browser DevTools → Console and verify:
- No CORS errors
- API calls are successful
- No 404 errors

---

## 🔧 Troubleshooting

### Issue: CORS Errors

**Solution**: 
1. Ensure `FRONTEND_URL` in Render matches your Vercel URL exactly
2. Include `https://` in the URL
3. Redeploy backend after updating

### Issue: API Calls Failing

**Solution**:
1. Check `VITE_API_URL` in Vercel environment variables
2. Ensure it includes `/api` at the end: `https://backend.onrender.com/api`
3. Verify backend is running (check Render logs)

### Issue: Backend Not Starting

**Solution**:
1. Check Render logs for errors
2. Verify `MONGODB_URI` is correct
3. Ensure `PORT` is set to `10000` (for free tier)
4. Check that `package.json` has correct start script

### Issue: Frontend Build Failing

**Solution**:
1. Check Vercel build logs
2. Ensure all dependencies are in `package.json`
3. Verify Node.js version compatibility
4. Check for TypeScript errors (if any)

### Issue: Database Connection Errors

**Solution**:
1. Verify MongoDB Atlas connection string
2. Check IP whitelist in MongoDB Atlas (allow all IPs: `0.0.0.0/0`)
3. Verify database user credentials

---

## 📝 Environment Variables Summary

### Backend (Render)
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/?appName=Cluster0
PORT=10000
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## 🔄 Updating Deployments

### Update Backend
1. Push changes to GitHub
2. Render will auto-deploy (or manually trigger redeploy)

### Update Frontend
1. Push changes to GitHub
2. Vercel will auto-deploy

---

## 📊 Monitoring

### Render
- View logs: Dashboard → Your Service → Logs
- Monitor uptime: Dashboard → Your Service → Metrics

### Vercel
- View logs: Dashboard → Your Project → Deployments → Click deployment → Logs
- Monitor analytics: Dashboard → Your Project → Analytics

---

## 🎉 Success!

Your TaskFlow application should now be live:
- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-backend.onrender.com

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)

---

## ⚠️ Important Notes

1. **Free Tier Limitations**:
   - Render free tier services spin down after 15 minutes of inactivity
   - First request after spin-down may take 30-60 seconds
   - Consider upgrading for production use

2. **Security**:
   - Never commit `.env` files to GitHub
   - Use environment variables in both platforms
   - Consider implementing proper authentication (JWT) for production

3. **Performance**:
   - Enable caching where possible
   - Optimize images and assets
   - Consider CDN for static assets

---

**Need Help?** Check the logs in both platforms and verify all environment variables are set correctly.

