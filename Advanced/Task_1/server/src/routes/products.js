const express = require('express');
const { Product, User } = require('../models');
const { verifyToken, requireAdmin, optionalAuth } = require('../middleware/auth');
const { validateProduct, validateUUID, validatePagination } = require('../middleware/validation');

const router = express.Router();

// @desc    Get all products with pagination and filtering
// @route   GET /api/products
// @access  Public
router.get('/', optionalAuth, validatePagination, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'desc';
    const category = req.query.category;
    const search = req.query.search;
    const featured = req.query.featured === 'true';
    const inStock = req.query.inStock === 'true';

    // Build where clause
    const where = { isActive: true };
    
    if (category) {
      where.category = category;
    }
    
    if (featured) {
      where.isFeatured = true;
    }
    
    if (inStock) {
      where.stock = { [sequelize.Sequelize.Op.gt]: 0 };
    }
    
    if (search) {
      where[sequelize.Sequelize.Op.or] = [
        { name: { [sequelize.Sequelize.Op.iLike]: `%${search}%` } },
        { description: { [sequelize.Sequelize.Op.iLike]: `%${search}%` } },
        { tags: { [sequelize.Sequelize.Op.overlap]: [search] } }
      ];
    }

    const { count, rows: products } = await Product.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortBy, sortOrder.toUpperCase()]],
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    });

    // Get unique categories for filtering
    const categories = await Product.findAll({
      attributes: ['category'],
      where: { isActive: true },
      group: ['category'],
      raw: true
    });

    res.json({
      success: true,
      data: {
        products,
        categories: categories.map(c => c.category),
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

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.findFeatured();
    
    res.json({
      success: true,
      data: {
        products
      }
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get featured products'
    });
  }
});

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', validateUUID('id'), async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { id: req.params.id, isActive: true },
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: {
        product
      }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get product'
    });
  }
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Admin only)
router.post('/', verifyToken, requireAdmin, validateProduct, async (req, res) => {
  try {
    const productData = {
      ...req.body,
      createdBy: req.user.id
    };

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        product
      }
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product'
    });
  }
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin only)
router.put('/:id', verifyToken, requireAdmin, validateUUID('id'), validateProduct, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.update(req.body);

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: {
        product
      }
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product'
    });
  }
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin only)
router.delete('/:id', verifyToken, requireAdmin, validateUUID('id'), async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Soft delete
    await product.destroy();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product'
    });
  }
});

// @desc    Toggle product featured status
// @route   PUT /api/products/:id/featured
// @access  Private (Admin only)
router.put('/:id/featured', verifyToken, requireAdmin, validateUUID('id'), async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.update({ isFeatured: !product.isFeatured });

    res.json({
      success: true,
      message: `Product ${product.isFeatured ? 'featured' : 'unfeatured'} successfully`,
      data: {
        product
      }
    });
  } catch (error) {
    console.error('Toggle featured error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle featured status'
    });
  }
});

module.exports = router;
