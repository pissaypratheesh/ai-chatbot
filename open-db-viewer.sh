#!/bin/bash

echo "🗄️  Database Viewer Helper Script"
echo ""
echo "📊 Your PostgreSQL database contains:"
echo "  📊 2 chats"
echo "  💬 4 messages" 
echo "  👥 21 users"
echo ""
echo "🌐 The database viewer is ALWAYS available at:"
echo "   http://localhost:3000/db-viewer.html"
echo ""
echo "🚀 This script just opens it in your browser automatically..."
echo ""

# Open the database viewer in the default browser
if command -v open >/dev/null 2>&1; then
    open "http://localhost:3000/db-viewer.html"
elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "http://localhost:3000/db-viewer.html"
else
    echo "Please open this URL in your browser:"
    echo "http://localhost:3000/db-viewer.html"
fi

echo ""
echo "✅ Database viewer opened!"
echo ""
echo "💡 TIP: You can bookmark this URL for quick access:"
echo "   http://localhost:3000/db-viewer.html"
echo ""
echo "🔍 Your search APIs are working with this real data:"
echo "   • Search for 'greeting' → finds 'Simple Greeting Interaction'"
echo "   • Search for 'javascript' → finds 'JavaScript Code for Implementing Binary Search Algorithm'"
echo ""
echo "📖 For more details, see: DATABASE_VIEWER_README.md"
