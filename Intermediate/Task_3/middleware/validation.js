const { body, param, query, validationResult } = require('express-validator');

// Error handling middleware for validation
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// User validation rules
const userValidation = {
  create: [
    body('firstName')
      .trim()
      .notEmpty()
      .withMessage('First name is required')
      .isLength({ min: 1, max: 50 })
      .withMessage('First name must be between 1 and 50 characters'),
    
    body('lastName')
      .trim()
      .notEmpty()
      .withMessage('Last name is required')
      .isLength({ min: 1, max: 50 })
      .withMessage('Last name must be between 1 and 50 characters'),
    
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email')
      .normalizeEmail(),
    
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    
    body('phone')
      .matches(/^(\+233|0)[2-9]\d{8}$/)
      .withMessage('Please provide a valid Ghana phone number'),
    
    body('role')
      .optional()
      .isIn(['user', 'admin', 'vendor'])
      .withMessage('Role must be user, admin, or vendor'),
    
    body('addressCity')
      .optional()
      .isIn(['Accra', 'Kumasi', 'Tamale', 'Cape Coast', 'Sekondi-Takoradi', 'Sunyani', 'Koforidua', 'Ho', 'Wa', 'Bolgatanga'])
      .withMessage('Please select a valid Ghana city'),
    
    body('addressRegion')
      .optional()
      .isIn(['Greater Accra', 'Ashanti', 'Northern', 'Central', 'Western', 'Brong-Ahafo', 'Eastern', 'Volta', 'Upper West', 'Upper East'])
      .withMessage('Please select a valid Ghana region'),
    
    handleValidationErrors
  ],
  
  update: [
    body('firstName')
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('First name must be between 1 and 50 characters'),
    
    body('lastName')
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('Last name must be between 1 and 50 characters'),
    
    body('email')
      .optional()
      .isEmail()
      .withMessage('Please provide a valid email')
      .normalizeEmail(),
    
    body('phone')
      .optional()
      .matches(/^(\+233|0)[2-9]\d{8}$/)
      .withMessage('Please provide a valid Ghana phone number'),
    
    handleValidationErrors
  ]
};

// Category validation rules
const categoryValidation = {
  create: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Category name is required')
      .isLength({ min: 1, max: 50 })
      .withMessage('Category name must be between 1 and 50 characters'),
    
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description cannot exceed 500 characters'),
    
    body('parentId')
      .optional()
      .isUUID()
      .withMessage('Parent ID must be a valid UUID'),
    
    body('sortOrder')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Sort order must be a non-negative integer'),
    
    body('ghanaRegions')
      .optional()
      .isArray()
      .withMessage('Ghana regions must be an array'),
    
    body('ghanaRegions.*')
      .optional()
      .isIn(['Greater Accra', 'Ashanti', 'Northern', 'Central', 'Western', 'Brong-Ahafo', 'Eastern', 'Volta', 'Upper West', 'Upper East'])
      .withMessage('Invalid Ghana region'),
    
    handleValidationErrors
  ],
  
  update: [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('Category name must be between 1 and 50 characters'),
    
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description cannot exceed 500 characters'),
    
    handleValidationErrors
  ]
};

// Product validation rules
const productValidation = {
  create: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Product name is required')
      .isLength({ min: 1, max: 100 })
      .withMessage('Product name must be between 1 and 100 characters'),
    
    body('description')
      .trim()
      .notEmpty()
      .withMessage('Product description is required')
      .isLength({ min: 1, max: 2000 })
      .withMessage('Description must be between 1 and 2000 characters'),
    
    body('shortDescription')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Short description cannot exceed 200 characters'),
    
    body('price')
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    
    body('comparePrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Compare price must be a positive number'),
    
    body('currency')
      .optional()
      .isIn(['GHS', 'USD', 'EUR'])
      .withMessage('Currency must be GHS, USD, or EUR'),
    
    body('categoryId')
      .isUUID()
      .withMessage('Category ID must be a valid UUID'),
    
    body('vendorId')
      .isUUID()
      .withMessage('Vendor ID must be a valid UUID'),
    
    body('quantity')
      .isInt({ min: 0 })
      .withMessage('Quantity must be a non-negative integer'),
    
    body('lowStockThreshold')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Low stock threshold must be a non-negative integer'),
    
    body('ghanaRegion')
      .optional()
      .isIn(['Greater Accra', 'Ashanti', 'Northern', 'Central', 'Western', 'Brong-Ahafo', 'Eastern', 'Volta', 'Upper West', 'Upper East'])
      .withMessage('Invalid Ghana region'),
    
    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array'),
    
    handleValidationErrors
  ],
  
  update: [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Product name must be between 1 and 100 characters'),
    
    body('price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    
    body('quantity')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Quantity must be a non-negative integer'),
    
    handleValidationErrors
  ]
};

// Order validation rules
const orderValidation = {
  create: [
    body('items')
      .isArray({ min: 1 })
      .withMessage('Order must have at least one item'),
    
    body('items.*.productId')
      .isUUID()
      .withMessage('Product ID must be a valid UUID'),
    
    body('items.*.quantity')
      .isInt({ min: 1 })
      .withMessage('Quantity must be at least 1'),
    
    body('items.*.price')
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    
    body('paymentMethod')
      .isIn(['cash', 'mobile_money', 'card', 'bank_transfer', 'paystack'])
      .withMessage('Invalid payment method'),
    
    body('shippingFirstName')
      .trim()
      .notEmpty()
      .withMessage('Shipping first name is required'),
    
    body('shippingLastName')
      .trim()
      .notEmpty()
      .withMessage('Shipping last name is required'),
    
    body('shippingPhone')
      .matches(/^(\+233|0)[2-9]\d{8}$/)
      .withMessage('Please provide a valid Ghana phone number'),
    
    body('shippingEmail')
      .isEmail()
      .withMessage('Please provide a valid email'),
    
    body('shippingStreet')
      .trim()
      .notEmpty()
      .withMessage('Shipping street is required'),
    
    body('shippingCity')
      .isIn(['Accra', 'Kumasi', 'Tamale', 'Cape Coast', 'Sekondi-Takoradi', 'Sunyani', 'Koforidua', 'Ho', 'Wa', 'Bolgatanga'])
      .withMessage('Please select a valid Ghana city'),
    
    body('shippingRegion')
      .isIn(['Greater Accra', 'Ashanti', 'Northern', 'Central', 'Western', 'Brong-Ahafo', 'Eastern', 'Volta', 'Upper West', 'Upper East'])
      .withMessage('Please select a valid Ghana region'),
    
    body('shippingMethod.name')
      .trim()
      .notEmpty()
      .withMessage('Shipping method name is required'),
    
    body('shippingMethod.cost')
      .isFloat({ min: 0 })
      .withMessage('Shipping cost must be a positive number'),
    
    handleValidationErrors
  ],
  
  updateStatus: [
    body('status')
      .isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'])
      .withMessage('Invalid order status'),
    
    body('note')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Note cannot exceed 500 characters'),
    
    handleValidationErrors
  ]
};

// Common validation rules
const commonValidation = {
  validateId: [
    param('id')
      .isUUID()
      .withMessage('ID must be a valid UUID'),
    
    handleValidationErrors
  ],
  
  validatePagination: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    
    handleValidationErrors
  ],
  
  validateSearch: [
    query('q')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Search query must be between 1 and 100 characters'),
    
    handleValidationErrors
  ]
};

module.exports = {
  handleValidationErrors,
  userValidation,
  categoryValidation,
  productValidation,
  orderValidation,
  commonValidation
};
