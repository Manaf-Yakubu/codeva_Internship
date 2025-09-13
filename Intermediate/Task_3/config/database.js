const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create Sequelize instance
const sequelize = new Sequelize({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'codeva_Task_3_db',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  dialect: process.env.DB_DIALECT || 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true
  }
});

// Test database connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('🚀 PostgreSQL Connected Successfully');
    console.log(`📊 Database: ${sequelize.config.database}`);
    console.log(`🏠 Host: ${sequelize.config.host}:${sequelize.config.port}`);
    
    return sequelize;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

// Sync database models
const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('✅ Database synchronized successfully');
  } catch (error) {
    console.error('❌ Database sync failed:', error.message);
    throw error;
  }
};

// Database health check
const checkDBHealth = async () => {
  try {
    await sequelize.authenticate();
    return {
      status: 'connected',
      database: sequelize.config.database,
      host: sequelize.config.host,
      port: sequelize.config.port,
      dialect: sequelize.getDialect()
    };
  } catch (error) {
    return {
      status: 'error',
      error: error.message
    };
  }
};

// Graceful shutdown
const closeDB = async () => {
  try {
    await sequelize.close();
    console.log('🔒 PostgreSQL connection closed');
  } catch (error) {
    console.error('❌ Error closing database connection:', error.message);
  }
};

// Handle process termination
process.on('SIGINT', async () => {
  await closeDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeDB();
  process.exit(0);
});

module.exports = { 
  sequelize, 
  connectDB, 
  syncDatabase, 
  checkDBHealth, 
  closeDB 
};
