# Render Deployment Guide for 9jaTouch Backend

## 🚀 Quick Deploy Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

### 2. Create Render Account
- Go to [render.com](https://render.com)
- Sign up with GitHub

### 3. Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:

**Build Settings:**
- Build Command: `npm install`
- Start Command: `node server.js`

**Environment Variables:**
```
NODE_ENV=production
JWT_SECRET=your_super_secure_jwt_secret_key_change_this_in_production
```

**Database:**
- Add PostgreSQL database
- Render will automatically set `DATABASE_URL`

### 4. Deploy
- Click "Create Web Service"
- Wait for deployment (2-3 minutes)

## ✅ Post-Deployment Checklist

1. **Test Health Check:**
   ```
   https://your-app-name.onrender.com/
   ```
   Should return:
   ```json
   {
     "success": true,
     "message": "Salon Booking API is running",
     "environment": "production"
   }
   ```

2. **Test API Endpoints:**
   ```
   https://your-app-name.onrender.com/api/auth/register
   https://your-app-name.onrender.com/api/dashboard/stats
   ```

3. **Update Frontend API URL:**
   Change in your React Native app:
   ```javascript
   EXPO_PUBLIC_API_BASE_URL=https://your-app-name.onrender.com/api
   ```

## 🔧 Troubleshooting

### Database Connection Issues
- Check if PostgreSQL database is running
- Verify DATABASE_URL is set correctly
- Check Render logs for connection errors

### CORS Issues
- Mobile apps should work (CORS allows all origins)
- If restricting domains, update CORS config in app.js

### Build Failures
- Check package.json has correct start script
- Verify all dependencies are in package.json
- Check Render build logs

## 📱 Mobile App Configuration

Update your frontend `.env`:
```
EXPO_PUBLIC_API_BASE_URL=https://your-app-name.onrender.com/api
EXPO_PUBLIC_ENVIRONMENT=production
EXPO_PUBLIC_DEBUG=false
```

## 🎯 Production Features Enabled

✅ **Database:** PostgreSQL with SSL
✅ **CORS:** Mobile app friendly
✅ **Error Handling:** Production-safe
✅ **Health Check:** Render-compatible
✅ **Environment:** Production optimized
✅ **Security:** JWT with secure secrets
