const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { connectDB, syncDatabase, checkDBHealth } = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import routes
const userRoutes = require('./routes/users');
const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const dbHealth = await checkDBHealth();
    
    res.json({
      success: true,
      message: 'CodeVa Task 3 API is running',
      data: {
        server: 'healthy',
        database: dbHealth,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        version: '1.0.0'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: error.message
    });
  }
});

// API routes
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Welcome endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to CodeVa Task 3: Database Integration API',
    description: 'A comprehensive e-commerce API built with Node.js, Express, and PostgreSQL',
    author: 'Yakubu Abdul Manaf',
    country: 'Ghana 🇬🇭',
    features: [
      'PostgreSQL with Sequelize ORM',
      'Complete CRUD operations',
      'Data validation and error handling',
      'Database indexing and optimization',
      'Ghana-specific features and localization',
      'Comprehensive API documentation'
    ],
    endpoints: {
      users: '/api/users',
      categories: '/api/categories',
      products: '/api/products',
      orders: '/api/orders',
      health: '/health'
    },
    documentation: 'See README.md for detailed API documentation'
  });
});

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Sync database models
    await syncDatabase(false); // Set to true to force recreate tables
    
    console.log('🔗 Database models synchronized');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    🚀 SERVER STARTED                         ║
╠══════════════════════════════════════════════════════════════╣
║  CodeVa Internship Task 3: Database Integration             ║
║  Author: Yakubu Abdul Manaf                                 ║
║  Country: Ghana 🇬🇭                                          ║
║                                                              ║
║  Server: http://localhost:${PORT}                                ║
║  Environment: ${process.env.NODE_ENV || 'development'}                              ║
║  Database: PostgreSQL (codeva_Task_3_db)                    ║
║                                                              ║
║  API Endpoints:                                              ║
║  • GET  /                    - Welcome message              ║
║  • GET  /health              - Health check                 ║
║  • CRUD /api/users           - User management              ║
║  • CRUD /api/categories      - Category management          ║
║  • CRUD /api/products        - Product management           ║
║  • CRUD /api/orders          - Order management             ║
║                                                              ║
║  Features:                                                   ║
║  ✅ PostgreSQL with Sequelize ORM                           ║
║  ✅ Complete CRUD operations                                ║
║  ✅ Data validation & error handling                        ║
║  ✅ Database indexing & optimization                        ║
║  ✅ Ghana-specific features                                 ║
║  ✅ Comprehensive API documentation                         ║
╚══════════════════════════════════════════════════════════════╝
      `);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  process.exit(1);
});

// Start the server
startServer();

module.exports = app;
