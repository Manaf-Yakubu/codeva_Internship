const { Sequelize } = require('sequelize');
require('dotenv').config();

async function testConnection() {
  console.log('Testing database connection...');
  console.log('Database URL:', process.env.DATABASE_URL);
  
  const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: console.log,
  });

  try {
    await sequelize.authenticate();
    console.log('✅ Connection has been established successfully.');
    
    // Test creating tables
    await sequelize.sync({ force: false });
    console.log('✅ Database sync successful.');
    
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
    console.error('Full error:', error);
  } finally {
    await sequelize.close();
  }
}

testConnection();
