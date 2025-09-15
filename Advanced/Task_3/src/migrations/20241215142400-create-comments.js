'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Comments', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('PENDING', 'APPROVED', 'REJECTED'),
        defaultValue: 'PENDING',
        allowNull: false
      },
      authorId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: 'author_id',
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
      parentId: {
        type: Sequelize.UUID,
        allowNull: true,
        field: 'parent_id',
        references: {
          model: 'Comments',
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
    await queryInterface.addIndex('Comments', ['author_id']);
    await queryInterface.addIndex('Comments', ['post_id']);
    await queryInterface.addIndex('Comments', ['parent_id']);
    await queryInterface.addIndex('Comments', ['status']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Comments');
  }
};
