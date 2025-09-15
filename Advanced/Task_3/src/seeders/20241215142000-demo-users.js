'use strict';

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash('Admin123!', salt);
    const userPassword = await bcrypt.hash('User123!', salt);

    const users = [
      {
        id: uuidv4(),
        username: 'admin',
        email: 'admin@codeva.com',
        password: hashedPassword,
        first_name: 'Admin',
        last_name: 'User',
        role: 'ADMIN',
        is_active: true,
        bio: 'System administrator for CodeVa GraphQL API',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        username: 'yakubu_manaf',
        email: 'manaf@codeva.com',
        password: userPassword,
        first_name: 'Yakubu',
        last_name: 'Abdul Manaf',
        role: 'MODERATOR',
        is_active: true,
        bio: 'CodeVa Internship participant from Ghana, passionate about GraphQL and modern web development',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        username: 'john_doe',
        email: 'john@example.com',
        password: userPassword,
        first_name: 'John',
        last_name: 'Doe',
        role: 'USER',
        is_active: true,
        bio: 'Regular user exploring the GraphQL API',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        username: 'jane_smith',
        email: 'jane@example.com',
        password: userPassword,
        first_name: 'Jane',
        last_name: 'Smith',
        role: 'USER',
        is_active: true,
        bio: 'Frontend developer interested in GraphQL integration',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('Users', users, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
