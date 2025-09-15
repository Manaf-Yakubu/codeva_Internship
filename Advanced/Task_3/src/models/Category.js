module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
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
        len: [1, 100],
        notEmpty: true
      }
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [1, 100],
        notEmpty: true
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 500]
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
      beforeCreate: (category) => {
        if (!category.slug) {
          category.slug = category.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        }
      },
      beforeUpdate: (category) => {
        if (category.changed('name') && !category.changed('slug')) {
          category.slug = category.name
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

  Category.associate = function(models) {
    Category.hasMany(models.Post, {
      foreignKey: 'categoryId',
      as: 'posts'
    });
  };

  return Category;
};
