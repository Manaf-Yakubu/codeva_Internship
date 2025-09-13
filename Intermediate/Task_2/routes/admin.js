const express = require('express');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { validateRoleUpdate, handleValidationErrors } = require('../utils/validation');

const router = express.Router();

// Apply authentication and admin authorization to all routes
router.use(authenticateToken);
router.use(authorizeRole('admin'));

// GET /api/admin/stats - Get system statistics (admin only)
router.get('/stats', async (req, res) => {
  try {
    // Get user statistics
    const totalUsersQuery = 'SELECT COUNT(*) as total FROM users';
    const adminUsersQuery = 'SELECT COUNT(*) as total FROM users WHERE role = $1';
    const regularUsersQuery = 'SELECT COUNT(*) as total FROM users WHERE role = $1';
    const recentUsersQuery = 'SELECT COUNT(*) as total FROM users WHERE created_at >= NOW() - INTERVAL \'7 days\'';
    
    // Get token statistics
    const activeTokensQuery = 'SELECT COUNT(*) as total FROM refresh_tokens WHERE is_revoked = FALSE AND expires_at > NOW()';
    const expiredTokensQuery = 'SELECT COUNT(*) as total FROM refresh_tokens WHERE expires_at <= NOW()';
    const revokedTokensQuery = 'SELECT COUNT(*) as total FROM refresh_tokens WHERE is_revoked = TRUE';

    const pool = require('../config/database');
    
    const [
      totalUsers,
      adminUsers,
      regularUsers,
      recentUsers,
      activeTokens,
      expiredTokens,
      revokedTokens
    ] = await Promise.all([
      pool.query(totalUsersQuery),
      pool.query(adminUsersQuery, ['admin']),
      pool.query(regularUsersQuery, ['user']),
      pool.query(recentUsersQuery),
      pool.query(activeTokensQuery),
      pool.query(expiredTokensQuery),
      pool.query(revokedTokensQuery)
    ]);

    const stats = {
      users: {
        total: parseInt(totalUsers.rows[0].total),
        admins: parseInt(adminUsers.rows[0].total),
        regular: parseInt(regularUsers.rows[0].total),
        recentSignups: parseInt(recentUsers.rows[0].total)
      },
      tokens: {
        active: parseInt(activeTokens.rows[0].total),
        expired: parseInt(expiredTokens.rows[0].total),
        revoked: parseInt(revokedTokens.rows[0].total)
      },
      system: {
        uptime: process.uptime(),
        nodeVersion: process.version,
        environment: process.env.NODE_ENV || 'development'
      }
    };

    res.json({
      success: true,
      message: 'System statistics retrieved successfully',
      data: stats
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching statistics'
    });
  }
});

// GET /api/admin/users - Get all users (admin only)
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const pool = require('../config/database');
    
    // Get users with pagination
    const usersQuery = `
      SELECT id, name, email, role, created_at 
      FROM users 
      ORDER BY created_at DESC 
      LIMIT $1 OFFSET $2
    `;
    
    const countQuery = 'SELECT COUNT(*) as total FROM users';
    
    const [usersResult, countResult] = await Promise.all([
      pool.query(usersQuery, [limit, offset]),
      pool.query(countQuery)
    ]);

    const users = usersResult.rows;
    const totalUsers = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(totalUsers / limit);

    res.json({
      success: true,
      message: 'Users retrieved successfully',
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages,
          totalUsers,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching users'
    });
  }
});

// PUT /api/admin/users/:id/role - Update user role (admin only)
router.put('/users/:id/role', validateRoleUpdate, handleValidationErrors, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { role } = req.body;

    // Prevent admin from changing their own role
    if (userId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change your own role'
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user role
    const updatedUser = await User.updateRole(userId, role);
    
    res.json({
      success: true,
      message: 'User role updated successfully',
      data: {
        user: updatedUser.toJSON()
      }
    });
  } catch (error) {
    console.error('Admin update role error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while updating user role'
    });
  }
});

// DELETE /api/admin/users/:id - Delete user (admin only)
router.delete('/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    // Prevent admin from deleting themselves
    if (userId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const pool = require('../config/database');
    
    // Delete user (cascade will handle refresh tokens)
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Admin delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while deleting user'
    });
  }
});

// POST /api/admin/cleanup-tokens - Clean up expired tokens (admin only)
router.post('/cleanup-tokens', async (req, res) => {
  try {
    const deletedCount = await RefreshToken.cleanupExpired();
    
    res.json({
      success: true,
      message: 'Token cleanup completed successfully',
      data: {
        deletedTokens: deletedCount
      }
    });
  } catch (error) {
    console.error('Admin cleanup tokens error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during token cleanup'
    });
  }
});

// GET /api/admin/users/:id - Get specific user details (admin only)
router.get('/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get additional user statistics
    const pool = require('../config/database');
    const tokenStatsQuery = `
      SELECT 
        COUNT(*) as total_tokens,
        COUNT(CASE WHEN is_revoked = FALSE AND expires_at > NOW() THEN 1 END) as active_tokens,
        COUNT(CASE WHEN is_revoked = TRUE THEN 1 END) as revoked_tokens
      FROM refresh_tokens 
      WHERE user_id = $1
    `;
    
    const tokenStats = await pool.query(tokenStatsQuery, [userId]);
    
    res.json({
      success: true,
      message: 'User details retrieved successfully',
      data: {
        user: user.toJSON(),
        tokenStats: tokenStats.rows[0]
      }
    });
  } catch (error) {
    console.error('Admin get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching user details'
    });
  }
});

module.exports = router;
