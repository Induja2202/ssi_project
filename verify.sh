#!/bin/bash
echo "🔍 Verifying SSI Identity Platform..."
echo ""

# Check backend health
echo "1. Checking backend health..."
HEALTH=$(curl -s https://ssi-identity-backend.onrender.com/health)
if [[ $HEALTH == *"OK"* ]]; then
  echo "✅ Backend is running!"
else
  echo "❌ Backend is NOT running!"
fi
echo ""

# Check frontend
echo "2. Checking frontend..."
FRONTEND=$(curl -s -o /dev/null -w "%{http_code}" https://ssi-identity-project-tau.vercel.app)
if [ "$FRONTEND" == "200" ]; then
  echo "✅ Frontend is accessible!"
else
  echo "❌ Frontend returned: $FRONTEND"
fi
echo ""

# Check frontend .env
echo "3. Checking frontend configuration..."
if grep -q "ssi-identity-backend.onrender.com" frontend/.env; then
  echo "✅ Frontend .env has correct backend URL"
else
  echo "❌ Frontend .env needs updating"
fi
echo ""

echo "🎉 Verification complete!"
