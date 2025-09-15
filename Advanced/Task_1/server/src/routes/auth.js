const express = require('express');
const { User, RefreshToken } = require('../models');
const { verifyToken, sensitiveOperationLimit } = require('../middleware/auth');
const { validateRegister, validateLogin, validatePasswordChange } = require('../middleware/validation');
const { generateTokenPair, verifyRefreshToken, setTokenCookies, clearTokenCookies } = require('../utils/jwt');
const { getRedisClient } = require('../config/database');

const router = express.Router();

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', validateRegister, async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokenPair(user);

    // Save refresh token to database
    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);

    await RefreshToken.create({
      token: refreshToken,
      userId: user.id,
      expiresAt: refreshTokenExpiry,
      deviceInfo: {
        userAgent: req.headers['user-agent'],
        ip: req.ip
      },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    // Set cookies
    setTokenCookies(res, accessToken, refreshToken);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: user.toJSON(),
        accessToken
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findByEmail(email);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = generateTokenPair(user);

    // Save refresh token to database
    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);

    await RefreshToken.create({
      token: refreshToken,
      userId: user.id,
      expiresAt: refreshTokenExpiry,
      deviceInfo: {
        userAgent: req.headers['user-agent'],
        ip: req.ip
      },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    // Set cookies
    setTokenCookies(res, accessToken, refreshToken);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toJSON(),
        accessToken
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
router.post('/refresh', async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required'
      });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Check if refresh token exists in database
    const tokenRecord = await RefreshToken.findValidToken(refreshToken);
    if (!tokenRecord) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }

    // Get user
    const user = await User.findByPk(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokenPair(user);

    // Revoke old refresh token and create new one
    tokenRecord.isRevoked = true;
    await tokenRecord.save();

    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);

    await RefreshToken.create({
      token: newRefreshToken,
      userId: user.id,
      expiresAt: refreshTokenExpiry,
      deviceInfo: tokenRecord.deviceInfo,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    // Set new cookies
    setTokenCookies(res, accessToken, newRefreshToken);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken
      }
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({
      success: false,
      message: 'Token refresh failed'
    });
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', verifyToken, async (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user.toJSON()
    }
  });
});

// @desc    Logout user (current device)
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', verifyToken, async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      // Revoke refresh token
      await RefreshToken.update(
        { isRevoked: true },
        { where: { token: refreshToken } }
      );
    }

    // Add access token to blacklist (Redis)
    const redisClient = getRedisClient();
    if (redisClient && req.token) {
      const tokenExpiry = 15 * 60; // 15 minutes
      await redisClient.setEx(`blacklist:${req.token}`, tokenExpiry, 'true');
    }

    // Clear cookies
    clearTokenCookies(res);

    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
});

// @desc    Logout user from all devices
// @route   POST /api/auth/logout-all
// @access  Private
router.post('/logout-all', verifyToken, sensitiveOperationLimit, async (req, res) => {
  try {
    // Revoke all refresh tokens for user
    await RefreshToken.revokeAllForUser(req.user.id);

    // Clear cookies
    clearTokenCookies(res);

    res.json({
      success: true,
      message: 'Logged out from all devices successfully'
    });
  } catch (error) {
    console.error('Logout all error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout from all devices failed'
    });
  }
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
router.put('/change-password', verifyToken, validatePasswordChange, sensitiveOperationLimit, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Verify current password
    const isCurrentPasswordValid = await req.user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    req.user.password = newPassword;
    await req.user.save();

    // Revoke all refresh tokens (force re-login on all devices)
    await RefreshToken.revokeAllForUser(req.user.id);

    res.json({
      success: true,
      message: 'Password changed successfully. Please login again.'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Password change failed'
    });
  }
});

module.exports = router;
