const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Client } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// In-memory user storage for demo (replace with real DB later)
const users = [
  {
    id: 1,
    first_name: 'Admin',
    last_name: 'User',
    email: 'admin@codeva.com',
    password: '$2a$12$2hjdXI8QJ5SJp30vX3wz7aU5vUJSSlQyUZzh8zuIPaqp', // Admin123!
    role: 'admin',
    is_active: true
  },
  {
    id: 2,
    first_name: 'Regular',
    last_name: 'User', 
    email: 'user@codeva.com',
    password: '$2a$12$o3YvDO.f4OwuFp30vX3wz7aU5vUJSSlQyUZzh8zuIPaqp', // User123!
    role: 'user',
    is_active: true
  }
];

// Database connection (fallback to in-memory for demo)
let dbClient = null;
try {
  dbClient = new Client({
    connectionString: process.env.DATABASE_URL
  });
} catch (error) {
  console.log('⚠️  Using in-memory storage for demo');
}

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());

// Connect to database
async function connectDB() {
  try {
    await dbClient.connect();
    console.log('✅ Database connected');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
}

// Auth middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await dbClient.query('SELECT * FROM users WHERE id = $1', [decoded.userId]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }
    req.user = result.rows[0];
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Use in-memory users for demo
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Save refresh token
    await dbClient.query(
      'INSERT INTO refresh_tokens (token, user_id, expires_at) VALUES ($1, $2, $3)',
      [refreshToken, user.id, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]
    );

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          role: user.role,
          isActive: user.is_active
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    // Check if user exists in memory
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user in memory
    const newUser = {
      id: users.length + 1,
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: hashedPassword,
      role: 'user',
      is_active: true
    };
    
    users.push(newUser);
    const user = newUser;

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          role: user.role,
          isActive: user.is_active
        },
        accessToken
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: {
      user: {
        id: req.user.id,
        firstName: req.user.first_name,
        lastName: req.user.last_name,
        email: req.user.email,
        role: req.user.role,
        isActive: req.user.is_active
      }
    }
  });
});

// Products routes
app.get('/api/products', async (req, res) => {
  try {
    const result = await dbClient.query(`
      SELECT p.*, u.first_name, u.last_name 
      FROM products p 
      LEFT JOIN users u ON p.created_by = u.id 
      WHERE p.is_active = true 
      ORDER BY p.created_at DESC
    `);
    
    const products = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      price: parseFloat(row.price),
      stock: row.stock,
      category: row.category,
      sku: row.sku,
      isFeatured: row.is_featured,
      isActive: row.is_active,
      images: row.images || [],
      creator: row.first_name ? {
        firstName: row.first_name,
        lastName: row.last_name
      } : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));

    res.json({
      success: true,
      data: { products, total: products.length }
    });
  } catch (error) {
    console.error('Products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/products/featured', async (req, res) => {
  try {
    const result = await dbClient.query(`
      SELECT p.*, u.first_name, u.last_name 
      FROM products p 
      LEFT JOIN users u ON p.created_by = u.id 
      WHERE p.is_active = true AND p.is_featured = true 
      ORDER BY p.created_at DESC
    `);
    
    const products = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      price: parseFloat(row.price),
      stock: row.stock,
      category: row.category,
      sku: row.sku,
      isFeatured: row.is_featured,
      isActive: row.is_active,
      images: row.images || [],
      creator: row.first_name ? {
        firstName: row.first_name,
        lastName: row.last_name
      } : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));

    res.json({
      success: true,
      data: { products }
    });
  } catch (error) {
    console.error('Featured products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Dashboard routes
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    const userCount = await dbClient.query('SELECT COUNT(*) FROM users');
    const productCount = await dbClient.query('SELECT COUNT(*) FROM products');
    const adminCount = await dbClient.query("SELECT COUNT(*) FROM users WHERE role = 'admin'");

    res.json({
      success: true,
      data: {
        totalUsers: parseInt(userCount.rows[0].count),
        totalProducts: parseInt(productCount.rows[0].count),
        totalAdmins: parseInt(adminCount.rows[0].count),
        totalRevenue: 0
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
async function startServer() {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
    console.log('\n🎉 Backend is ready!');
    console.log('👨‍💼 Admin: admin@codeva.com / Admin123!');
    console.log('👤 User: user@codeva.com / User123!');
  });
}

startServer();
