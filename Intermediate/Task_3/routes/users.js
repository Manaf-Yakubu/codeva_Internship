const express = require('express');
const { User } = require('../models');
const { userValidation, commonValidation } = require('../middleware/validation');
const router = express.Router();

// GET /api/users - Get all users with pagination
router.get('/', 
  commonValidation.validatePagination,
  async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const offset = (page - 1) * limit;

      const { count, rows: users } = await User.findAndCountAll({
        attributes: { exclude: ['password'] },
        offset,
        limit,
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        data: {
          users,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            totalUsers: count,
            hasNext: page < Math.ceil(count / limit),
            hasPrev: page > 1
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/users/search - Search users
router.get('/search',
  commonValidation.validateSearch,
  async (req, res, next) => {
    try {
      const { q: query } = req.query;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const offset = (page - 1) * limit;

      const whereClause = query ? {
        [require('sequelize').Op.or]: [
          { firstName: { [require('sequelize').Op.iLike]: `%${query}%` } },
          { lastName: { [require('sequelize').Op.iLike]: `%${query}%` } },
          { email: { [require('sequelize').Op.iLike]: `%${query}%` } }
        ]
      } : {};

      const { count, rows: users } = await User.findAndCountAll({
        where: whereClause,
        attributes: { exclude: ['password'] },
        offset,
        limit,
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        data: {
          users,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            totalUsers: count,
            query
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/users/stats - Get user statistics
router.get('/stats', async (req, res, next) => {
  try {
    const stats = await User.getStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/users/:id - Get user by ID
router.get('/:id',
  commonValidation.validateId,
  async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ['password'] },
        include: [
          {
            model: require('../models').Product,
            as: 'products',
            attributes: ['id', 'name', 'price', 'isActive'],
            limit: 5
          },
          {
            model: require('../models').Order,
            as: 'orders',
            attributes: ['id', 'orderNumber', 'status', 'total'],
            limit: 5,
            order: [['createdAt', 'DESC']]
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
        data: user
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/users - Create new user
router.post('/',
  userValidation.create,
  async (req, res, next) => {
    try {
      const user = await User.create(req.body);
      const userResponse = user.getPublicProfile();

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: userResponse
      });
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/users/:id - Update user
router.put('/:id',
  commonValidation.validateId,
  userValidation.update,
  async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      await user.update(req.body);
      const userResponse = user.getPublicProfile();

      res.json({
        success: true,
        message: 'User updated successfully',
        data: userResponse
      });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/users/:id - Delete user (soft delete by setting isActive to false)
router.delete('/:id',
  commonValidation.validateId,
  async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      await user.update({ isActive: false });

      res.json({
        success: true,
        message: 'User deactivated successfully'
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/users/region/:region - Get users by Ghana region
router.get('/region/:region', async (req, res, next) => {
  try {
    const { region } = req.params;
    const validRegions = ['Greater Accra', 'Ashanti', 'Northern', 'Central', 'Western', 'Brong-Ahafo', 'Eastern', 'Volta', 'Upper West', 'Upper East'];
    
    if (!validRegions.includes(region)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Ghana region'
      });
    }

    const users = await User.findAll({
      where: { 
        addressRegion: region,
        isActive: true 
      },
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        region,
        users,
        count: users.length
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
