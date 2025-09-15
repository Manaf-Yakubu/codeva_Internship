require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { createServer } = require('http');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const typeDefs = require('./schema/typeDefs');
const resolvers = require('./resolvers');
const { sequelize } = require('./models');
const AuthUtils = require('./utils/auth');
const DataLoaderFactory = require('./utils/dataLoader');

async function startServer() {
  // Create Express app
  const app = express();

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
    crossOriginEmbedderPolicy: false
  }));

  // CORS configuration
  app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
  }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
    message: {
      error: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
  });

  app.use('/graphql', limiter);

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'OK',
      message: 'GraphQL API is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      // Handle HTTP requests
      let user = null;
      const token = AuthUtils.extractTokenFromHeader(req.headers.authorization);
      
      if (token) {
        try {
          const decoded = AuthUtils.verifyToken(token);
          const { User } = require('./models');
          user = await User.findByPk(decoded.id);
        } catch (error) {
          // Token is invalid, but we don't throw an error here
          // Let individual resolvers handle authentication requirements
          console.warn('Invalid token provided:', error.message);
        }
      }

      return {
        user,
        loaders: DataLoaderFactory.createLoaders(),
        req
      };
    },
    formatError: (error) => {
      console.error('GraphQL Error:', error);
      
      // Don't expose internal errors in production
      if (process.env.NODE_ENV === 'production') {
        // Only return safe error messages
        if (error.message.startsWith('Database')) {
          return new Error('Internal server error');
        }
      }
      
      return error;
    },
    formatResponse: (response, { request, context }) => {
      // Clear DataLoader cache after each request
      if (context && context.loaders) {
        DataLoaderFactory.clearAll(context.loaders);
      }
      return response;
    },
    introspection: process.env.NODE_ENV !== 'production',
    playground: process.env.NODE_ENV !== 'production' ? {
      settings: {
        'request.credentials': 'include'
      }
    } : false
  });

  // Start the server
  await server.start();

  // Apply Apollo GraphQL middleware
  server.applyMiddleware({ 
    app, 
    path: '/graphql',
    cors: false // We handle CORS above
  });

  // Create HTTP server
  const httpServer = createServer(app);

  // Test database connection
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');
    console.log('💡 Run "npm run db:migrate" and "npm run db:seed" to set up the database');
  } catch (error) {
    console.error('❌ Unable to connect to database:', error);
    process.exit(1);
  }

  const PORT = process.env.PORT || 4000;
  
  httpServer.listen(PORT, () => {
    console.log(`🚀 GraphQL Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`🏥 Health check available at http://localhost:${PORT}/health`);
    
    if (process.env.NODE_ENV !== 'production') {
      console.log(`🎮 GraphQL Playground available at http://localhost:${PORT}${server.graphqlPath}`);
    }
  });

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully');
    await server.stop();
    await sequelize.close();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully');
    await server.stop();
    await sequelize.close();
    process.exit(0);
  });
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
