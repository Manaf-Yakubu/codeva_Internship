const jwt = require('jsonwebtoken');
const { User, RefreshToken } = require('../models');
const { getRedisClient } = require('../config/database');

// Verify JWT token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken || 
                  req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    // Check if token is blacklisted (Redis)
    const redisClient = getRedisClient();
    if (redisClient) {
      const isBlacklisted = await redisClient.get(`blacklist:${token}`);
      if (isBlacklisted) {
        return res.status(401).json({
          success: false,
          message: 'Token has been revoked'
        });
      }
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findByPk(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Access token expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid access token'
      });
    }

    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

// Check if user has required role
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Admin only middleware
const requireAdmin = requireRole('admin');

// Optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken || 
                  req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    
    if (user && user.isActive) {
      req.user = user;
      req.token = token;
    }
  } catch (error) {
    // Ignore errors for optional auth
  }
  
  next();
};

// Rate limiting for sensitive operations
const sensitiveOperationLimit = async (req, res, next) => {
  const redisClient = getRedisClient();
  if (!redisClient) return next();

  const key = `sensitive:${req.ip}:${req.user?.id || 'anonymous'}`;
  const limit = 5; // 5 attempts
  const window = 15 * 60; // 15 minutes

  try {
    const current = await redisClient.get(key);
    
    if (current && parseInt(current) >= limit) {
      return res.status(429).json({
        success: false,
        message: 'Too many sensitive operations. Please try again later.',
        retryAfter: window
      });
    }

    await redisClient.setEx(key, window, (parseInt(current) || 0) + 1);
    next();
  } catch (error) {
    console.error('Rate limiting error:', error);
    next(); // Continue if Redis fails
  }
};

module.exports = {
  verifyToken,
  requireRole,
  requireAdmin,
  optionalAuth,
  sensitiveOperationLimit
};
