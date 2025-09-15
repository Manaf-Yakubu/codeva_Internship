module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [1, 50],
        notEmpty: true
      }
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [1, 50],
        notEmpty: true
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 200]
      }
    },
    color: {
      type: DataTypes.STRING(7),
      allowNull: true,
      validate: {
        is: /^#[0-9A-F]{6}$/i
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    hooks: {
      beforeCreate: (tag) => {
        if (!tag.slug) {
          tag.slug = tag.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        }
      },
      beforeUpdate: (tag) => {
        if (tag.changed('name') && !tag.changed('slug')) {
          tag.slug = tag.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        }
      }
    },
    indexes: [
      {
        unique: true,
        fields: ['name']
      },
      {
        unique: true,
        fields: ['slug']
      },
      {
        fields: ['isActive']
      }
    ]
  });

  Tag.associate = function(models) {
    Tag.belongsToMany(models.Post, {
      through: models.PostTag,
      foreignKey: 'tagId',
      otherKey: 'postId',
      as: 'posts'
    });
  };

  return Tag;
};
