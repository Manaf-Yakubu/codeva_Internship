const { DataTypes, Op } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Product name is required' },
      len: { args: [1, 100], msg: 'Product name cannot exceed 100 characters' }
    }
  },
  slug: {
    type: DataTypes.STRING(120),
    unique: true,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Product description is required' },
      len: { args: [1, 2000], msg: 'Description cannot exceed 2000 characters' }
    }
  },
  shortDescription: {
    type: DataTypes.STRING(200),
    validate: {
      len: { args: [0, 200], msg: 'Short description cannot exceed 200 characters' }
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: { args: [0], msg: 'Price cannot be negative' },
      notNull: { msg: 'Product price is required' }
    }
  },
  comparePrice: {
    type: DataTypes.DECIMAL(10, 2),
    validate: {
      min: { args: [0], msg: 'Compare price cannot be negative' },
      isGreaterThanPrice(value) {
        if (value && value <= this.price) {
          throw new Error('Compare price must be greater than selling price');
        }
      }
    }
  },
  currency: {
    type: DataTypes.ENUM('GHS', 'USD', 'EUR'),
    defaultValue: 'GHS'
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  vendorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  images: {
    type: DataTypes.JSONB,
    defaultValue: [],
    validate: {
      isValidImages(value) {
        if (value && Array.isArray(value)) {
          value.forEach(img => {
            if (!img.url) {
              throw new Error('Image URL is required');
            }
          });
        }
      }
    }
  },
  // Inventory fields
  sku: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: { args: [0], msg: 'Quantity cannot be negative' }
    }
  },
  lowStockThreshold: {
    type: DataTypes.INTEGER,
    defaultValue: 10,
    validate: {
      min: { args: [0], msg: 'Low stock threshold cannot be negative' }
    }
  },
  trackQuantity: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  specifications: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isDigital: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  weight: {
    type: DataTypes.JSONB,
    defaultValue: { value: 0, unit: 'kg' }
  },
  dimensions: {
    type: DataTypes.JSONB,
    defaultValue: { length: 0, width: 0, height: 0, unit: 'cm' }
  },
  seo: {
    type: DataTypes.JSONB,
    defaultValue: { title: '', description: '', keywords: [] }
  },
  // Ghana-specific fields
  madeInGhana: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  ghanaRegion: {
    type: DataTypes.ENUM('Greater Accra', 'Ashanti', 'Northern', 'Central', 'Western', 'Brong-Ahafo', 'Eastern', 'Volta', 'Upper West', 'Upper East')
  },
  localLanguageName: {
    type: DataTypes.JSONB,
    defaultValue: { twi: '', ga: '', ewe: '', hausa: '' }
  },
  // Analytics
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  salesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  ratingAverage: {
    type: DataTypes.DECIMAL(2, 1),
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5
    }
  },
  ratingCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'products',
  indexes: [
    { fields: ['name'] },
    { fields: ['slug'], unique: true },
    { fields: ['categoryId'] },
    { fields: ['vendorId'] },
    { fields: ['sku'], unique: true },
    { fields: ['price'] },
    { fields: ['isActive'] },
    { fields: ['isFeatured'] },
    { fields: ['madeInGhana'] },
    { fields: ['createdAt'] },
    { fields: ['ratingAverage'] },
    { fields: ['salesCount'] },
    { fields: ['views'] }
  ],
  hooks: {
    beforeCreate: (product) => {
      // Generate slug from name
      if (product.name && !product.slug) {
        product.slug = product.name
          .toLowerCase()
          .replace(/[^a-z0-9 -]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
      
      // Generate SKU if not provided
      if (!product.sku) {
        product.sku = `PRD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      }
      
      // Ensure at least one primary image
      if (product.images && product.images.length > 0 && !product.images.some(img => img.isPrimary)) {
        product.images[0].isPrimary = true;
      }
    },
    beforeUpdate: (product) => {
      if (product.changed('name')) {
        product.slug = product.name
          .toLowerCase()
          .replace(/[^a-z0-9 -]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
    }
  }
});

// Instance methods
Product.prototype.getDiscountPercentage = function() {
  if (this.comparePrice && this.comparePrice > this.price) {
    return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
  }
  return 0;
};

Product.prototype.getStockStatus = function() {
  if (!this.trackQuantity) return 'in_stock';
  if (this.quantity === 0) return 'out_of_stock';
  if (this.quantity <= this.lowStockThreshold) return 'low_stock';
  return 'in_stock';
};

Product.prototype.getPrimaryImage = function() {
  if (this.images && this.images.length > 0) {
    const primary = this.images.find(img => img.isPrimary);
    return primary || this.images[0];
  }
  return { url: 'https://via.placeholder.com/400x400?text=No+Image', alt: 'No Image', isPrimary: true };
};

Product.prototype.incrementViews = async function() {
  this.views += 1;
  return await this.save();
};

Product.prototype.updateRating = async function(newRating) {
  const totalRating = (this.ratingAverage * this.ratingCount) + newRating;
  this.ratingCount += 1;
  this.ratingAverage = totalRating / this.ratingCount;
  return await this.save();
};

// Static methods
Product.searchProducts = async function(query, options = {}) {
  const {
    categoryId,
    minPrice,
    maxPrice,
    inStock = true,
    madeInGhana,
    page = 1,
    limit = 20,
    sort = [['createdAt', 'DESC']]
  } = options;
  
  const where = { isActive: true };
  
  if (query) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${query}%` } },
      { description: { [Op.iLike]: `%${query}%` } },
      { tags: { [Op.contains]: [query] } }
    ];
  }
  
  if (categoryId) {
    where.categoryId = categoryId;
  }
  
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price[Op.gte] = minPrice;
    if (maxPrice) where.price[Op.lte] = maxPrice;
  }
  
  if (inStock) {
    where[Op.or] = [
      { trackQuantity: false },
      { quantity: { [Op.gt]: 0 } }
    ];
  }
  
  if (madeInGhana !== undefined) {
    where.madeInGhana = madeInGhana;
  }
  
  const offset = (page - 1) * limit;
  
  return await this.findAll({
    where,
    include: [
      { model: require('./Category'), as: 'category', attributes: ['name', 'slug'] },
      { model: require('./User'), as: 'vendor', attributes: ['firstName', 'lastName'] }
    ],
    order: sort,
    offset,
    limit
  });
};

Product.getFeaturedProducts = async function(limit = 10) {
  return await this.findAll({
    where: { isActive: true, isFeatured: true },
    include: [{ model: require('./Category'), as: 'category', attributes: ['name', 'slug'] }],
    order: [['createdAt', 'DESC']],
    limit
  });
};

Product.getGhanaMadeProducts = async function(limit = 20) {
  return await this.findAll({
    where: { isActive: true, madeInGhana: true },
    include: [
      { model: require('./Category'), as: 'category', attributes: ['name', 'slug'] },
      { model: require('./User'), as: 'vendor', attributes: ['firstName', 'lastName'] }
    ],
    order: [['createdAt', 'DESC']],
    limit
  });
};

module.exports = Product;
