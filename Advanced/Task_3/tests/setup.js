require('dotenv').config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'codeva_graphql_test_db';

// Suppress console logs during tests
if (process.env.NODE_ENV === 'test') {
  console.log = jest.fn();
  console.warn = jest.fn();
  console.error = jest.fn();
}
