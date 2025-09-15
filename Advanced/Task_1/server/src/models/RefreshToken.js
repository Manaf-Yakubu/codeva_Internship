const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const RefreshToken = sequelize.define('RefreshToken', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  isRevoked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  deviceInfo: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {},
  },
  ipAddress: {
    type: DataTypes.INET,
    allowNull: true,
  },
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'refresh_tokens',
  indexes: [
    {
      unique: true,
      fields: ['token'],
    },
    {
      fields: ['userId'],
    },
    {
      fields: ['expiresAt'],
    },
    {
      fields: ['isRevoked'],
    },
  ],
});

// Instance methods
RefreshToken.prototype.isExpired = function() {
  return new Date() > this.expiresAt;
};

RefreshToken.prototype.isValid = function() {
  return !this.isRevoked && !this.isExpired();
};

// Class methods
RefreshToken.findValidToken = function(token) {
  return this.findOne({
    where: {
      token,
      isRevoked: false,
      expiresAt: {
        [sequelize.Sequelize.Op.gt]: new Date(),
      },
    },
  });
};

RefreshToken.revokeAllForUser = async function(userId) {
  return this.update(
    { isRevoked: true },
    { where: { userId, isRevoked: false } }
  );
};

RefreshToken.cleanupExpired = async function() {
  return this.destroy({
    where: {
      expiresAt: {
        [sequelize.Sequelize.Op.lt]: new Date(),
      },
    },
  });
};

module.exports = RefreshToken;
