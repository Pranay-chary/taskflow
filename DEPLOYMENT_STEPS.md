# 🚀 Deployment Steps for TaskFlow

Complete step-by-step guide to deploy TaskFlow to Vercel (Frontend) and Render (Backend).

---

## 📋 Prerequisites

Before starting, ensure you have:
- ✅ Code pushed to GitHub repository
- ✅ MongoDB Atlas database set up
- ✅ Vercel account (sign up at https://vercel.com)
- ✅ Render account (sign up at https://render.com)

---

## PART 1: Backend Deployment (Render)

### Step 1: Create Render Account & Connect GitHub

1. Go to **https://dashboard.render.com**
2. Sign up or log in
3. Click **"New +"** button (top right)
4. Select **"Web Service"**

### Step 2: Connect Your Repository

1. Click **"Connect account"** under GitHub
2. Authorize Render to access your GitHub
3. Select your **taskflow repository**
4. Click **"Connect"**

### Step 3: Configure Backend Service

Fill in the following settings:

| Field | Value |
|-------|-------|
| **Name** | `taskflow-backend` |
| **Region** | Choose closest to you |
| **Branch** | `main` (or your main branch) |
| **Root Directory** | `backend` ⚠️ **Important!** |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | `Free` (or choose paid) |

### Step 4: Set Environment Variables

Before deploying, click **"Advanced"** → **"Add Environment Variable"** and add:

```
MONGODB_URI=mongodb+srv://abhimongodb_db_user:CPMzfi1JUoApZCVK@cluster0.f2wceie.mongodb.net/?appName=Cluster0
```

```
PORT=10000
```

```
NODE_ENV=production
```

```
FRONTEND_URL=https://placeholder.vercel.app
```

**Note**: We'll update `FRONTEND_URL` after deploying frontend.

### Step 5: Deploy Backend

1. Click **"Create Web Service"**
2. Wait for deployment (takes 2-5 minutes)
3. Watch the build logs
4. When deployment succeeds, **copy your backend URL**

Your backend URL will look like:
```
https://taskflow-backend.onrender.com
```

**📝 Save this URL - you'll need it next!**

### Step 6: Test Backend

Open a new browser tab and visit:
```
https://your-backend-url.onrender.com/api/health
```

You should see:
```json
{"message": "Server is running"}
```

✅ **Backend is deployed!**

---

## PART 2: Frontend Deployment (Vercel)

### Step 7: Create Vercel Account & Import Project

1. Go to **https://vercel.com/dashboard**
2. Sign up or log in with GitHub
3. Click **"Add New..."** → **"Project"**
4. Click **"Import"** next to your taskflow repository

### Step 8: Configure Frontend Project

In the project settings:

| Field | Value |
|-------|-------|
| **Framework Preset** | `Vite` (auto-detected) |
| **Root Directory** | `frontend` ⚠️ **Important!** |
| **Build Command** | `npm run build` (auto-detected) |
| **Output Directory** | `dist` (auto-detected) |
| **Install Command** | `npm install` (auto-detected) |

### Step 9: Set Environment Variable

Before deploying, go to **"Environment Variables"** section:

Click **"Add"** and add:

**Key**: `VITE_API_URL`  
**Value**: `https://your-backend-url.onrender.com/api`

**⚠️ Important**: 
- Replace `your-backend-url` with your actual Render backend URL
- Make sure it ends with `/api`
- Example: `https://taskflow-backend.onrender.com/api`

### Step 10: Deploy Frontend

1. Click **"Deploy"** button
2. Wait for build to complete (takes 1-3 minutes)
3. When deployment succeeds, **copy your frontend URL**

Your frontend URL will look like:
```
https://taskflow.vercel.app
```

**📝 Save this URL!**

---

## PART 3: Connect Frontend & Backend

### Step 11: Update Backend CORS Settings

Now we need to tell the backend to accept requests from your frontend:

1. Go back to **Render Dashboard**
2. Click on your **taskflow-backend** service
3. Go to **"Environment"** tab
4. Find `FRONTEND_URL` variable
5. Click **"Edit"** and update the value:

```
FRONTEND_URL=https://your-frontend-url.vercel.app
```

**⚠️ Replace** `your-frontend-url` with your actual Vercel URL

6. Click **"Save Changes"**
7. Render will automatically redeploy (or click "Manual Deploy")

### Step 12: Wait for Redeploy

Wait 2-3 minutes for Render to redeploy with the new CORS settings.

---

## PART 4: Verify Everything Works

### Step 13: Test Backend Health

Visit:
```
https://your-backend.onrender.com/api/health
```

Should return: `{"message": "Server is running"}`

### Step 14: Test Frontend

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Open browser **Developer Tools** (F12)
3. Go to **Console** tab
4. Try to **login** or **signup**
5. Check for errors in console

### Step 15: Verify API Connection

1. In browser DevTools, go to **Network** tab
2. Try logging in or creating a task
3. Look for API calls to your backend
4. They should return **200 OK** status

---

## ✅ Success Checklist

- [ ] Backend deployed on Render
- [ ] Backend health check works (`/api/health`)
- [ ] Frontend deployed on Vercel
- [ ] Frontend loads without errors
- [ ] Can login/signup
- [ ] Can create tasks
- [ ] No CORS errors in browser console
- [ ] API calls are successful

---

## 🆘 Troubleshooting

### Problem: CORS Errors in Browser

**Solution**:
1. Check `FRONTEND_URL` in Render matches your Vercel URL exactly
2. Include `https://` prefix
3. No trailing slash
4. Redeploy backend after updating

### Problem: API Calls Return 404

**Solution**:
1. Check `VITE_API_URL` in Vercel includes `/api` at the end
2. Format: `https://backend.onrender.com/api`
3. Verify backend is running (check Render logs)

### Problem: Backend Won't Start

**Solution**:
1. Check Render logs for errors
2. Verify `MONGODB_URI` is correct
3. Ensure `PORT=10000` (for free tier)
4. Check MongoDB Atlas IP whitelist allows all IPs (`0.0.0.0/0`)

### Problem: Frontend Build Fails

**Solution**:
1. Check Vercel build logs
2. Verify all dependencies in `package.json`
3. Check for syntax errors
4. Ensure Node.js version is compatible

### Problem: Database Connection Error

**Solution**:
1. Verify MongoDB connection string
2. Check MongoDB Atlas → Network Access → Add IP `0.0.0.0/0`
3. Verify database user credentials
4. Check connection string format

---

## 📝 Quick Reference

### Environment Variables

**Render (Backend)**:
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/?appName=Cluster0
PORT=10000
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
```

**Vercel (Frontend)**:
```
VITE_API_URL=https://your-backend.onrender.com/api
```

### Important URLs

- **Backend**: `https://____________________.onrender.com`
- **Frontend**: `https://____________________.vercel.app`
- **Backend Health**: `https://your-backend.onrender.com/api/health`

---

## 🎉 You're Done!

Your TaskFlow application is now live and accessible worldwide!

**Next Steps**:
- Share your frontend URL with users
- Monitor logs in both platforms
- Set up custom domains (optional)
- Consider upgrading from free tier for production

---

## 📚 Additional Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com/

---

**Need Help?** Check the detailed guide in `DEPLOYMENT.md` or `QUICK_DEPLOY.md`

