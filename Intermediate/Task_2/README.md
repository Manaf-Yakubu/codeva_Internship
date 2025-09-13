# CodeVa Auth - Authentication & Authorization System

A comprehensive Node.js authentication and authorization system built with JWT tokens, bcrypt password hashing, and PostgreSQL database. This project implements secure user authentication with role-based access control for the CodeVa Internship Task 2.

## 🚀 Features

### Core Authentication
- **User Registration & Login** - Secure signup and login with email/password
- **JWT Token Authentication** - Access tokens (15min) and refresh tokens (7 days)
- **Password Security** - bcrypt hashing with configurable salt rounds
- **Secure Token Storage** - HTTP-only, secure cookies with SameSite protection
- **Token Refresh** - Automatic token renewal system
- **Multi-device Logout** - Logout from single device or all devices

### Security Features
- **Role-based Access Control** - User and Admin roles with protected routes
- **Input Validation** - Comprehensive validation with express-validator
- **Rate Limiting** - Protection against brute force attacks
- **Security Headers** - Helmet.js for security headers
- **CORS Protection** - Configurable cross-origin resource sharing
- **Environment Variables** - Secure configuration management

### Admin Features
- **System Statistics** - User counts, token stats, system info
- **User Management** - View, update roles, delete users
- **Token Management** - Clean up expired tokens
- **User Details** - Detailed user information and token statistics

## 🛠️ Tech Stack

- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL with pg driver
- **Authentication**: JWT (jsonwebtoken) + bcrypt
- **Validation**: express-validator
- **Security**: helmet, cors, express-rate-limit
- **Environment**: dotenv
- **Development**: nodemon

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## 🔧 Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Navigate to project directory
cd codeva-auth

# Install dependencies
npm install
```

### 2. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE codeva_auth;
CREATE USER your_db_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE codeva_auth TO your_db_user;
```

### 3. Environment Configuration

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Update `.env` with your database credentials and JWT secrets:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=codeva_auth
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT Configuration (use strong, random secrets in production)
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_REFRESH_SECRET=your_super_secret_refresh_jwt_key_here_make_it_long_and_random
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Server Configuration
PORT=3000
NODE_ENV=development

# Security
BCRYPT_ROUNDS=12
```

### 4. Initialize Database

Run the database setup script to create tables and default admin user:

```bash
npm run db:setup
```

This creates:
- Users table with proper schema
- Refresh tokens table for token management
- Database indexes for performance
- Default admin user (email: admin@codeva.com, password: admin123)

### 5. Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/auth/signup
Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role": "user" // optional, defaults to "user"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "refresh_token"
  }
}
```

#### POST /api/auth/login
Authenticate user and receive tokens.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### GET /api/auth/me
Get current authenticated user information.

**Headers:**
```
Authorization: Bearer <access_token>
```

#### POST /api/auth/refresh
Refresh expired access token using refresh token.

#### POST /api/auth/logout
Logout from current device (revokes refresh token).

#### POST /api/auth/logout-all
Logout from all devices (revokes all user's refresh tokens).

### Admin Endpoints (Requires Admin Role)

#### GET /api/admin/stats
Get system statistics including user counts and token information.

#### GET /api/admin/users
Get paginated list of all users.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

#### PUT /api/admin/users/:id/role
Update user role (admin cannot change own role).

**Request Body:**
```json
{
  "role": "admin" // or "user"
}
```

#### DELETE /api/admin/users/:id
Delete user account (admin cannot delete own account).

#### GET /api/admin/users/:id
Get detailed information about a specific user.

#### POST /api/admin/cleanup-tokens
Clean up expired and revoked refresh tokens.

## 🔒 Security Features

### Password Security
- Passwords hashed using bcrypt with configurable salt rounds
- Minimum password requirements enforced
- No plain text password storage

### JWT Token Security
- Short-lived access tokens (15 minutes)
- Long-lived refresh tokens (7 days)
- Secure token storage in HTTP-only cookies
- Token rotation on refresh

### Request Security
- Rate limiting on all endpoints
- Enhanced rate limiting on auth endpoints
- CORS protection with configurable origins
- Security headers via Helmet.js
- Input validation and sanitization

### Database Security
- Parameterized queries to prevent SQL injection
- Unique constraints on email addresses
- Proper indexing for performance
- Cascade deletion for data integrity

## 🧪 Testing

Test the API using curl, Postman, or any HTTP client:

### Register a new user:
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123!"
  }'
```

### Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'
```

### Access protected route:
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Admin statistics (requires admin token):
```bash
curl -X GET http://localhost:3000/api/admin/stats \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN"
```

## 🚀 Deployment

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use strong, random JWT secrets
- Configure proper database credentials
- Set secure CORS origins
- Use HTTPS in production

### Database Considerations
- Regular backups
- Connection pooling
- Monitor performance
- Clean up expired tokens periodically

## 🔧 Development

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run db:setup` - Initialize database tables
- `npm test` - Run tests (when implemented)

### Project Structure
```
codeva-auth/
├── config/
│   └── database.js          # Database connection
├── middleware/
│   └── auth.js              # Authentication middleware
├── models/
│   ├── User.js              # User model
│   └── RefreshToken.js      # Refresh token model
├── routes/
│   ├── auth.js              # Authentication routes
│   └── admin.js             # Admin routes
├── scripts/
│   └── setupDatabase.js     # Database initialization
├── utils/
│   ├── tokenUtils.js        # JWT utilities
│   └── validation.js        # Input validation
├── .env                     # Environment variables
├── .env.example             # Environment template
├── server.js                # Main server file
└── package.json             # Dependencies and scripts
```

## 👨‍💻 Author

**Yakubu Abdul Manaf**  
CodeVa Internship - Task 2 (Intermediate)  
Authentication & Authorization System

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

This is an internship project. For questions or suggestions, please contact the development team.

---

**Note**: This is a learning project for the CodeVa Internship program. Always follow security best practices when deploying to production environments.
