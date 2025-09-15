const { Client } = require('pg');

// Common PostgreSQL default configurations to try
const configs = [
  {
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'postgres' // Connect to default postgres db first
  },
  {
    user: 'postgres',
    password: 'password',
    host: 'localhost',
    port: 5432,
    database: 'postgres'
  },
  {
    user: 'postgres',
    password: '',
    host: 'localhost',
    port: 5432,
    database: 'postgres'
  },
  {
    user: 'postgres',
    password: '123456',
    host: 'localhost',
    port: 5432,
    database: 'postgres'
  }
];

async function testConfigs() {
  console.log('Testing PostgreSQL connection configurations...\n');
  
  for (let i = 0; i < configs.length; i++) {
    const config = configs[i];
    console.log(`Testing config ${i + 1}:`);
    console.log(`  User: ${config.user}`);
    console.log(`  Password: ${config.password || '(empty)'}`);
    console.log(`  Host: ${config.host}:${config.port}`);
    console.log(`  Database: ${config.database}`);
    
    const client = new Client(config);
    
    try {
      await client.connect();
      console.log('  ✅ Connection successful!');
      
      // Check if our target database exists
      const result = await client.query("SELECT datname FROM pg_database WHERE datname = 'codeva_fullstack'");
      if (result.rows.length > 0) {
        console.log('  ✅ Database "codeva_fullstack" exists');
      } else {
        console.log('  ⚠️  Database "codeva_fullstack" does not exist');
        console.log('     Creating database...');
        try {
          await client.query('CREATE DATABASE codeva_fullstack');
          console.log('  ✅ Database "codeva_fullstack" created');
        } catch (createError) {
          console.log('  ❌ Failed to create database:', createError.message);
        }
      }
      
      await client.end();
      
      // Update .env file with working config
      const envContent = `# Database Configuration
DATABASE_URL=postgresql://${config.user}:${config.password}@${config.host}:${config.port}/codeva_fullstack
DB_HOST=${config.host}
DB_PORT=${config.port}
DB_NAME=codeva_fullstack
DB_USER=${config.user}
DB_PASSWORD=${config.password}

# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production-12345
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production-67890
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Server Configuration
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000

# Security Configuration
BCRYPT_SALT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_AUTH_MAX=5

# Email Configuration (Optional - for future features)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@codeva.com
FROM_NAME=CodeVA App

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
ALLOWED_FILE_TYPES=jpg,jpeg,png,gif,pdf,doc,docx

# App Configuration
APP_NAME=CodeVA Full-Stack App
APP_VERSION=1.0.0
CLIENT_URL=http://localhost:3000
ADMIN_EMAIL=admin@codeva.com`;

      require('fs').writeFileSync('.env', envContent);
      console.log('  ✅ Updated .env file with working configuration');
      console.log('\n🎉 Found working configuration! You can now run the application.');
      return;
      
    } catch (error) {
      console.log('  ❌ Connection failed:', error.message);
      await client.end().catch(() => {});
    }
    
    console.log('');
  }
  
  console.log('❌ None of the common configurations worked.');
  console.log('Please check your PostgreSQL installation and credentials.');
  console.log('\nTo fix this:');
  console.log('1. Make sure PostgreSQL is running');
  console.log('2. Check your PostgreSQL username and password');
  console.log('3. Update the .env file with correct credentials');
}

testConfigs().catch(console.error);
