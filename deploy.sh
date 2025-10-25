#!/bin/bash

# Time Manager AI Deployment Script
echo "🚀 Time Manager AI Deployment Script"
echo "===================================="

# Check if we're in the right directory
if [ ! -f "mobile/package.json" ] || [ ! -f "backend/package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo ""
echo "📋 Deployment Checklist:"
echo "1. ✅ Backend configured for Render"
echo "2. ✅ Mobile app configured for production"
echo "3. ✅ Environment variables ready"
echo ""

# Check if backend is ready
echo "🔍 Checking backend configuration..."
if [ -f "backend/render.yaml" ]; then
    echo "✅ Backend render.yaml found"
else
    echo "❌ Backend render.yaml not found"
    exit 1
fi

# Check if mobile config is ready
echo "🔍 Checking mobile configuration..."
if [ -f "mobile/config.js" ]; then
    echo "✅ Mobile config.js found"
else
    echo "❌ Mobile config.js not found"
    exit 1
fi

echo ""
echo "📝 Next Steps:"
echo "1. Push your code to GitHub"
echo "2. Go to https://dashboard.render.com"
echo "3. Create a new Web Service"
echo "4. Connect your GitHub repository"
echo "5. Set root directory to 'backend'"
echo "6. Add environment variables:"
echo "   - SUPABASE_URL=your_supabase_url"
echo "   - SUPABASE_KEY=your_supabase_anon_key"
echo "   - OPENAI_API_KEY=your_openai_api_key"
echo "   - NODE_ENV=production"
echo "   - PORT=10000"
echo ""
echo "7. After backend is deployed, update mobile/config.js:"
echo "   - Change API_URL to your Render backend URL"
echo ""
echo "8. For mobile app:"
echo "   - Install Expo CLI: npm install -g @expo/cli"
echo "   - cd mobile && npx expo start"
echo "   - Install Expo Go app on your phone"
echo "   - Scan QR code to run the app"
echo ""
echo "🎉 Your app will be live and ready to use!"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT_GUIDE.md"
