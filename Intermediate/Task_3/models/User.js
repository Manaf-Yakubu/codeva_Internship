const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'First name is required' },
      len: { args: [1, 50], msg: 'First name cannot exceed 50 characters' }
    }
  },
  lastName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Last name is required' },
      len: { args: [1, 50], msg: 'Last name cannot exceed 50 characters' }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: { msg: 'Please enter a valid email' },
      notEmpty: { msg: 'Email is required' }
    },
    set(value) {
      this.setDataValue('email', value.toLowerCase().trim());
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: { args: [6, 255], msg: 'Password must be at least 6 characters' },
      notEmpty: { msg: 'Password is required' }
    }
  },
  phone: {
    type: DataTypes.STRING(15),
    allowNull: false,
    validate: {
      is: { args: /^(\+233|0)[2-9]\d{8}$/, msg: 'Please enter a valid Ghana phone number' },
      notEmpty: { msg: 'Phone number is required' }
    }
  },
  role: {
    type: DataTypes.ENUM('user', 'admin', 'vendor'),
    defaultValue: 'user'
  },
  avatar: {
    type: DataTypes.TEXT,
    defaultValue: 'https://via.placeholder.com/150x150?text=User'
  },
  // Address fields
  addressStreet: {
    type: DataTypes.STRING
  },
  addressCity: {
    type: DataTypes.ENUM('Accra', 'Kumasi', 'Tamale', 'Cape Coast', 'Sekondi-Takoradi', 'Sunyani', 'Koforidua', 'Ho', 'Wa', 'Bolgatanga')
  },
  addressRegion: {
    type: DataTypes.ENUM('Greater Accra', 'Ashanti', 'Northern', 'Central', 'Western', 'Brong-Ahafo', 'Eastern', 'Volta', 'Upper West', 'Upper East')
  },
  addressPostalCode: {
    type: DataTypes.STRING(10)
  },
  addressCountry: {
    type: DataTypes.STRING(50),
    defaultValue: 'Ghana'
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    validate: {
      isBefore: {
        args: new Date().toISOString().split('T')[0],
        msg: 'Date of birth must be in the past'
      }
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  lastLogin: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  // Preferences as JSON
  preferences: {
    type: DataTypes.JSONB,
    defaultValue: {
      currency: 'GHS',
      language: 'en',
      notifications: {
        email: true,
        sms: false,
        push: true
      }
    }
  }
}, {
  tableName: 'users',
  indexes: [
    { fields: ['email'], unique: true },
    { fields: ['phone'] },
    { fields: ['addressCity'] },
    { fields: ['role'] },
    { fields: ['isActive'] },
    { fields: ['createdAt'] }
  ],
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
        user.password = await bcrypt.hash(user.password, saltRounds);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
        user.password = await bcrypt.hash(user.password, saltRounds);
      }
    }
  }
});

// Virtual for full name
User.prototype.getFullName = function() {
  return `${this.firstName} ${this.lastName}`;
};

// Method to compare password
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile
User.prototype.getPublicProfile = function() {
  const user = this.toJSON();
  delete user.password;
  return user;
};

// Static method to find by email
User.findByEmail = function(email) {
  return this.findOne({ where: { email: email.toLowerCase() } });
};

// Static method to get user statistics
User.getStats = async function() {
  const stats = await this.findAll({
    attributes: [
      [sequelize.fn('COUNT', sequelize.col('id')), 'totalUsers'],
      [sequelize.fn('COUNT', sequelize.literal('CASE WHEN is_active = true THEN 1 END')), 'activeUsers'],
      [sequelize.fn('COUNT', sequelize.literal('CASE WHEN email_verified = true THEN 1 END')), 'verifiedUsers']
    ],
    raw: true
  });
  
  const result = stats[0] || { totalUsers: 0, activeUsers: 0, verifiedUsers: 0 };
  result.inactiveUsers = result.totalUsers - result.activeUsers;
  
  return result;
};

module.exports = User;
