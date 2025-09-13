const express = require('express');
const { Product, Category, User } = require('../models');
const { productValidation, commonValidation } = require('../middleware/validation');
const router = express.Router();

// GET /api/products - Get all products with pagination and filters
router.get('/', 
  commonValidation.validatePagination,
  async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const offset = (page - 1) * limit;
      
      const { categoryId, minPrice, maxPrice, madeInGhana, inStock } = req.query;
      
      let whereClause = { isActive: true };
      
      if (categoryId) whereClause.categoryId = categoryId;
      if (minPrice) whereClause.price = { ...whereClause.price, [require('sequelize').Op.gte]: minPrice };
      if (maxPrice) whereClause.price = { ...whereClause.price, [require('sequelize').Op.lte]: maxPrice };
      if (madeInGhana !== undefined) whereClause.madeInGhana = madeInGhana === 'true';
      if (inStock === 'true') {
        whereClause[require('sequelize').Op.or] = [
          { trackQuantity: false },
          { quantity: { [require('sequelize').Op.gt]: 0 } }
        ];
      }

      const { count, rows: products } = await Product.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name', 'slug']
          },
          {
            model: User,
            as: 'vendor',
            attributes: ['id', 'firstName', 'lastName']
          }
        ],
        offset,
        limit,
        order: [['createdAt', 'DESC']]
      });

      // Add computed fields
      const productsWithComputedFields = products.map(product => {
        const productData = product.toJSON();
        productData.discountPercentage = product.getDiscountPercentage();
        productData.stockStatus = product.getStockStatus();
        productData.primaryImage = product.getPrimaryImage();
        return productData;
      });

      res.json({
        success: true,
        data: {
          products: productsWithComputedFields,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            totalProducts: count,
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

// GET /api/products/search - Search products
router.get('/search',
  commonValidation.validateSearch,
  async (req, res, next) => {
    try {
      const { q: query } = req.query;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      
      const options = {
        categoryId: req.query.categoryId,
        minPrice: req.query.minPrice,
        maxPrice: req.query.maxPrice,
        inStock: req.query.inStock !== 'false',
        madeInGhana: req.query.madeInGhana === 'true' ? true : undefined,
        page,
        limit
      };

      const products = await Product.searchProducts(query, options);

      res.json({
        success: true,
        data: {
          products,
          query,
          filters: options
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/products/featured - Get featured products
router.get('/featured', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const featuredProducts = await Product.getFeaturedProducts(limit);
    
    res.json({
      success: true,
      data: featuredProducts
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/products/ghana-made - Get Ghana-made products
router.get('/ghana-made', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const ghanaMadeProducts = await Product.getGhanaMadeProducts(limit);
    
    res.json({
      success: true,
      data: ghanaMadeProducts
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/products/category/:categoryId - Get products by category
router.get('/category/:categoryId',
  commonValidation.validateId,
  async (req, res, next) => {
    try {
      const { categoryId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const offset = (page - 1) * limit;

      const { count, rows: products } = await Product.findAndCountAll({
        where: { 
          categoryId,
          isActive: true 
        },
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name', 'slug']
          },
          {
            model: User,
            as: 'vendor',
            attributes: ['id', 'firstName', 'lastName']
          }
        ],
        offset,
        limit,
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        data: {
          products,
          categoryId,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            totalProducts: count
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/products/:id - Get product by ID
router.get('/:id',
  commonValidation.validateId,
  async (req, res, next) => {
    try {
      const product = await Product.findByPk(req.params.id, {
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name', 'slug', 'description']
          },
          {
            model: User,
            as: 'vendor',
            attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
          }
        ]
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Increment views
      await product.incrementViews();

      // Add computed fields
      const productData = product.toJSON();
      productData.discountPercentage = product.getDiscountPercentage();
      productData.stockStatus = product.getStockStatus();
      productData.primaryImage = product.getPrimaryImage();

      res.json({
        success: true,
        data: productData
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/products - Create new product
router.post('/',
  productValidation.create,
  async (req, res, next) => {
    try {
      const product = await Product.create(req.body);
      
      // Fetch with associations
      const createdProduct = await Product.findByPk(product.id, {
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name', 'slug']
          },
          {
            model: User,
            as: 'vendor',
            attributes: ['id', 'firstName', 'lastName']
          }
        ]
      });

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: createdProduct
      });
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/products/:id - Update product
router.put('/:id',
  commonValidation.validateId,
  productValidation.update,
  async (req, res, next) => {
    try {
      const product = await Product.findByPk(req.params.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      await product.update(req.body);
      
      // Fetch updated product with associations
      const updatedProduct = await Product.findByPk(product.id, {
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name', 'slug']
          },
          {
            model: User,
            as: 'vendor',
            attributes: ['id', 'firstName', 'lastName']
          }
        ]
      });

      res.json({
        success: true,
        message: 'Product updated successfully',
        data: updatedProduct
      });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/products/:id - Delete product (soft delete)
router.delete('/:id',
  commonValidation.validateId,
  async (req, res, next) => {
    try {
      const product = await Product.findByPk(req.params.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      await product.update({ isActive: false });

      res.json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/products/:id/rating - Update product rating
router.put('/:id/rating',
  commonValidation.validateId,
  async (req, res, next) => {
    try {
      const { rating } = req.body;
      
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be between 1 and 5'
        });
      }

      const product = await Product.findByPk(req.params.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      await product.updateRating(rating);

      res.json({
        success: true,
        message: 'Product rating updated successfully',
        data: {
          ratingAverage: product.ratingAverage,
          ratingCount: product.ratingCount
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
