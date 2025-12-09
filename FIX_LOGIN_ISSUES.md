# 🔧 Fix Login/Signup Issues After Deployment

If login/signup is failing after deployment, follow these steps:

---

## ✅ Step 1: Check Vercel Environment Variables

The frontend needs to know where your backend is located.

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Click on your project**
3. **Go to Settings** → **Environment Variables**
4. **Check if this variable exists**:

   **Variable Name**: `VITE_API_URL`  
   **Value**: `https://taskflow-backend-67ob.onrender.com/api`

   ⚠️ **Important**: 
   - Must start with `VITE_` (required by Vite)
   - Must include `/api` at the end
   - Use your actual Render backend URL

5. **If missing or wrong**:
   - Click "Add New"
   - Key: `VITE_API_URL`
   - Value: `https://taskflow-backend-67ob.onrender.com/api` (replace with your backend URL)
   - Click "Save"
   - **Redeploy** the frontend (Vercel will auto-redeploy)

---

## ✅ Step 2: Check Render CORS Settings

The backend needs to allow requests from your Vercel frontend.

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click on your backend service**: `taskflow-backend`
3. **Go to Environment tab**
4. **Check `FRONTEND_URL` variable**:

   **Variable Name**: `FRONTEND_URL`  
   **Value**: `https://your-frontend.vercel.app`

   ⚠️ **Important**: 
   - Must match your exact Vercel URL
   - Include `https://`
   - No trailing slash

5. **If missing or wrong**:
   - Update the value with your Vercel frontend URL
   - Click "Save Changes"
   - Render will auto-redeploy

---

## ✅ Step 3: Verify Backend is Running

Test if your backend is accessible:

1. **Open browser** and visit:
   ```
   https://taskflow-backend-67ob.onrender.com/api/health
   ```

2. **You should see**:
   ```json
   {"message": "Server is running"}
   ```

3. **If you get an error**:
   - Backend might be sleeping (free tier)
   - Wait 30-60 seconds and try again
   - Check Render logs for errors

---

## ✅ Step 4: Test API Endpoint Directly

Test if the login endpoint is accessible:

1. **Open browser DevTools** (F12)
2. **Go to Console tab**
3. **Run this command**:
   ```javascript
   fetch('https://taskflow-backend-67ob.onrender.com/api/auth/login', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ email: 'test@test.com', password: 'test' })
   }).then(r => r.json()).then(console.log).catch(console.error)
   ```

4. **Check the response**:
   - If you see CORS error → Backend CORS not configured
   - If you see "User not found" → Backend is working, just wrong credentials
   - If you see network error → Backend might be down

---

## ✅ Step 5: Check Browser Console

1. **Open your deployed frontend** (Vercel URL)
2. **Open DevTools** (F12)
3. **Go to Console tab**
4. **Try to login**
5. **Look for error messages**:

   **If you see**:
   - `Using production API URL: https://...` → ✅ API URL is set
   - `⚠️ VITE_API_URL not set` → ❌ Environment variable missing
   - `Cannot connect to server` → ❌ Backend not accessible or CORS issue
   - `CORS error` → ❌ Backend CORS not allowing your frontend

---

## 🔍 Common Issues & Solutions

### Issue 1: "Cannot connect to server"

**Cause**: Frontend can't reach backend

**Solution**:
1. Check `VITE_API_URL` in Vercel is set correctly
2. Verify backend URL is correct: `https://taskflow-backend-67ob.onrender.com/api`
3. Test backend health endpoint manually
4. Check if backend is sleeping (free tier)

---

### Issue 2: CORS Error

**Cause**: Backend not allowing frontend origin

**Solution**:
1. Set `FRONTEND_URL` in Render with exact Vercel URL
2. Format: `https://your-app.vercel.app` (no trailing slash)
3. Redeploy backend after updating

---

### Issue 3: "User not found" or "Invalid password"

**Cause**: User doesn't exist or wrong password

**Solution**:
1. Try **signup** first to create an account
2. Use correct email/password
3. Check if user exists in MongoDB Atlas

---

### Issue 4: API URL shows as `/api` in production

**Cause**: `VITE_API_URL` not set in Vercel

**Solution**:
1. Go to Vercel → Settings → Environment Variables
2. Add `VITE_API_URL` = `https://your-backend.onrender.com/api`
3. Redeploy frontend

---

## 📋 Quick Checklist

- [ ] `VITE_API_URL` set in Vercel environment variables
- [ ] `VITE_API_URL` includes `/api` at the end
- [ ] `FRONTEND_URL` set in Render environment variables
- [ ] `FRONTEND_URL` matches exact Vercel URL
- [ ] Backend health check works (`/api/health`)
- [ ] No CORS errors in browser console
- [ ] Backend logs show login attempts

---

## 🧪 Testing Steps

1. **Test Backend Health**:
   ```
   https://taskflow-backend-67ob.onrender.com/api/health
   ```

2. **Test Login Endpoint** (in browser console):
   ```javascript
   fetch('https://taskflow-backend-67ob.onrender.com/api/auth/login', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ email: 'test@test.com', password: 'test' })
   }).then(r => r.json()).then(console.log)
   ```

3. **Check Frontend Console**:
   - Open deployed frontend
   - Open DevTools → Console
   - Try login
   - Check for error messages

---

## 🆘 Still Not Working?

1. **Check Render Logs**:
   - Render Dashboard → Your Service → Logs
   - Look for login attempts and errors

2. **Check Vercel Logs**:
   - Vercel Dashboard → Your Project → Deployments → Click deployment → Logs
   - Look for build errors

3. **Check Browser Network Tab**:
   - DevTools → Network tab
   - Try login
   - Check the failed request
   - Look at Request URL, Status Code, Response

---

## 📝 Environment Variables Summary

### Vercel (Frontend):
```
VITE_API_URL=https://taskflow-backend-67ob.onrender.com/api
```

### Render (Backend):
```
MONGODB_URI=mongodb+srv://admin:ROECU2bMCo02ctFg@cluster0.1fkqgiz.mongodb.net/?appName=Cluster0
PORT=10000
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
```

---

**After fixing these, login/signup should work!** 🎉

