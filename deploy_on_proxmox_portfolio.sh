#!/bin/bash

# Manual Portfolio Deployment Script for Proxmox VM
# Run this script ON YOUR PROXMOX SERVER after transferring files

echo "🚀 Manual Portfolio Deployment to Proxmox VM"
echo "=============================================="

# Configuration
REMOTE_PATH="/var/www/html/portfolio"
BACKUP_PATH="/var/www/html/portfolio_backup_$(date +%Y%m%d_%H%M%S)"

echo "📂 Target Directory: $REMOTE_PATH"
echo "💾 Backup Directory: $BACKUP_PATH"

# Create backup if portfolio exists
if [ -d "$REMOTE_PATH" ]; then
    echo "📦 Creating backup of existing portfolio..."
    cp -r "$REMOTE_PATH" "$BACKUP_PATH"
    echo "✅ Backup created: $BACKUP_PATH"
fi

# Create target directory
echo "📁 Creating target directory..."
mkdir -p "$REMOTE_PATH"

# Copy files (assuming they're in the same directory as this script)
echo "📤 Copying portfolio files..."
cp -r * "$REMOTE_PATH/" 2>/dev/null || cp -r . "$REMOTE_PATH/" 2>/dev/null || echo "❌ Copy failed - make sure files are in current directory"

# Set proper permissions
echo "🔒 Setting proper permissions..."
chown -R www-data:www-data "$REMOTE_PATH"
chmod -R 755 "$REMOTE_PATH"

# Test the deployment
echo "🧪 Testing deployment..."
if [ -f "$REMOTE_PATH/index.html" ]; then
    echo "✅ index.html found"
else
    echo "❌ index.html not found"
fi

if [ -d "$REMOTE_PATH/css" ]; then
    echo "✅ CSS directory found"
else
    echo "❌ CSS directory not found"
fi

if [ -d "$REMOTE_PATH/js" ]; then
    echo "✅ JS directory found"
else
    echo "❌ JS directory not found"
fi

echo ""
echo "🎯 Deployment Complete!"
echo "🌐 Your portfolio should now be live at: http://136.243.155.166:8082/"
echo ""
echo "📊 Enhanced Features Deployed:"
echo "   ✨ Interactive project cards with hover animations"
echo "   📊 Animated counters and skill progress bars"
echo "   🌙 Dark mode toggle with professional styling"
echo "   📈 Scroll progress indicator"
echo "   🎯 Enhanced timeline animations"
echo "   🧠 Neuroscience demo interactions"
echo "   🌍 Geospatial map interactions"
echo "   🔄 Floating skill badges"
echo "   ⬆️ Back-to-top button"
echo "   🔔 Notification system"
echo "   📱 Mobile-optimized responsive design"

echo ""
echo "🔧 If issues occur:"
echo "   1. Check nginx configuration: /etc/nginx/sites-available/default"
echo "   2. Restart nginx: systemctl restart nginx"
echo "   3. Check permissions: ls -la $REMOTE_PATH"
echo "   4. Check logs: tail -f /var/log/nginx/error.log"
