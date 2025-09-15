const { sequelize } = require('../config/database');
const User = require('./User');
const RefreshToken = require('./RefreshToken');
const Product = require('./Product');

// Define associations
User.hasMany(RefreshToken, {
  foreignKey: 'userId',
  as: 'refreshTokens',
  onDelete: 'CASCADE',
});

RefreshToken.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

User.hasMany(Product, {
  foreignKey: 'createdBy',
  as: 'products',
});

Product.belongsTo(User, {
  foreignKey: 'createdBy',
  as: 'creator',
});

module.exports = {
  sequelize,
  User,
  RefreshToken,
  Product,
};
