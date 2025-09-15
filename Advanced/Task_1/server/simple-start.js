const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

// Basic middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Basic auth routes for testing
app.post('/api/auth/login', (req, res) => {
  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: 1,
        firstName: 'Test',
        lastName: 'User',
        email: req.body.email,
        role: 'user'
      },
      accessToken: 'test-token'
    }
  });
});

app.post('/api/auth/register', (req, res) => {
  res.json({
    success: true,
    message: 'Registration successful',
    data: {
      user: {
        id: 1,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        role: 'user'
      },
      accessToken: 'test-token'
    }
  });
});

app.get('/api/auth/me', (req, res) => {
  res.json({
    success: true,
    data: {
      user: {
        id: 1,
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        role: 'user'
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Simple server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
