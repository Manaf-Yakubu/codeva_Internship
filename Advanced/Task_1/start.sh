#!/bin/bash

# CodeVA Full-Stack Application Start Script
# Author: Yakubu Abdul Manaf

set -e

echo "🚀 Starting CodeVA Full-Stack Application..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ] || [ ! -d "server/node_modules" ] || [ ! -d "client/node_modules" ]; then
    print_status "Installing dependencies..."
    npm run install-all
fi

# Check if PostgreSQL is running
if ! pg_isready -h localhost -p 5432 &> /dev/null; then
    print_warning "PostgreSQL is not running or not accessible on localhost:5432"
    print_status "Please ensure PostgreSQL is running before starting the application"
fi

# Check if Redis is running
if ! redis-cli ping &> /dev/null; then
    print_warning "Redis is not running or not accessible"
    print_status "The application will work without Redis but some features may be limited"
fi

# Setup database if needed
if [ "$1" = "--setup-db" ]; then
    print_status "Setting up database..."
    node setup-database.js
fi

# Start the application
print_status "Starting development servers..."
npm run dev

print_success "Application started successfully!"
print_status "Frontend: http://localhost:3000"
print_status "Backend API: http://localhost:5000"
print_status "Health Check: http://localhost:5000/health"
