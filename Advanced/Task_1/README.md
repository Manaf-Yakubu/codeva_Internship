# CodeVa Full-Stack Application - Advanced Task 1

A comprehensive PERN (PostgreSQL, Express, React, Node.js) stack application with authentication, role-based access control, and modern UI/UX design.

## 🚀 Features

- **Authentication System**: JWT-based authentication with refresh tokens
- **Role-Based Access Control**: User and Admin roles with protected routes
- **Modern React Frontend**: Responsive design with Ghana-inspired themes
- **RESTful API**: Complete CRUD operations with Express.js
- **PostgreSQL Database**: Robust data persistence with Sequelize ORM
- **Performance Optimized**: Caching, compression, and optimized queries
- **Deployment Ready**: Docker configuration and production setup

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Primary database
- **Sequelize** - ORM for database operations
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Redis** - Session storage and caching

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Material-UI** - Component library
- **React Query** - Data fetching and caching

### DevOps & Deployment
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy and static file serving
- **PM2** - Process management

## 📁 Project Structure

```
codeva-fullstack-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   ├── context/       # React context providers
│   │   ├── utils/         # Utility functions
│   │   └── styles/        # CSS and theme files
│   ├── public/            # Static assets
│   └── package.json
├── server/                # Node.js backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Database models
│   │   ├── middleware/    # Custom middleware
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Utility functions
│   │   └── config/        # Configuration files
│   ├── tests/             # Test files
│   └── package.json
├── docker-compose.yml     # Docker services configuration
├── nginx.conf            # Nginx configuration
└── README.md

```

## 🚦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- Redis (v6 or higher) - Optional but recommended
- Docker (optional, for containerized deployment)

### Quick Start

1. **Clone and setup the project:**
```bash
git clone <repository-url>
cd codeva-fullstack-app
npm run install-all
```

2. **Automated Setup (Recommended):**
```bash
# Run the automated setup script
node setup-database.js

# Start the application
npm run dev
```

3. **Manual Setup:**
```bash
# Copy environment files
cp server/.env.example server/.env
cp client/.env.example client/.env

# Create database
createdb -U postgres codeva_fullstack

# Run migrations and seed data
cd server
npm run migrate
npm run seed
cd ..

# Start development servers
npm run dev
```

4. **Docker Setup (Alternative):**
```bash
# Development environment
docker-compose up --build

# Production environment
docker-compose -f docker-compose.prod.yml up --build -d
```

### Default Login Credentials
- **Admin**: admin@codeva.com / Admin123!
- **User**: user@codeva.com / User123!

## 🔐 Authentication

The application implements a comprehensive authentication system:

- **JWT Access Tokens** (15 minutes expiry)
- **Refresh Tokens** (7 days expiry)
- **Role-based permissions** (User/Admin)
- **Secure HTTP-only cookies**
- **Multi-device logout support**

### Testing & Verification
```bash
# Test the application
node test-application.js

# Test database connection
cd server && node test-db.js
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - Logout current session
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user profile

### User Management (Admin Only)
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/:id/role` - Update user role
- `DELETE /api/admin/users/:id` - Delete user

### Application Features
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/products` - Product listings
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

## 🎨 UI/UX Features

- **Responsive Design** - Mobile-first approach
- **Ghana-Inspired Theme** - Red, gold, and green color palette
- **Dark/Light Mode** - User preference toggle
- **Loading States** - Skeleton loaders and spinners
- **Error Handling** - User-friendly error messages
- **Accessibility** - WCAG 2.1 compliant

## ⚡ Performance Optimizations

### Backend
- **Database Indexing** - Optimized queries
- **Response Compression** - Gzip compression
- **Rate Limiting** - API protection
- **Caching** - Redis-based caching
- **Connection Pooling** - Database optimization

### Frontend
- **Code Splitting** - Lazy loading of components
- **Image Optimization** - WebP format and lazy loading
- **Bundle Optimization** - Tree shaking and minification
- **Service Worker** - Offline functionality
- **React Query** - Intelligent data caching

## 🐳 Deployment

### Docker Deployment
```bash
# Build and start all services
docker-compose up --build

# Production deployment
docker-compose -f docker-compose.prod.yml up -d
```

### Manual Deployment
```bash
# Build frontend
npm run build

# Start production server
npm start
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Backend tests only
cd server && npm test

# Frontend tests only
cd client && npm test

# Test coverage
npm run test:coverage
```

## 🔧 Environment Variables

### Server (.env)
```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/codeva_fullstack
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
REDIS_URL=redis://localhost:6379
```

### Client (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=CodeVa Full-Stack App
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Yakubu Abdul Manaf**  
CodeVa Internship Program  
Ghana, West Africa  

---

*Built with ❤️ for the CodeVa Internship Advanced Level Task 1*
