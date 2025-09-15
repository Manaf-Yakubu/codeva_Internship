'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Posts', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      excerpt: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      status: {
        type: Sequelize.ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED'),
        defaultValue: 'DRAFT',
        allowNull: false
      },
      featuredImage: {
        type: Sequelize.STRING,
        allowNull: true,
        field: 'featured_image'
      },
      publishedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        field: 'published_at'
      },
      viewCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
        field: 'view_count'
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
      categoryId: {
        type: Sequelize.UUID,
        allowNull: true,
        field: 'category_id',
        references: {
          model: 'Categories',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
    await queryInterface.addIndex('Posts', ['slug'], { unique: true });
    await queryInterface.addIndex('Posts', ['author_id']);
    await queryInterface.addIndex('Posts', ['category_id']);
    await queryInterface.addIndex('Posts', ['status']);
    await queryInterface.addIndex('Posts', ['published_at']);
    await queryInterface.addIndex('Posts', ['view_count']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Posts');
  }
};
