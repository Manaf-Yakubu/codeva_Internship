# Task 1: Advanced Full-Stack PERN Application

## Project Overview

This is a comprehensive full-stack web application built using the PERN stack (PostgreSQL, Express.js, React, Node.js) that demonstrates advanced web development concepts including authentication, role-based access control, database management, and modern UI/UX design.

## 🚀 Features

### Backend Features
- **RESTful API** with Express.js
- **PostgreSQL Database** with Sequelize ORM
- **JWT Authentication** with access and refresh tokens
- **Role-based Access Control** (User/Admin)
- **Redis Caching** for session management
- **Input Validation** with express-validator
- **Rate Limiting** for API security
- **File Upload** capabilities
- **Comprehensive Error Handling**
- **Database Seeding** with sample data
- **API Documentation** with detailed endpoints

### Frontend Features
- **React 18** with modern hooks and patterns
- **Material-UI** component library
- **Responsive Design** with mobile-first approach
- **Ghana-themed Design** with cultural elements
- **React Query** for efficient data fetching
- **React Router v6** for client-side routing
- **Authentication Context** for state management
- **Toast Notifications** for user feedback
- **Loading States** and error handling
- **Framer Motion** animations
- **Dark/Light Theme** support

### Security Features
- **Password Hashing** with bcryptjs
- **JWT Token Management** with blacklisting
- **CORS Configuration**
- **Helmet** for security headers
- **Rate Limiting** on sensitive endpoints
- **Input Sanitization**
- **SQL Injection Prevention**
- **XSS Protection**

## 🛠 Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Primary database
- **Redis** - Caching and session storage
- **Sequelize** - ORM for database operations
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **Multer** - File upload handling
- **Morgan** - HTTP request logging
- **Compression** - Response compression
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Material-UI (MUI)** - Component library
- **React Router v6** - Client-side routing
- **React Query** - Data fetching and caching
- **Axios** - HTTP client
- **Framer Motion** - Animation library
- **React Hot Toast** - Notifications
- **React Hook Form** - Form handling

### DevOps & Deployment
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy and load balancer
- **GitHub Actions** - CI/CD pipeline
- **Environment Variables** - Configuration management

## 📁 Project Structure

```
Task_1/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Layout/         # Layout components (Navbar, Footer)
│   │   │   ├── Auth/           # Authentication components
│   │   │   └── UI/             # Generic UI components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API service layer
│   │   ├── context/            # React context providers
│   │   ├── styles/             # Global styles and theme
│   │   └── utils/              # Utility functions
│   ├── public/                 # Static assets
│   ├── Dockerfile              # Frontend container config
│   ├── nginx.conf              # Nginx configuration
│   └── package.json            # Frontend dependencies
├── server/                     # Express backend
│   ├── src/
│   │   ├── config/             # Database and Redis config
│   │   ├── models/             # Sequelize models
│   │   ├── routes/             # API route handlers
│   │   ├── middleware/         # Custom middleware
│   │   ├── utils/              # Utility functions
│   │   └── scripts/            # Database scripts
│   ├── uploads/                # File upload directory
│   ├── Dockerfile              # Backend container config
│   └── package.json            # Backend dependencies
├── docker-compose.yml          # Multi-container setup
├── nginx.conf                  # Production nginx config
├── README.md                   # Project documentation
└── package.json                # Root package.json
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- Redis (v6 or higher)
- Docker & Docker Compose (optional)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Task_1
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   # Backend
   cp server/.env.example server/.env
   # Frontend
   cp client/.env.example client/.env
   ```

4. **Configure database**
   - Create PostgreSQL database
   - Update database credentials in `server/.env`
   - Start Redis server

5. **Run database migrations and seed**
   ```bash
   cd server
   npm run db:migrate
   npm run db:seed
   ```

6. **Start development servers**
   ```bash
   # Root directory
   npm run dev
   ```

### Docker Setup

1. **Build and start containers**
   ```bash
   docker-compose up -d
   ```

2. **Run database migrations**
   ```bash
   docker-compose exec api npm run db:migrate
   docker-compose exec api npm run db:seed
   ```

## 🔐 Authentication System

### User Roles
- **User**: Basic access to products, profile management
- **Admin**: Full system access, user management, product management

### Default Accounts
- **Admin**: admin@codeva.com / Admin123!
- **User**: user@codeva.com / User123!

### Token Management
- **Access Tokens**: Short-lived (15 minutes)
- **Refresh Tokens**: Long-lived (7 days)
- **Token Rotation**: Automatic refresh token rotation
- **Blacklisting**: Redis-based token blacklisting

## 📊 Database Schema

### Users Table
- id (UUID, Primary Key)
- firstName, lastName
- email (Unique)
- password (Hashed)
- role (Enum: user, admin)
- isActive (Boolean)
- preferences (JSON)
- timestamps

### Products Table
- id (UUID, Primary Key)
- name, description
- price, stock
- category, sku
- isFeatured, isActive
- images (Array)
- createdBy (Foreign Key to Users)
- timestamps

### RefreshTokens Table
- id (UUID, Primary Key)
- token (Unique)
- userId (Foreign Key to Users)
- expiresAt
- isRevoked
- timestamps

## 🌐 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /refresh` - Refresh access token
- `GET /me` - Get current user
- `POST /logout` - Logout single device
- `POST /logout-all` - Logout all devices
- `PUT /change-password` - Change password

### User Routes (`/api/users`)
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `PUT /preferences` - Update user preferences
- `GET /:id` - Get user by ID

### Product Routes (`/api/products`)
- `GET /` - List products (with filters)
- `GET /featured` - Get featured products
- `GET /:id` - Get product by ID
- `POST /` - Create product (Admin)
- `PUT /:id` - Update product (Admin)
- `DELETE /:id` - Delete product (Admin)
- `PUT /:id/featured` - Toggle featured status (Admin)

### Admin Routes (`/api/admin`)
- `GET /stats` - System statistics
- `GET /users` - List all users
- `GET /users/:id` - Get user details
- `PUT /users/:id/role` - Update user role
- `PUT /users/:id/status` - Update user status
- `DELETE /users/:id` - Delete user
- `GET /products` - List all products

### Dashboard Routes (`/api/dashboard`)
- `GET /stats` - Dashboard statistics
- `GET /activities` - Recent activities

## 🎨 UI/UX Features

### Design System
- **Ghana Flag Colors**: Red (#CE1126), Gold (#FCD116), Green (#006B3F)
- **Typography**: Roboto font family
- **Spacing**: 8px base unit system
- **Breakpoints**: Mobile-first responsive design

### Components
- **Layout**: Responsive navbar and footer
- **Forms**: Validation and error handling
- **Data Tables**: Sorting, filtering, pagination
- **Modals**: Confirmation dialogs
- **Notifications**: Toast messages
- **Loading States**: Spinners and skeletons
- **Animations**: Smooth transitions

### Pages
- **Home**: Hero section, features, statistics
- **Authentication**: Login and registration
- **Dashboard**: User/Admin dashboards
- **Products**: Product listing and details
- **Profile**: User profile management
- **Admin**: User and product management
- **404**: Custom not found page

## ⚡ Performance Optimizations

### Backend
- **Database Indexing**: Optimized queries
- **Redis Caching**: Session and data caching
- **Compression**: Gzip response compression
- **Rate Limiting**: API protection
- **Connection Pooling**: Database connections
- **Query Optimization**: Efficient Sequelize queries

### Frontend
- **Code Splitting**: Lazy loading pages
- **React Query**: Data caching and synchronization
- **Image Optimization**: Responsive images
- **Bundle Optimization**: Vite build optimizations
- **Memoization**: React.memo and useMemo
- **Virtual Scrolling**: Large data sets

## 🚀 Deployment

### Production Environment Variables
```bash
# Backend
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:port/db
REDIS_URL=redis://host:port
JWT_SECRET=your-production-secret
JWT_REFRESH_SECRET=your-production-refresh-secret

# Frontend
VITE_API_URL=https://your-api-domain.com/api
```

### Docker Deployment
```bash
# Production build
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# With SSL
docker-compose --profile production up -d
```

### Manual Deployment
1. Build frontend: `cd client && npm run build`
2. Set up reverse proxy (Nginx)
3. Configure SSL certificates
4. Set up process manager (PM2)
5. Configure monitoring and logging

## 🧪 Testing

### Backend Testing
```bash
cd server
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report
```

### Frontend Testing
```bash
cd client
npm test                    # Run all tests
npm run test:ui            # UI tests
npm run test:e2e           # End-to-end tests
```

## 📈 Monitoring & Logging

### Backend Logging
- **Morgan**: HTTP request logging
- **Winston**: Application logging
- **Error Tracking**: Centralized error handling

### Performance Monitoring
- **Health Checks**: `/api/health` endpoint
- **Database Monitoring**: Connection pool metrics
- **Redis Monitoring**: Cache hit rates
- **API Metrics**: Response times and error rates

## 🔒 Security Best Practices

### Implementation
- **HTTPS**: SSL/TLS encryption
- **CORS**: Configured for specific origins
- **Helmet**: Security headers
- **Rate Limiting**: Brute force protection
- **Input Validation**: Server-side validation
- **SQL Injection**: Parameterized queries
- **XSS Protection**: Content sanitization
- **CSRF Protection**: Token-based protection

### Environment Security
- **Environment Variables**: Sensitive data protection
- **Secrets Management**: Secure key storage
- **Database Security**: Connection encryption
- **Container Security**: Minimal base images

## 📚 Learning Outcomes

This project demonstrates proficiency in:

1. **Full-Stack Development**: End-to-end application development
2. **Database Design**: Relational database modeling
3. **API Development**: RESTful API design and implementation
4. **Authentication**: JWT-based authentication systems
5. **Frontend Development**: Modern React patterns and practices
6. **State Management**: Context API and React Query
7. **UI/UX Design**: Material Design principles
8. **Security**: Web application security best practices
9. **DevOps**: Containerization and deployment
10. **Performance**: Optimization techniques
11. **Testing**: Unit and integration testing
12. **Documentation**: Comprehensive project documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Developer Information

**Developer**: Manaf Yakubu  
**Email**: manafyakubu01@gmail.com  
**GitHub**: [Manaf-Yakubu](https://github.com/Manaf-Yakubu)  
**LinkedIn**: [Manaf Yakubu](https://linkedin.com/in/manaf-yakubu)

**Project**: Advanced Full-Stack PERN Application  
**Institution**: CodeVA Internship Program  
**Date**: September 2025  
**Version**: 1.0.0

---

*This project showcases advanced full-stack development skills and modern web development practices, serving as a comprehensive example of a production-ready web application.*
