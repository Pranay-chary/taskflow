# 🔧 Troubleshooting MongoDB Connection Error

If you're seeing: `MongoDB connection error: connect ECONNREFUSED ::1:27017`

This means Render is trying to connect to localhost instead of MongoDB Atlas.

---

## ✅ Step-by-Step Fix

### Step 1: Verify Environment Variables in Render

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click on your service**: `taskflow-backend`
3. **Click "Environment" tab** (left sidebar)
4. **Check if these variables exist**:

You should see:
- `MONGODB_URI` = `mongodb+srv://admin:ROECU2bMCo02ctFg@cluster0.1fkqgiz.mongodb.net/?appName=Cluster0`
- `PORT` = `10000`
- `NODE_ENV` = `production`
- `FRONTEND_URL` = `https://placeholder.vercel.app`

### Step 2: If Variables Are Missing - Add Them

1. Click **"Add Environment Variable"** button
2. Add each variable one by one:

**Variable 1:**
- **Key**: `MONGODB_URI`
- **Value**: `mongodb+srv://admin:ROECU2bMCo02ctFg@cluster0.1fkqgiz.mongodb.net/?appName=Cluster0`
- Click **"Save"**

**Variable 2:**
- **Key**: `PORT`
- **Value**: `10000`
- Click **"Save"**

**Variable 3:**
- **Key**: `NODE_ENV`
- **Value**: `production`
- Click **"Save"**

**Variable 4:**
- **Key**: `FRONTEND_URL`
- **Value**: `https://placeholder.vercel.app`
- Click **"Save"**

### Step 3: Manual Redeploy

After adding/updating environment variables:

1. Go to **"Events"** or **"Manual Deploy"** tab
2. Click **"Manual Deploy"** → **"Deploy latest commit"**
3. Wait 2-3 minutes for deployment

### Step 4: Check Logs

1. Go to **"Logs"** tab in Render
2. Look for these messages:
   - ✅ `MongoDB URI: ✅ Set`
   - ✅ `Attempting to connect to MongoDB...`
   - ✅ `MongoDB connected successfully`

If you see:
   - ❌ `MongoDB URI: ❌ NOT SET` → Environment variable not set correctly
   - ❌ `ECONNREFUSED` → MongoDB Atlas network access issue

---

## 🔍 MongoDB Atlas Network Access

Even if environment variables are set, MongoDB Atlas must allow connections from Render:

### Fix Network Access:

1. **Go to MongoDB Atlas**: https://cloud.mongodb.com
2. **Click "Network Access"** (left sidebar)
3. **Click "Add IP Address"**
4. **Click "Allow Access from Anywhere"** button
   - This adds `0.0.0.0/0` (allows all IPs)
5. **Click "Confirm"**
6. Wait 1-2 minutes for changes to propagate

**Important**: Without this, Render cannot connect to MongoDB Atlas even with correct credentials.

---

## 🧪 Test Connection

After fixing both issues:

1. **Check Render Logs** - Should show "MongoDB connected successfully"
2. **Test Health Endpoint**: 
   ```
   https://taskflow-backend-67ob.onrender.com/api/health
   ```
   Should return: `{"message": "Server is running"}`

---

## 📋 Quick Checklist

- [ ] Environment variables set in Render Dashboard
- [ ] `MONGODB_URI` contains correct connection string
- [ ] `PORT` is set to `10000`
- [ ] Manual redeploy triggered after setting variables
- [ ] MongoDB Atlas Network Access allows `0.0.0.0/0`
- [ ] Checked Render logs for connection status

---

## 🆘 Still Not Working?

If still getting errors, check Render logs and look for:

1. **"MongoDB URI: ❌ NOT SET"**
   → Environment variable not set in Render

2. **"ECONNREFUSED" or "ENOTFOUND"**
   → MongoDB Atlas network access issue

3. **"Authentication failed"**
   → Wrong username/password in connection string

4. **"Server running on port 5000"** (instead of 10000)
   → PORT environment variable not set

---

## 📸 Visual Guide

### Render Environment Variables Screen:
```
Environment Variables
├── MONGODB_URI = mongodb+srv://admin:ROECU2bMCo02ctFg@cluster0.1fkqgiz.mongodb.net/?appName=Cluster0
├── PORT = 10000
├── NODE_ENV = production
└── FRONTEND_URL = https://placeholder.vercel.app
```

### MongoDB Atlas Network Access:
```
Network Access
└── IP Access List
    └── 0.0.0.0/0 (Allow access from anywhere) ✅
```

---

**After following these steps, your MongoDB connection should work!**

