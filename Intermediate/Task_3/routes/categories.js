const express = require('express');
const { Category } = require('../models');
const { categoryValidation, commonValidation } = require('../middleware/validation');
const router = express.Router();

// GET /api/categories - Get all categories with pagination
router.get('/', 
  commonValidation.validatePagination,
  async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const offset = (page - 1) * limit;

      const { count, rows: categories } = await Category.findAndCountAll({
        where: { isActive: true },
        include: [
          {
            model: Category,
            as: 'parent',
            attributes: ['id', 'name', 'slug']
          },
          {
            model: Category,
            as: 'subcategories',
            attributes: ['id', 'name', 'slug'],
            where: { isActive: true },
            required: false
          }
        ],
        offset,
        limit,
        order: [['sortOrder', 'ASC'], ['name', 'ASC']]
      });

      res.json({
        success: true,
        data: {
          categories,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            totalCategories: count,
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

// GET /api/categories/tree - Get category tree structure
router.get('/tree', async (req, res, next) => {
  try {
    const categoryTree = await Category.getCategoryTree();
    
    res.json({
      success: true,
      data: categoryTree
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/categories/popular - Get popular categories by product count
router.get('/popular', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const popularCategories = await Category.getPopularCategories(limit);
    
    res.json({
      success: true,
      data: popularCategories
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/categories/ghana - Get Ghana-specific categories
router.get('/ghana', async (req, res, next) => {
  try {
    const ghanaCategories = await Category.getGhanaCategories();
    
    res.json({
      success: true,
      data: ghanaCategories
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/categories/search - Search categories
router.get('/search',
  commonValidation.validateSearch,
  async (req, res, next) => {
    try {
      const { q: query } = req.query;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const offset = (page - 1) * limit;

      const whereClause = query ? {
        [require('sequelize').Op.and]: [
          { isActive: true },
          {
            [require('sequelize').Op.or]: [
              { name: { [require('sequelize').Op.iLike]: `%${query}%` } },
              { description: { [require('sequelize').Op.iLike]: `%${query}%` } }
            ]
          }
        ]
      } : { isActive: true };

      const { count, rows: categories } = await Category.findAndCountAll({
        where: whereClause,
        offset,
        limit,
        order: [['name', 'ASC']]
      });

      res.json({
        success: true,
        data: {
          categories,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            totalCategories: count,
            query
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/categories/:id - Get category by ID
router.get('/:id',
  commonValidation.validateId,
  async (req, res, next) => {
    try {
      const category = await Category.findByPk(req.params.id, {
        include: [
          {
            model: Category,
            as: 'parent',
            attributes: ['id', 'name', 'slug']
          },
          {
            model: Category,
            as: 'subcategories',
            attributes: ['id', 'name', 'slug', 'description'],
            where: { isActive: true },
            required: false
          },
          {
            model: require('../models').Product,
            as: 'products',
            attributes: ['id', 'name', 'price', 'slug'],
            where: { isActive: true },
            required: false,
            limit: 10
          }
        ]
      });

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      res.json({
        success: true,
        data: category
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/categories - Create new category
router.post('/',
  categoryValidation.create,
  async (req, res, next) => {
    try {
      const category = await Category.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: category
      });
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/categories/:id - Update category
router.put('/:id',
  commonValidation.validateId,
  categoryValidation.update,
  async (req, res, next) => {
    try {
      const category = await Category.findByPk(req.params.id);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      await category.update(req.body);

      res.json({
        success: true,
        message: 'Category updated successfully',
        data: category
      });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/categories/:id - Delete category (soft delete)
router.delete('/:id',
  commonValidation.validateId,
  async (req, res, next) => {
    try {
      const category = await Category.findByPk(req.params.id);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      // Check if category has products
      const productCount = await require('../models').Product.count({
        where: { categoryId: req.params.id, isActive: true }
      });

      if (productCount > 0) {
        return res.status(400).json({
          success: false,
          message: `Cannot delete category with ${productCount} active products`
        });
      }

      await category.update({ isActive: false });

      res.json({
        success: true,
        message: 'Category deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
