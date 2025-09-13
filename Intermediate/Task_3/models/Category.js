const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: 'Category name is required' },
      len: { args: [1, 50], msg: 'Category name cannot exceed 50 characters' }
    }
  },
  slug: {
    type: DataTypes.STRING(60),
    unique: true,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    validate: {
      len: { args: [0, 500], msg: 'Description cannot exceed 500 characters' }
    }
  },
  image: {
    type: DataTypes.TEXT,
    defaultValue: 'https://via.placeholder.com/300x200?text=Category'
  },
  parentId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  // SEO metadata as JSON
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {
      seoTitle: '',
      seoDescription: '',
      keywords: []
    }
  },
  // Ghana-specific categories
  isGhanaSpecific: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  ghanaRegions: {
    type: DataTypes.ARRAY(DataTypes.ENUM('Greater Accra', 'Ashanti', 'Northern', 'Central', 'Western', 'Brong-Ahafo', 'Eastern', 'Volta', 'Upper West', 'Upper East')),
    defaultValue: []
  }
}, {
  tableName: 'categories',
  indexes: [
    { fields: ['name'], unique: true },
    { fields: ['slug'], unique: true },
    { fields: ['parentId'] },
    { fields: ['isActive'] },
    { fields: ['sortOrder'] },
    { fields: ['isGhanaSpecific'] }
  ],
  hooks: {
    beforeCreate: (category) => {
      if (category.name && !category.slug) {
        category.slug = category.name
          .toLowerCase()
          .replace(/[^a-z0-9 -]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
    },
    beforeUpdate: (category) => {
      if (category.changed('name')) {
        category.slug = category.name
          .toLowerCase()
          .replace(/[^a-z0-9 -]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
    }
  }
});

// Self-referencing association for parent-child relationships
Category.belongsTo(Category, { as: 'parent', foreignKey: 'parentId' });
Category.hasMany(Category, { as: 'subcategories', foreignKey: 'parentId' });

// Static method to get category tree
Category.getCategoryTree = async function() {
  const categories = await this.findAll({
    where: { isActive: true },
    order: [['sortOrder', 'ASC'], ['name', 'ASC']],
    include: [{
      model: Category,
      as: 'subcategories',
      where: { isActive: true },
      required: false
    }]
  });
  
  const buildTree = (parentId = null) => {
    return categories
      .filter(cat => cat.parentId === parentId)
      .map(cat => ({
        ...cat.toJSON(),
        children: buildTree(cat.id)
      }));
  };
  
  return buildTree();
};

// Static method to get popular categories (by product count)
Category.getPopularCategories = async function(limit = 10) {
  const Product = require('./Product');
  
  return await this.findAll({
    where: { isActive: true },
    attributes: [
      'id', 'name', 'slug', 'description', 'image',
      [sequelize.fn('COUNT', sequelize.col('products.id')), 'productCount']
    ],
    include: [{
      model: Product,
      as: 'products',
      attributes: [],
      required: false
    }],
    group: ['Category.id'],
    order: [[sequelize.literal('productCount'), 'DESC']],
    limit: limit,
    subQuery: false
  });
};

// Static method to get Ghana-specific categories
Category.getGhanaCategories = async function() {
  return await this.findAll({
    where: { 
      isActive: true, 
      isGhanaSpecific: true 
    },
    order: [['sortOrder', 'ASC'], ['name', 'ASC']]
  });
};

module.exports = Category;
