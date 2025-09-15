const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const checkPostgreSQL = () => {
  try {
    log('🔍 Checking PostgreSQL installation...', 'blue');
    execSync('psql --version', { stdio: 'pipe' });
    log('✅ PostgreSQL is installed', 'green');
    return true;
  } catch (error) {
    log('❌ PostgreSQL is not installed or not in PATH', 'red');
    log('Please install PostgreSQL from: https://www.postgresql.org/download/', 'yellow');
    return false;
  }
};

const createDatabase = () => {
  try {
    log('🔧 Creating database...', 'blue');
    
    // Try to create database with default postgres user
    try {
      execSync('createdb -U postgres codeva_fullstack', { stdio: 'pipe' });
      log('✅ Database "codeva_fullstack" created successfully', 'green');
    } catch (error) {
      if (error.message.includes('already exists')) {
        log('ℹ️ Database "codeva_fullstack" already exists', 'yellow');
      } else {
        throw error;
      }
    }
    
    return true;
  } catch (error) {
    log('❌ Failed to create database:', 'red');
    log(error.message, 'red');
    return false;
  }
};

const testConnection = () => {
  try {
    log('🔌 Testing database connection...', 'blue');
    
    // Test connection with psql
    execSync('psql -U postgres -d codeva_fullstack -c "SELECT version();"', { stdio: 'pipe' });
    log('✅ Database connection successful', 'green');
    return true;
  } catch (error) {
    log('❌ Database connection failed:', 'red');
    log('Please ensure PostgreSQL is running and the password is correct', 'yellow');
    return false;
  }
};

const updateEnvFile = () => {
  try {
    log('📝 Updating environment configuration...', 'blue');
    
    const envPath = path.join(__dirname, 'server', '.env');
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Update database configuration for local development
    envContent = envContent.replace(
      /DB_PASSWORD=.*/,
      'DB_PASSWORD=postgres'
    );
    
    envContent = envContent.replace(
      /DATABASE_URL=.*/,
      'DATABASE_URL=postgresql://postgres:postgres@localhost:5432/codeva_fullstack'
    );
    
    fs.writeFileSync(envPath, envContent);
    log('✅ Environment file updated', 'green');
    return true;
  } catch (error) {
    log('❌ Failed to update environment file:', 'red');
    log(error.message, 'red');
    return false;
  }
};

const runMigrations = () => {
  try {
    log('🚀 Running database migrations...', 'blue');
    
    // Change to server directory and run migrations
    process.chdir(path.join(__dirname, 'server'));
    execSync('npm run migrate', { stdio: 'inherit' });
    
    log('✅ Migrations completed successfully', 'green');
    return true;
  } catch (error) {
    log('❌ Migration failed:', 'red');
    log(error.message, 'red');
    return false;
  }
};

const seedDatabase = () => {
  try {
    log('🌱 Seeding database with initial data...', 'blue');
    
    execSync('npm run seed', { stdio: 'inherit' });
    log('✅ Database seeded successfully', 'green');
    return true;
  } catch (error) {
    log('❌ Seeding failed:', 'red');
    log(error.message, 'red');
    return false;
  }
};

const main = async () => {
  log('🚀 CodeVA Database Setup Script', 'blue');
  log('================================', 'blue');
  
  // Check prerequisites
  if (!checkPostgreSQL()) {
    process.exit(1);
  }
  
  // Setup steps
  const steps = [
    { name: 'Update Environment', fn: updateEnvFile },
    { name: 'Create Database', fn: createDatabase },
    { name: 'Test Connection', fn: testConnection },
    { name: 'Run Migrations', fn: runMigrations },
    { name: 'Seed Database', fn: seedDatabase }
  ];
  
  for (const step of steps) {
    if (!step.fn()) {
      log(`❌ Setup failed at step: ${step.name}`, 'red');
      process.exit(1);
    }
  }
  
  log('🎉 Database setup completed successfully!', 'green');
  log('You can now start the application with: npm run dev', 'blue');
};

if (require.main === module) {
  main().catch(error => {
    log('❌ Setup failed:', 'red');
    log(error.message, 'red');
    process.exit(1);
  });
}

module.exports = { main };
