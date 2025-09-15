const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 50],
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 255],
        notEmpty: true
      }
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 50],
        notEmpty: true
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 50],
        notEmpty: true
      }
    },
    role: {
      type: DataTypes.ENUM('USER', 'ADMIN', 'MODERATOR'),
      defaultValue: 'USER',
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 500]
      }
    }
  }, {
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(12);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(12);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    },
    indexes: [
      {
        unique: true,
        fields: ['email']
      },
      {
        unique: true,
        fields: ['username']
      },
      {
        fields: ['role']
      },
      {
        fields: ['isActive']
      }
    ]
  });

  User.associate = function(models) {
    User.hasMany(models.Post, {
      foreignKey: 'authorId',
      as: 'posts'
    });
    User.hasMany(models.Comment, {
      foreignKey: 'authorId',
      as: 'comments'
    });
  };

  // Instance methods
  User.prototype.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };

  User.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    delete values.password;
    return values;
  };

  User.prototype.getFullName = function() {
    return `${this.firstName} ${this.lastName}`;
  };

  return User;
};
