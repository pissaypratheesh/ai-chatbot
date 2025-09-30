#!/bin/bash

echo "🔍 Testing Chat History Authentication Flow"
echo "============================================="
echo ""

echo "1. Testing root route redirect..."
ROOT_RESPONSE=$(curl -s "http://localhost:3000/")
echo "   Root route response: $ROOT_RESPONSE"
echo ""

echo "2. Testing guest authentication..."
GUEST_RESPONSE=$(curl -s "http://localhost:3000/api/auth/guest?redirectUrl=http://localhost:3000/" -v 2>&1 | grep -E "(HTTP|Set-Cookie|Location)")
echo "   Guest auth response headers:"
echo "$GUEST_RESPONSE"
echo ""

echo "3. Testing session debug endpoint..."
SESSION_RESPONSE=$(curl -s "http://localhost:3000/api/debug-session")
echo "   Session debug response: $SESSION_RESPONSE"
echo ""

echo "4. Testing history API..."
HISTORY_RESPONSE=$(curl -s "http://localhost:3000/api/history?limit=3" | jq '.chats | length' 2>/dev/null || echo "Failed to parse JSON")
echo "   History API chat count: $HISTORY_RESPONSE"
echo ""

echo "✅ Test completed!"
echo ""
echo "📋 Instructions for browser testing:"
echo "1. Clear your browser cache and cookies"
echo "2. Visit: http://localhost:3000/"
echo "3. You should be automatically redirected to guest authentication"
echo "4. After authentication, you should see the main app with chat history"
echo "5. Check the sidebar for your chat history"
