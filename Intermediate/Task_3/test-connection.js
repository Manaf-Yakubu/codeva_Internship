require('dotenv').config();
const { Sequelize } = require('sequelize');

// Try with Windows authentication first
const sequelize = new Sequelize({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'codeva_Task_3_db',
  username: 'AMN21',
  password: null,
  dialect: 'postgres',
  logging: console.log
});

// Backup connection with password
const sequelizeWithPassword = new Sequelize({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'codeva_Task_3_db',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  dialect: 'postgres',
  logging: console.log
});

async function testConnection() {
  // Try Windows authentication first
  try {
    console.log('🔍 Trying Windows authentication (user: AMN21)...');
    await sequelize.authenticate();
    console.log('✅ Windows authentication successful!');
    await sequelize.close();
    return true;
  } catch (error) {
    console.log('❌ Windows authentication failed, trying password authentication...');
  }

  // Try with password
  try {
    console.log('🔍 Trying password authentication...');
    console.log('Host:', process.env.DB_HOST);
    console.log('Port:', process.env.DB_PORT);
    console.log('Database:', process.env.DB_NAME);
    console.log('User:', process.env.DB_USER);
    console.log('Password length:', process.env.DB_PASSWORD ? process.env.DB_PASSWORD.length : 'undefined');
    
    await sequelizeWithPassword.authenticate();
    console.log('✅ Password authentication successful!');
    await sequelizeWithPassword.close();
    return true;
  } catch (error) {
    console.error('❌ Both authentication methods failed');
    console.error('Error:', error.message);
    return false;
  }
}

testConnection();
