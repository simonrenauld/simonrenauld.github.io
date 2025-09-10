#!/bin/bash

# Portfolio Transfer Script for Proxmox VM
# This script transfers the deployment package to the Proxmox server

echo "📦 Preparing to transfer portfolio to Proxmox VM..."

# Configuration
PROXMOX_IP="136.243.155.166"
PROXMOX_USER="root"  # Adjust if using a different user
REMOTE_PATH="/root/"
LOCAL_PACKAGE="portfolio_deployment.tar.gz"
DEPLOY_SCRIPT="deploy_proxmox.sh"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if files exist
if [[ ! -f "$LOCAL_PACKAGE" ]]; then
    print_error "Deployment package $LOCAL_PACKAGE not found!"
    exit 1
fi

if [[ ! -f "$DEPLOY_SCRIPT" ]]; then
    print_error "Deployment script $DEPLOY_SCRIPT not found!"
    exit 1
fi

print_status "Testing connection to Proxmox VM..."
if ! ssh -o ConnectTimeout=10 -o BatchMode=yes "$PROXMOX_USER@$PROXMOX_IP" "echo 'Connection successful'" 2>/dev/null; then
    print_error "Cannot connect to Proxmox VM at $PROXMOX_IP"
    print_warning "Please ensure:"
    print_warning "  1. SSH key is properly configured"
    print_warning "  2. Proxmox VM is running and accessible"
    print_warning "  3. Firewall allows SSH connections"
    print_warning ""
    print_warning "Manual transfer instructions:"
    print_warning "  1. Copy $LOCAL_PACKAGE to Proxmox server"
    print_warning "  2. Copy $DEPLOY_SCRIPT to Proxmox server"
    print_warning "  3. Run: sudo bash $DEPLOY_SCRIPT"
    exit 1
fi

print_status "Transferring deployment package..."
if scp "$LOCAL_PACKAGE" "$PROXMOX_USER@$PROXMOX_IP:$REMOTE_PATH"; then
    print_status "✅ Package transferred successfully"
else
    print_error "❌ Failed to transfer package"
    exit 1
fi

print_status "Transferring deployment script..."
if scp "$DEPLOY_SCRIPT" "$PROXMOX_USER@$PROXMOX_IP:$REMOTE_PATH"; then
    print_status "✅ Script transferred successfully"
else
    print_error "❌ Failed to transfer script"
    exit 1
fi

print_status "Executing deployment on Proxmox server..."
ssh "$PROXMOX_USER@$PROXMOX_IP" "cd $REMOTE_PATH && sudo bash $DEPLOY_SCRIPT"

print_status "🎉 Portfolio deployment completed!"
print_status "Your portfolio should now be available at:"
print_status "  http://136.243.155.166:8082/portfolio/"
print_status ""
print_status "If you want to serve from the root domain, you may need to:"
print_status "  1. Move files from /var/www/html/portfolio/ to /var/www/html/"
print_status "  2. Update nginx configuration accordingly"
