module.exports = (sequelize, DataTypes) => {
  const PostTag = sequelize.define('PostTag', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    postId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Posts',
        key: 'id'
      }
    },
    tagId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Tags',
        key: 'id'
      }
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['postId', 'tagId']
      },
      {
        fields: ['postId']
      },
      {
        fields: ['tagId']
      }
    ]
  });

  PostTag.associate = function(models) {
    // This is a junction table, associations are defined in Post and Tag models
  };

  return PostTag;
};
