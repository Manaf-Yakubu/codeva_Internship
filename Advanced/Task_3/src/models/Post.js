module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 200],
        notEmpty: true
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [1, 10000],
        notEmpty: true
      }
    },
    excerpt: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [1, 200],
        notEmpty: true
      }
    },
    status: {
      type: DataTypes.ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED'),
      defaultValue: 'DRAFT',
      allowNull: false
    },
    featuredImage: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    viewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    authorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Categories',
        key: 'id'
      }
    }
  }, {
    hooks: {
      beforeCreate: (post) => {
        if (!post.slug) {
          post.slug = post.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        }
        if (!post.excerpt && post.content) {
          post.excerpt = post.content.substring(0, 200) + '...';
        }
      },
      beforeUpdate: (post) => {
        if (post.changed('title') && !post.changed('slug')) {
          post.slug = post.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        }
        if (post.changed('content') && !post.excerpt) {
          post.excerpt = post.content.substring(0, 200) + '...';
        }
      }
    },
    indexes: [
      {
        unique: true,
        fields: ['slug']
      },
      {
        fields: ['authorId']
      },
      {
        fields: ['categoryId']
      },
      {
        fields: ['status']
      },
      {
        fields: ['publishedAt']
      },
      {
        fields: ['viewCount']
      }
    ]
  });

  Post.associate = function(models) {
    Post.belongsTo(models.User, {
      foreignKey: 'authorId',
      as: 'author'
    });
    Post.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'category'
    });
    Post.hasMany(models.Comment, {
      foreignKey: 'postId',
      as: 'comments'
    });
    Post.belongsToMany(models.Tag, {
      through: models.PostTag,
      foreignKey: 'postId',
      otherKey: 'tagId',
      as: 'tags'
    });
  };

  return Post;
};
