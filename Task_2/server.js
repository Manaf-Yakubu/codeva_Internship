const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// In-memory storage for users (in production, you'd use a database)
let users = [
  { id: 1, name: 'Yakubu Manaf', email: 'yakubumanaf732hub@gmail.com', age: 22 },
  { id: 2, name: 'Hassi Smith', email: 'Hassi@gmail.com', age: 25 },
  { id: 3, name: 'Bob Karim', email: 'Karim@gmail.com', age: 35 }
];

let nextId = 4; // Counter for generating new IDs

// Helper function to find user by ID
const findUserById = (id) => {
  return users.find(user => user.id === parseInt(id));
};

// Helper function to validate user data
const validateUser = (userData) => {
  const { name, email, age } = userData;
  
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return { isValid: false, message: 'Name is required and must be a non-empty string' };
  }
  
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return { isValid: false, message: 'Valid email is required' };
  }
  
  if (!age || typeof age !== 'number' || age < 0 || age > 150) {
    return { isValid: false, message: 'Age must be a number between 0 and 150' };
  }
  
  return { isValid: true };
};

// Routes

// GET /api/users - Get all users
app.get('/api/users', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: users,
      count: users.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// GET /api/users/:id - Get user by ID
app.get('/api/users/:id', (req, res) => {
  try {
    const user = findUserById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// POST /api/users - Create new user
app.post('/api/users', (req, res) => {
  try {
    const validation = validateUser(req.body);
    
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }
    
    // Check if email already exists
    const existingUser = users.find(user => user.email === req.body.email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    const newUser = {
      id: nextId++,
      name: req.body.name.trim(),
      email: req.body.email.trim().toLowerCase(),
      age: req.body.age
    };
    
    users.push(newUser);
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// PUT /api/users/:id - Update user by ID
app.put('/api/users/:id', (req, res) => {
  try {
    const user = findUserById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const validation = validateUser(req.body);
    
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }
    
    // Check if email already exists (excluding current user)
    const existingUser = users.find(u => u.email === req.body.email && u.id !== user.id);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    // Update user properties
    user.name = req.body.name.trim();
    user.email = req.body.email.trim().toLowerCase();
    user.age = req.body.age;
    
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// DELETE /api/users/:id - Delete user by ID
app.delete('/api/users/:id', (req, res) => {
  try {
    const userIndex = users.findIndex(user => user.id === parseInt(req.params.id));
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const deletedUser = users.splice(userIndex, 1)[0];
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: deletedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Handle 404 for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation:`);
  console.log(`   GET    /api/users     - Get all users`);
  console.log(`   GET    /api/users/:id - Get user by ID`);
  console.log(`   POST   /api/users     - Create new user`);
  console.log(`   PUT    /api/users/:id - Update user by ID`);
  console.log(`   DELETE /api/users/:id - Delete user by ID`);
  console.log(`   GET    /health        - Health check`);
});

module.exports = app;
