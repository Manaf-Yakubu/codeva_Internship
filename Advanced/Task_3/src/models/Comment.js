module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [1, 1000],
        notEmpty: true
      }
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
      defaultValue: 'PENDING',
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
    postId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Posts',
        key: 'id'
      }
    },
    parentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Comments',
        key: 'id'
      }
    }
  }, {
    indexes: [
      {
        fields: ['authorId']
      },
      {
        fields: ['postId']
      },
      {
        fields: ['parentId']
      },
      {
        fields: ['status']
      }
    ]
  });

  Comment.associate = function(models) {
    Comment.belongsTo(models.User, {
      foreignKey: 'authorId',
      as: 'author'
    });
    Comment.belongsTo(models.Post, {
      foreignKey: 'postId',
      as: 'post'
    });
    Comment.belongsTo(models.Comment, {
      foreignKey: 'parentId',
      as: 'parent'
    });
    Comment.hasMany(models.Comment, {
      foreignKey: 'parentId',
      as: 'replies'
    });
  };

  return Comment;
};
