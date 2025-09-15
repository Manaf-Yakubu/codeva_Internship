const express = require('express');
const { User, Product, RefreshToken } = require('../models');
const { verifyToken, requireAdmin } = require('../middleware/auth');
const { validateUUID, validatePagination } = require('../middleware/validation');
const { sequelize } = require('../config/database');

const router = express.Router();

// Apply admin middleware to all routes
router.use(verifyToken, requireAdmin);

// @desc    Get system statistics
// @route   GET /api/admin/stats
// @access  Private (Admin only)
router.get('/stats', async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalProducts,
      activeProducts,
      totalSessions
    ] = await Promise.all([
      User.count(),
      User.count({ where: { isActive: true } }),
      Product.count(),
      Product.count({ where: { isActive: true } }),
      RefreshToken.count({ where: { isRevoked: false } })
    ]);

    // Recent registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentRegistrations = await User.count({
      where: {
        createdAt: {
          [sequelize.Sequelize.Op.gte]: thirtyDaysAgo
        }
      }
    });

    // User role distribution
    const userRoles = await User.findAll({
      attributes: [
        'role',
        [sequelize.fn('COUNT', sequelize.col('role')), 'count']
      ],
      group: ['role'],
      raw: true
    });

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          recentRegistrations
        },
        products: {
          total: totalProducts,
          active: activeProducts
        },
        sessions: {
          active: totalSessions
        },
        userRoles: userRoles.reduce((acc, role) => {
          acc[role.role] = parseInt(role.count);
          return acc;
        }, {})
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get system statistics'
    });
  }
});

// @desc    Get all users with pagination
// @route   GET /api/admin/users
// @access  Private (Admin only)
router.get('/users', validatePagination, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'desc';

    const { count, rows: users } = await User.findAndCountAll({
      limit,
      offset,
      order: [[sortBy, sortOrder.toUpperCase()]],
      include: [
        {
          model: RefreshToken,
          as: 'refreshTokens',
          where: { isRevoked: false },
          required: false,
          attributes: ['id', 'createdAt', 'deviceInfo']
        }
      ]
    });

    res.json({
      success: true,
      data: {
        users: users.map(user => ({
          ...user.toJSON(),
          activeSessions: user.refreshTokens?.length || 0
        })),
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: limit
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users'
    });
  }
});

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private (Admin only)
router.get('/users/:id', validateUUID('id'), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [
        {
          model: RefreshToken,
          as: 'refreshTokens',
          attributes: ['id', 'createdAt', 'deviceInfo', 'ipAddress', 'isRevoked']
        },
        {
          model: Product,
          as: 'products',
          attributes: ['id', 'name', 'createdAt']
        }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: user.toJSON()
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user'
    });
  }
});

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin only)
router.put('/users/:id/role', validateUUID('id'), async (req, res) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be either "user" or "admin"'
      });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from demoting themselves
    if (user.id === req.user.id && role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'You cannot change your own role'
      });
    }

    await user.update({ role });

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: {
        user: user.toJSON()
      }
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user role'
    });
  }
});

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin only)
router.put('/users/:id/status', validateUUID('id'), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from deactivating themselves
    if (user.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot change your own status'
      });
    }

    await user.update({ isActive: !user.isActive });

    // If deactivating, revoke all refresh tokens
    if (!user.isActive) {
      await RefreshToken.revokeAllForUser(user.id);
    }

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        user: user.toJSON()
      }
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status'
    });
  }
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
router.delete('/users/:id', validateUUID('id'), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from deleting themselves
    if (user.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    // Soft delete (paranoid: true in model)
    await user.destroy();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
});

// @desc    Get all products with pagination
// @route   GET /api/admin/products
// @access  Private (Admin only)
router.get('/products', validatePagination, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'desc';

    const { count, rows: products } = await Product.findAndCountAll({
      limit,
      offset,
      order: [[sortBy, sortOrder.toUpperCase()]],
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: limit
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get products'
    });
  }
});

module.exports = router;
