const { connectDB, syncDatabase } = require('../config/database');

const setupDatabase = async () => {
  try {
    console.log('🔧 Setting up database...');

    // Connect to database
    await connectDB();
    
    // Sync database models without dropping existing data
    await syncDatabase(false);
    
    console.log('✅ Database setup completed successfully!');
    console.log('📋 Next steps:');
    console.log('   1. Run "npm run seed" to populate with sample data');
    console.log('   2. Run "npm start" to start the server');
    console.log('   3. Visit http://localhost:5000 to test the API');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
};

// Run setup if called directly
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };
