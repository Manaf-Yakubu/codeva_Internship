# CodeVa Auth - Quick Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup PostgreSQL Database

#### Option A: Using PostgreSQL locally
1. Install PostgreSQL on your system
2. Create database and user:
```sql
CREATE DATABASE codeva_auth;
CREATE USER codeva_user WITH PASSWORD 'codeva_password';
GRANT ALL PRIVILEGES ON DATABASE codeva_auth TO codeva_user;
```

#### Option B: Using Docker (Recommended for development)
```bash
# Run PostgreSQL in Docker
docker run --name codeva-postgres \
  -e POSTGRES_DB=codeva_auth \
  -e POSTGRES_USER=codeva_user \
  -e POSTGRES_PASSWORD=codeva_password \
  -p 5432:5432 \
  -d postgres:15
```

### 3. Configure Environment
The `.env` file is already configured with default values. Update if needed:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=codeva_auth
DB_USER=codeva_user
DB_PASSWORD=codeva_password
```

### 4. Initialize Database
```bash
npm run db:setup
```

This creates:
- Users table with proper schema
- Refresh tokens table
- Database indexes
- Default admin user (admin@codeva.com / admin123)

### 5. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 🧪 Testing the API

### Using the provided test file
Open `test-api.http` in VS Code with REST Client extension and run the requests.

### Using curl commands

#### 1. Health Check
```bash
curl http://localhost:3000/health
```

#### 2. Register a new user
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

#### 3. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

#### 4. Access protected route (replace TOKEN)
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### 5. Admin login (default admin)
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@codeva.com",
    "password": "admin123"
  }'
```

#### 6. Admin stats (replace with admin token)
```bash
curl -X GET http://localhost:3000/api/admin/stats \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN"
```

## 🔧 Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database exists and user has permissions

### Port Already in Use
- Change PORT in `.env` file
- Or kill process using port 3000: `netstat -ano | findstr :3000`

### JWT Token Issues
- Ensure JWT_SECRET is set in `.env`
- Check token expiration times
- Verify token format in Authorization header

## 📊 Project Status

✅ **Completed Features:**
- User registration and login
- JWT access and refresh tokens
- Password hashing with bcrypt
- Role-based access control (user/admin)
- Protected routes with middleware
- Input validation and error handling
- Rate limiting and security headers
- Admin dashboard endpoints
- Token refresh and logout functionality
- Comprehensive documentation

✅ **Security Features:**
- HTTP-only secure cookies
- CORS protection
- Rate limiting
- Input sanitization
- SQL injection prevention
- Password strength requirements

✅ **Admin Features:**
- System statistics
- User management
- Role updates
- Token cleanup
- User details view

## 🎯 Next Steps

1. Install dependencies: `npm install`
2. Setup PostgreSQL database
3. Run database setup: `npm run db:setup`
4. Start server: `npm run dev`
5. Test endpoints using provided test file
6. Customize for your specific needs

## 📝 Default Credentials

**Admin User:**
- Email: admin@codeva.com
- Password: admin123
- Role: admin

**Change the admin password immediately in production!**
