const express = require('express');
const { User, Product, RefreshToken } = require('../models');
const { verifyToken } = require('../middleware/auth');
const { sequelize } = require('../config/database');

const router = express.Router();

// Apply authentication to all dashboard routes
router.use(verifyToken);

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    
    if (isAdmin) {
      // Admin dashboard stats
      const [
        totalUsers,
        totalProducts,
        activeProducts,
        recentUsers
      ] = await Promise.all([
        User.count(),
        Product.count(),
        Product.count({ where: { isActive: true } }),
        User.count({
          where: {
            createdAt: {
              [sequelize.Sequelize.Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            }
          }
        })
      ]);

      // Monthly user registrations for chart
      const monthlyStats = await User.findAll({
        attributes: [
          [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('created_at')), 'month'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        where: {
          createdAt: {
            [sequelize.Sequelize.Op.gte]: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000)
          }
        },
        group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('created_at'))],
        order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('created_at')), 'ASC']],
        raw: true
      });

      res.json({
        success: true,
        data: {
          overview: {
            totalUsers,
            totalProducts,
            activeProducts,
            recentUsers
          },
          charts: {
            monthlyRegistrations: monthlyStats.map(stat => ({
              month: stat.month,
              count: parseInt(stat.count)
            }))
          }
        }
      });
    } else {
      // Regular user dashboard stats
      const userProducts = await Product.count({
        where: { createdBy: req.user.id }
      });

      const recentActivity = await Product.findAll({
        where: { createdBy: req.user.id },
        order: [['updatedAt', 'DESC']],
        limit: 5,
        attributes: ['id', 'name', 'updatedAt', 'isActive']
      });

      res.json({
        success: true,
        data: {
          overview: {
            myProducts: userProducts,
            accountAge: Math.floor((new Date() - new Date(req.user.createdAt)) / (1000 * 60 * 60 * 24)),
            lastLogin: req.user.lastLogin
          },
          recentActivity
        }
      });
    }
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard statistics'
    });
  }
});

// @desc    Get recent activities
// @route   GET /api/dashboard/activities
// @access  Private
router.get('/activities', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    if (req.user.role === 'admin') {
      // Admin sees all recent activities
      const recentUsers = await User.findAll({
        order: [['createdAt', 'DESC']],
        limit: limit / 2,
        attributes: ['id', 'firstName', 'lastName', 'email', 'createdAt']
      });

      const recentProducts = await Product.findAll({
        order: [['createdAt', 'DESC']],
        limit: limit / 2,
        include: [
          {
            model: User,
            as: 'creator',
            attributes: ['firstName', 'lastName']
          }
        ]
      });

      res.json({
        success: true,
        data: {
          recentUsers,
          recentProducts
        }
      });
    } else {
      // Regular user sees their own activities
      const myProducts = await Product.findAll({
        where: { createdBy: req.user.id },
        order: [['updatedAt', 'DESC']],
        limit,
        attributes: ['id', 'name', 'updatedAt', 'isActive', 'stock']
      });

      res.json({
        success: true,
        data: {
          myProducts
        }
      });
    }
  } catch (error) {
    console.error('Dashboard activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard activities'
    });
  }
});

module.exports = router;
