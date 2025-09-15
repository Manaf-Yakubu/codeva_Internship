'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PostTags', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      postId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: 'post_id',
        references: {
          model: 'Posts',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      tagId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: 'tag_id',
        references: {
          model: 'Tags',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        field: 'created_at'
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        field: 'updated_at'
      }
    });

    // Add indexes
    await queryInterface.addIndex('PostTags', ['post_id', 'tag_id'], { unique: true });
    await queryInterface.addIndex('PostTags', ['post_id']);
    await queryInterface.addIndex('PostTags', ['tag_id']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('PostTags');
  }
};
