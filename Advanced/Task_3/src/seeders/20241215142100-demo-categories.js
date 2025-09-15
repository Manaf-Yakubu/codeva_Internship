'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const categories = [
      {
        id: uuidv4(),
        name: 'Technology',
        slug: 'technology',
        description: 'Latest trends and insights in technology and software development',
        color: '#3B82F6',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'GraphQL',
        slug: 'graphql',
        description: 'Everything about GraphQL, Apollo Server, and modern API development',
        color: '#E91E63',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Web Development',
        slug: 'web-development',
        description: 'Frontend and backend web development tutorials and best practices',
        color: '#10B981',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Database',
        slug: 'database',
        description: 'Database design, optimization, and management techniques',
        color: '#F59E0B',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'CodeVa Internship',
        slug: 'codeva-internship',
        description: 'Posts related to CodeVa internship program and learning journey',
        color: '#8B5CF6',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('Categories', categories, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Categories', null, {});
  }
};
