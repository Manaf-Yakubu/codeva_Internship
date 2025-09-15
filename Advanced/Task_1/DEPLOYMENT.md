# CodeVA Full-Stack Application - Deployment Guide

## 🚀 Quick Start

### Development Deployment
```bash
# Clone and setup
git clone <repository-url>
cd codeva-fullstack-app
npm run install-all

# Start development servers
npm run dev
```

### Docker Deployment (Recommended)
```bash
# Development
./deploy.sh development
# or on Windows
deploy.bat development

# Production
./deploy.sh production
# or on Windows
deploy.bat production
```

## 📋 Prerequisites

### Required Software
- **Node.js** (v18 or higher)
- **PostgreSQL** (v14 or higher)
- **Redis** (v6 or higher)
- **Docker & Docker Compose** (for containerized deployment)

### Environment Setup

1. **Copy environment files:**
```bash
# Server
cp server/.env.example server/.env
cp server/.env.example server/.env.production

# Client
cp client/.env.example client/.env
cp client/.env.example client/.env.production
```

2. **Configure environment variables:**
   - Update database credentials
   - Set secure JWT secrets (minimum 32 characters)
   - Configure API URLs for your domain
   - Set up email configuration (optional)

## 🔧 Configuration

### Database Configuration
```env
# Development
DATABASE_URL=postgresql://postgres:password@localhost:5432/codeva_fullstack

# Production
DATABASE_URL=postgresql://username:secure_password@localhost:5432/codeva_fullstack_prod
```

### Security Configuration
```env
# IMPORTANT: Change these for production!
JWT_SECRET=your-super-secure-production-jwt-secret-key-minimum-32-characters
JWT_REFRESH_SECRET=your-super-secure-production-refresh-secret-key-minimum-32-characters
```

### API Configuration
```env
# Development
VITE_API_URL=http://localhost:5000/api

# Production
VITE_API_URL=https://api.yourdomain.com/api
```

## 🐳 Docker Deployment

### Development Environment
```bash
docker-compose up --build
```

### Production Environment
```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

### Environment Variables for Docker
Create a `.env` file in the root directory:
```env
DB_PASSWORD=your_secure_database_password
REDIS_PASSWORD=your_secure_redis_password
```

## 🌐 Production Deployment

### 1. Server Setup
```bash
# Install dependencies
npm run install-all

# Build frontend
npm run build

# Run database migrations
cd server && npm run migrate && npm run seed
```

### 2. Process Management (PM2)
```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save
pm2 startup
```

### 3. Nginx Configuration
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔒 SSL/HTTPS Setup

### Using Certbot (Let's Encrypt)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 Monitoring & Health Checks

### Health Check Endpoints
- **API Health**: `GET /health`
- **Database Status**: Included in health check
- **Redis Status**: Included in health check

### Logging
```bash
# View application logs
docker-compose logs -f api

# View nginx logs
docker-compose logs -f nginx

# PM2 logs
pm2 logs
```

## 🔧 Troubleshooting

### Common Issues

1. **Port Conflicts**
   - Ensure ports 3000, 5000, 5432, 6379 are available
   - Check with: `netstat -tulpn | grep :PORT`

2. **Database Connection Issues**
   - Verify PostgreSQL is running
   - Check database credentials
   - Ensure database exists

3. **Redis Connection Issues**
   - Verify Redis is running
   - Check Redis configuration
   - Test connection: `redis-cli ping`

4. **Docker Issues**
   - Check Docker daemon is running
   - Verify Docker Compose version
   - Clear Docker cache: `docker system prune`

### Performance Optimization

1. **Database Optimization**
   - Add proper indexes
   - Use connection pooling
   - Enable query optimization

2. **Caching Strategy**
   - Redis for session storage
   - API response caching
   - Static file caching

3. **Frontend Optimization**
   - Code splitting
   - Image optimization
   - Bundle size optimization

## 🚦 Deployment Checklist

### Pre-deployment
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] SSL certificates obtained
- [ ] Backup strategy in place
- [ ] Monitoring setup complete

### Security Checklist
- [ ] JWT secrets changed from defaults
- [ ] Database passwords are secure
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation in place
- [ ] SQL injection protection active

### Performance Checklist
- [ ] Database indexes created
- [ ] Caching strategy implemented
- [ ] Compression enabled
- [ ] Static files optimized
- [ ] CDN configured (if applicable)

## 📞 Support

For deployment issues or questions:
- Check the troubleshooting section above
- Review application logs
- Verify environment configuration
- Ensure all prerequisites are met

---

**Author**: Yakubu Abdul Manaf  
**Project**: CodeVA Internship Advanced Task 1  
**Version**: 1.0.0
