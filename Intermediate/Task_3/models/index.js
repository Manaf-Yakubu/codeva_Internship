const { sequelize } = require('../config/database');

// Import all models
const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const Order = require('./Order');

// Define associations
const defineAssociations = () => {
  // User associations
  User.hasMany(Product, { foreignKey: 'vendorId', as: 'products' });
  User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });

  // Category associations
  Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
  Category.belongsTo(Category, { as: 'parent', foreignKey: 'parentId' });
  Category.hasMany(Category, { as: 'subcategories', foreignKey: 'parentId' });

  // Product associations
  Product.belongsTo(User, { foreignKey: 'vendorId', as: 'vendor' });
  Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

  // Order associations
  Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
};

// Initialize associations
defineAssociations();

// Export models and sequelize instance
module.exports = {
  sequelize,
  User,
  Category,
  Product,
  Order,
  defineAssociations
};
