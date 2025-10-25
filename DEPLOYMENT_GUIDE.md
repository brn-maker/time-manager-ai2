# Deployment Guide for Time Manager AI

## 🚀 Deploying to Render (Free Tier)

### Backend Deployment

1. **Prepare Backend for Render:**
   - The backend is already configured for deployment
   - Uses `render.yaml` for configuration
   - Health check endpoint: `/api/health`

2. **Environment Variables to Set in Render:**
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   OPENAI_API_KEY=your_openai_api_key
   NODE_ENV=production
   PORT=10000
   ```

3. **Deploy Backend:**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `backend` folder as root directory
   - Render will auto-detect Node.js and use the `render.yaml` config

### Mobile App Deployment

1. **Update API URLs:**
   - Change from `http://10.117.100.187:3000` to your Render backend URL
   - Update in `mobile/App.js` and `mobile/components/EditActivityForm.js`

2. **Build for Production:**
   ```bash
   cd mobile
   npm run build
   ```

3. **Deploy Options:**
   - **Option A: Expo (Recommended)**
     - Use Expo Go app on your phone
     - Publish to Expo and scan QR code
   
   - **Option B: React Native Web**
     - Build as web app
     - Deploy to Render as static site

### Step-by-Step Deployment

#### 1. Deploy Backend to Render

1. Push your code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name:** `time-manager-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. Add environment variables (see above)
7. Click "Create Web Service"

#### 2. Update Mobile App

After backend is deployed, update the API URLs:

```javascript
// In mobile/App.js and mobile/components/EditActivityForm.js
const API_URL = "https://your-render-app-name.onrender.com/api/activities";
```

#### 3. Deploy Mobile App

**Option A: Using Expo (Easiest)**

1. Install Expo CLI:
   ```bash
   npm install -g @expo/cli
   ```

2. In mobile directory:
   ```bash
   cd mobile
   npx expo start
   ```

3. Install Expo Go app on your phone
4. Scan the QR code to run the app

**Option B: Build for Web**

1. Install dependencies:
   ```bash
   cd mobile
   npm install
   ```

2. Build for web:
   ```bash
   npx expo export:web
   ```

3. Deploy the `web-build` folder to Render as a static site

### Environment Variables Setup

#### Supabase Setup
1. Go to your Supabase project dashboard
2. Copy your project URL and anon key
3. Add to Render environment variables

#### OpenAI Setup (Optional)
1. Get API key from OpenAI
2. Add to Render environment variables

### Testing Deployment

1. **Backend Health Check:**
   ```
   https://your-app-name.onrender.com/api/health
   ```

2. **Test API Endpoints:**
   ```
   GET https://your-app-name.onrender.com/api/activities/123/2024-01-16
   ```

3. **Mobile App:**
   - Open Expo Go app
   - Scan QR code
   - Test all features

### Troubleshooting

#### Common Issues:

1. **Backend not starting:**
   - Check environment variables
   - Verify Supabase connection
   - Check Render logs

2. **Mobile app can't connect:**
   - Verify API URL is correct
   - Check CORS settings
   - Ensure backend is running

3. **Database errors:**
   - Run the database migration script
   - Check Supabase project status

### Production Checklist

- [ ] Backend deployed to Render
- [ ] Environment variables configured
- [ ] Database migration completed
- [ ] API URLs updated in mobile app
- [ ] Mobile app tested on device
- [ ] All features working (add, edit, delete activities)
- [ ] AI summary working
- [ ] Goals functionality working

### Cost Considerations

**Render Free Tier:**
- 750 hours/month (enough for 24/7 operation)
- Automatic sleep after 15 minutes of inactivity
- Cold start takes ~30 seconds

**Optimizations:**
- Use health check endpoint to prevent sleep
- Consider upgrading to paid plan for better performance
- Implement caching for better response times

### Next Steps After Deployment

1. **Monitor Performance:**
   - Check Render dashboard for metrics
   - Monitor Supabase usage
   - Watch for any errors

2. **User Experience:**
   - Test on different devices
   - Gather feedback
   - Iterate on features

3. **Scaling:**
   - Consider paid Render plan for better performance
   - Implement database optimizations
   - Add monitoring and logging
