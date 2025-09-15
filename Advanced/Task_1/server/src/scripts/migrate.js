const { sequelize } = require('../config/database');
const User = require('../models/User');
const Product = require('../models/Product');
const RefreshToken = require('../models/RefreshToken');

const runMigrations = async () => {
  try {
    console.log('🔄 Starting database migrations...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Sync all models
    await sequelize.sync({ force: false, alter: true });
    console.log('✅ Database models synchronized');
    
    console.log('🎉 Migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  runMigrations();
}

module.exports = runMigrations;
