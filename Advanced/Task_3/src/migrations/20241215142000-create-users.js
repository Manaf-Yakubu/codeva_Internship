'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'first_name'
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'last_name'
      },
      role: {
        type: Sequelize.ENUM('USER', 'ADMIN', 'MODERATOR'),
        defaultValue: 'USER',
        allowNull: false
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        field: 'is_active'
      },
      lastLoginAt: {
        type: Sequelize.DATE,
        allowNull: true,
        field: 'last_login_at'
      },
      profilePicture: {
        type: Sequelize.STRING,
        allowNull: true,
        field: 'profile_picture'
      },
      bio: {
        type: Sequelize.TEXT,
        allowNull: true
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
    await queryInterface.addIndex('Users', ['email'], { unique: true });
    await queryInterface.addIndex('Users', ['username'], { unique: true });
    await queryInterface.addIndex('Users', ['role']);
    await queryInterface.addIndex('Users', ['is_active']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};
