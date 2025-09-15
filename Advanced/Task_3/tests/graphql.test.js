const request = require('supertest');
const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const { sequelize } = require('../src/models');
const typeDefs = require('../src/schema/typeDefs');
const resolvers = require('../src/resolvers');
const DataLoaderFactory = require('../src/utils/dataLoader');

describe('GraphQL API Tests', () => {
  let server;
  let app;
  let testUser;
  let authToken;

  beforeAll(async () => {
    // Set up test database
    await sequelize.sync({ force: true });
    
    // Create Apollo Server for testing
    server = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => ({
        user: req.user,
        loaders: DataLoaderFactory.createLoaders()
      })
    });

    app = express();
    await server.start();
    server.applyMiddleware({ app });
  });

  afterAll(async () => {
    await server.stop();
    await sequelize.close();
  });

  describe('Authentication', () => {
    test('should register a new user', async () => {
      const mutation = `
        mutation Register($input: RegisterInput!) {
          register(input: $input) {
            token
            user {
              id
              username
              email
              role
            }
          }
        }
      `;

      const variables = {
        input: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'Test123!',
          firstName: 'Test',
          lastName: 'User'
        }
      };

      const response = await request(app)
        .post('/graphql')
        .send({ query: mutation, variables })
        .expect(200);

      expect(response.body.data.register).toBeDefined();
      expect(response.body.data.register.user.username).toBe('testuser');
      expect(response.body.data.register.user.role).toBe('USER');
      
      authToken = response.body.data.register.token;
      testUser = response.body.data.register.user;
    });

    test('should login with valid credentials', async () => {
      const mutation = `
        mutation Login($input: LoginInput!) {
          login(input: $input) {
            token
            user {
              id
              username
              email
            }
          }
        }
      `;

      const variables = {
        input: {
          email: 'test@example.com',
          password: 'Test123!'
        }
      };

      const response = await request(app)
        .post('/graphql')
        .send({ query: mutation, variables })
        .expect(200);

      expect(response.body.data.login).toBeDefined();
      expect(response.body.data.login.user.email).toBe('test@example.com');
    });

    test('should fail login with invalid credentials', async () => {
      const mutation = `
        mutation Login($input: LoginInput!) {
          login(input: $input) {
            token
            user {
              id
            }
          }
        }
      `;

      const variables = {
        input: {
          email: 'test@example.com',
          password: 'wrongpassword'
        }
      };

      const response = await request(app)
        .post('/graphql')
        .send({ query: mutation, variables })
        .expect(200);

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].message).toContain('Invalid email or password');
    });
  });

  describe('Posts', () => {
    test('should create a new post', async () => {
      const mutation = `
        mutation CreatePost($input: CreatePostInput!) {
          createPost(input: $input) {
            id
            title
            content
            status
            author {
              username
            }
          }
        }
      `;

      const variables = {
        input: {
          title: 'Test Post',
          content: 'This is a test post content',
          status: 'PUBLISHED'
        }
      };

      const response = await request(app)
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ query: mutation, variables })
        .expect(200);

      expect(response.body.data.createPost).toBeDefined();
      expect(response.body.data.createPost.title).toBe('Test Post');
      expect(response.body.data.createPost.status).toBe('PUBLISHED');
    });

    test('should fetch posts with pagination', async () => {
      const query = `
        query Posts($pagination: PaginationInput) {
          posts(pagination: $pagination) {
            posts {
              id
              title
              status
              author {
                username
              }
            }
            pagination {
              currentPage
              totalPages
              totalItems
            }
          }
        }
      `;

      const variables = {
        pagination: {
          page: 1,
          limit: 10
        }
      };

      const response = await request(app)
        .post('/graphql')
        .send({ query, variables })
        .expect(200);

      expect(response.body.data.posts).toBeDefined();
      expect(response.body.data.posts.posts).toBeInstanceOf(Array);
      expect(response.body.data.posts.pagination).toBeDefined();
    });
  });

  describe('Categories', () => {
    test('should fetch all categories', async () => {
      const query = `
        query Categories {
          categories {
            id
            name
            slug
            isActive
          }
        }
      `;

      const response = await request(app)
        .post('/graphql')
        .send({ query })
        .expect(200);

      expect(response.body.data.categories).toBeDefined();
      expect(response.body.data.categories).toBeInstanceOf(Array);
    });
  });

  describe('Error Handling', () => {
    test('should handle unauthorized access', async () => {
      const mutation = `
        mutation CreatePost($input: CreatePostInput!) {
          createPost(input: $input) {
            id
            title
          }
        }
      `;

      const variables = {
        input: {
          title: 'Unauthorized Post',
          content: 'This should fail'
        }
      };

      const response = await request(app)
        .post('/graphql')
        .send({ query: mutation, variables })
        .expect(200);

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].message).toContain('logged in');
    });

    test('should validate input data', async () => {
      const mutation = `
        mutation Register($input: RegisterInput!) {
          register(input: $input) {
            token
          }
        }
      `;

      const variables = {
        input: {
          username: '',
          email: 'invalid-email',
          password: '123',
          firstName: '',
          lastName: ''
        }
      };

      const response = await request(app)
        .post('/graphql')
        .send({ query: mutation, variables })
        .expect(200);

      expect(response.body.errors).toBeDefined();
    });
  });
});
