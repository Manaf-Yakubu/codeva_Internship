const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Temporary server running' 
  });
});

// Mock authentication endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Mock successful login
  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: 1,
        firstName: 'Test',
        lastName: 'User',
        email: email,
        role: email.includes('admin') ? 'admin' : 'user',
        isActive: true
      },
      accessToken: 'mock-jwt-token-' + Date.now()
    }
  });
});

app.post('/api/auth/register', (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  
  res.json({
    success: true,
    message: 'Registration successful',
    data: {
      user: {
        id: Math.floor(Math.random() * 1000),
        firstName,
        lastName,
        email,
        role: 'user',
        isActive: true
      },
      accessToken: 'mock-jwt-token-' + Date.now()
    }
  });
});

app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }
  
  res.json({
    success: true,
    data: {
      user: {
        id: 1,
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        role: 'user',
        isActive: true
      }
    }
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

// Catch all for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Temporary server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Mock authentication endpoints available`);
});

process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  process.exit(0);
});
