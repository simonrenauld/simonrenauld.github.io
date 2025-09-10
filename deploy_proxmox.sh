#!/bin/bash

# Proxmox Portfolio Deployment Script
# This script deploys the portfolio to the Proxmox VM

set -e

echo "🚀 Starting Portfolio Deployment on Proxmox VM"

# Configuration
DEPLOYMENT_DIR="/var/www/html/portfolio"
BACKUP_DIR="/var/www/backup/portfolio_$(date +%Y%m%d_%H%M%S)"
PACKAGE_NAME="portfolio_deployment.tar.gz"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root or with sudo
if [[ $EUID -ne 0 ]]; then
    print_error "This script must be run as root or with sudo"
    exit 1
fi

# Check if deployment package exists
if [[ ! -f "$PACKAGE_NAME" ]]; then
    print_error "Deployment package $PACKAGE_NAME not found in current directory"
    print_error "Please transfer the package to the server first"
    exit 1
fi

print_status "Creating backup of current deployment..."
if [[ -d "$DEPLOYMENT_DIR" ]]; then
    mkdir -p "$BACKUP_DIR"
    cp -r "$DEPLOYMENT_DIR"/* "$BACKUP_DIR"/ 2>/dev/null || true
    print_status "Backup created at: $BACKUP_DIR"
fi

print_status "Setting up deployment directory..."
mkdir -p "$DEPLOYMENT_DIR"

print_status "Extracting deployment package..."
tar -xzf "$PACKAGE_NAME" -C "$DEPLOYMENT_DIR" --strip-components=1

print_status "Setting proper permissions..."
chown -R www-data:www-data "$DEPLOYMENT_DIR"
chmod -R 755 "$DEPLOYMENT_DIR"

print_status "Cleaning up deployment package..."
rm "$PACKAGE_NAME"

print_status "Testing deployment..."
if [[ -f "$DEPLOYMENT_DIR/index.html" ]]; then
    print_status "✅ Deployment successful!"
    print_status "Portfolio is now available at:"
    print_status "  - Local: http://localhost/portfolio/"
    print_status "  - External: http://136.243.155.166:8082/portfolio/"
    print_status ""
    print_status "To serve from root domain, you may want to:"
    print_status "  1. Move contents to /var/www/html/"
    print_status "  2. Update nginx configuration"
    print_status "  3. Restart nginx service"
else
    print_error "❌ Deployment verification failed!"
    print_error "index.html not found in deployment directory"
    exit 1
fi

print_status "🎉 Portfolio deployment completed successfully!"
