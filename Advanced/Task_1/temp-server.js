const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: 'development',
    version: '1.0.0'
  });
});

// Mock authentication endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Mock authentication - check for demo credentials
  if ((email === 'admin@codeva.com' && password === 'Admin123!') ||
      (email === 'user@codeva.com' && password === 'User123!')) {
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        accessToken: 'mock-jwt-token-' + Date.now(),
        user: {
          id: 1,
          email: email,
          firstName: email.includes('admin') ? 'Admin' : 'User',
          lastName: 'Demo',
          role: email.includes('admin') ? 'admin' : 'user'
        }
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  
  // Mock registration
  res.json({
    success: true,
    message: 'Registration successful',
    data: {
      user: {
        id: Date.now(),
        firstName,
        lastName,
        email,
        role: 'user'
      }
    }
  });
});

app.get('/api/auth/me', (req, res) => {
  res.json({
    success: true,
    data: {
      user: {
        id: 1,
        email: 'demo@codeva.com',
        firstName: 'Demo',
        lastName: 'User',
        role: 'user'
      }
    }
  });
});

// Mock product endpoints
app.get('/api/products', (req, res) => {
  res.json({
    success: true,
    data: {
      products: [
        {
          id: 1,
          name: 'Sample Product 1',
          description: 'This is a sample product',
          price: 99.99,
          stock: 10,
          category: 'Electronics'
        },
        {
          id: 2,
          name: 'Sample Product 2',
          description: 'Another sample product',
          price: 149.99,
          stock: 5,
          category: 'Accessories'
        }
      ]
    }
  });
});

// Mock dashboard endpoints
app.get('/api/dashboard/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      totalUsers: 150,
      totalProducts: 45,
      totalOrders: 230,
      revenue: 15750.50
    }
  });
});

// Catch-all for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Temporary server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Demo credentials:`);
  console.log(`   Admin: admin@codeva.com / Admin123!`);
  console.log(`   User: user@codeva.com / User123!`);
});
