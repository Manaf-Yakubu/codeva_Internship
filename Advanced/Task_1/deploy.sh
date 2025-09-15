#!/bin/bash

# CodeVA Full-Stack Application Deployment Script
# Author: Yakubu Abdul Manaf

set -e

echo "🚀 Starting CodeVA Full-Stack Application Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Environment selection
ENVIRONMENT=${1:-development}

print_status "Deployment environment: $ENVIRONMENT"

if [ "$ENVIRONMENT" = "production" ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
    print_warning "Production deployment requires proper environment variables!"
    print_warning "Please ensure .env.production files are configured with secure values."
else
    COMPOSE_FILE="docker-compose.yml"
fi

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose -f $COMPOSE_FILE down --remove-orphans

# Pull latest images
print_status "Pulling latest base images..."
docker-compose -f $COMPOSE_FILE pull

# Build and start services
print_status "Building and starting services..."
docker-compose -f $COMPOSE_FILE up --build -d

# Wait for services to be healthy
print_status "Waiting for services to be ready..."
sleep 30

# Check service health
print_status "Checking service health..."

# Check PostgreSQL
if docker-compose -f $COMPOSE_FILE exec -T postgres pg_isready -U postgres; then
    print_success "PostgreSQL is ready"
else
    print_error "PostgreSQL is not ready"
    exit 1
fi

# Check Redis
if docker-compose -f $COMPOSE_FILE exec -T redis redis-cli ping; then
    print_success "Redis is ready"
else
    print_error "Redis is not ready"
    exit 1
fi

# Check API health
if curl -f http://localhost:5000/health > /dev/null 2>&1; then
    print_success "API is ready"
else
    print_error "API is not ready"
    exit 1
fi

# Check Frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    print_success "Frontend is ready"
else
    print_error "Frontend is not ready"
    exit 1
fi

print_success "🎉 Deployment completed successfully!"
print_status "Services are running:"
print_status "  - Frontend: http://localhost:3000"
print_status "  - API: http://localhost:5000"
print_status "  - Health Check: http://localhost:5000/health"

if [ "$ENVIRONMENT" = "production" ]; then
    print_status "  - Nginx Proxy: http://localhost:80"
fi

print_status "To view logs: docker-compose -f $COMPOSE_FILE logs -f"
print_status "To stop services: docker-compose -f $COMPOSE_FILE down"
