const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100],
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  brand: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  sku: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
    },
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  specifications: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  weight: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true,
  },
  dimensions: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {},
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5,
    },
  },
  reviewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
    },
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
}, {
  tableName: 'products',
  indexes: [
    {
      fields: ['name'],
    },
    {
      fields: ['category'],
    },
    {
      fields: ['brand'],
    },
    {
      unique: true,
      fields: ['sku'],
    },
    {
      fields: ['price'],
    },
    {
      fields: ['isActive'],
    },
    {
      fields: ['isFeatured'],
    },
    {
      fields: ['createdAt'],
    },
  ],
});

// Instance methods
Product.prototype.isInStock = function() {
  return this.stock > 0;
};

Product.prototype.updateStock = async function(quantity) {
  this.stock = Math.max(0, this.stock + quantity);
  return this.save();
};

Product.prototype.addImage = async function(imageUrl) {
  this.images = [...this.images, imageUrl];
  return this.save();
};

Product.prototype.removeImage = async function(imageUrl) {
  this.images = this.images.filter(img => img !== imageUrl);
  return this.save();
};

// Class methods
Product.findByCategory = function(category) {
  return this.findAll({
    where: {
      category,
      isActive: true,
    },
    order: [['createdAt', 'DESC']],
  });
};

Product.findFeatured = function() {
  return this.findAll({
    where: {
      isFeatured: true,
      isActive: true,
    },
    order: [['createdAt', 'DESC']],
  });
};

Product.findInStock = function() {
  return this.findAll({
    where: {
      stock: {
        [sequelize.Sequelize.Op.gt]: 0,
      },
      isActive: true,
    },
  });
};

Product.searchProducts = function(query) {
  return this.findAll({
    where: {
      [sequelize.Sequelize.Op.or]: [
        {
          name: {
            [sequelize.Sequelize.Op.iLike]: `%${query}%`,
          },
        },
        {
          description: {
            [sequelize.Sequelize.Op.iLike]: `%${query}%`,
          },
        },
        {
          tags: {
            [sequelize.Sequelize.Op.overlap]: [query],
          },
        },
      ],
      isActive: true,
    },
    order: [['createdAt', 'DESC']],
  });
};

module.exports = Product;
