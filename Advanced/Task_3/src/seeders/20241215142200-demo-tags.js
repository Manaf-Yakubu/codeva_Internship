'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tags = [
      {
        id: uuidv4(),
        name: 'GraphQL',
        slug: 'graphql',
        description: 'GraphQL query language and runtime',
        color: '#E10098',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Apollo Server',
        slug: 'apollo-server',
        description: 'Apollo Server GraphQL implementation',
        color: '#311C87',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Node.js',
        slug: 'nodejs',
        description: 'JavaScript runtime for server-side development',
        color: '#339933',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'PostgreSQL',
        slug: 'postgresql',
        description: 'Advanced open source relational database',
        color: '#336791',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Sequelize',
        slug: 'sequelize',
        description: 'Promise-based Node.js ORM',
        color: '#52B0E7',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Authentication',
        slug: 'authentication',
        description: 'User authentication and authorization',
        color: '#FF6B6B',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'JWT',
        slug: 'jwt',
        description: 'JSON Web Tokens for secure authentication',
        color: '#000000',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'API Development',
        slug: 'api-development',
        description: 'Building robust and scalable APIs',
        color: '#4ECDC4',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Ghana',
        slug: 'ghana',
        description: 'Content related to Ghana and West Africa',
        color: '#FCD116',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Tutorial',
        slug: 'tutorial',
        description: 'Step-by-step learning content',
        color: '#95A5A6',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('Tags', tags, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tags', null, {});
  }
};
