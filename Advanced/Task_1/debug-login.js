const bcrypt = require('bcryptjs');
const { Client } = require('pg');
require('dotenv').config();

async function debugLogin() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'codeva_fullstack',
    user: 'postgres',
    password: 'ManafYak732'
  });
  
  try {
    await client.connect();
    console.log('✅ Database connected');
    
    // Check if users exist
    const usersResult = await client.query('SELECT email, role, first_name, last_name FROM users');
    console.log('\n📋 All users in database:');
    usersResult.rows.forEach(user => {
      console.log(`- ${user.email} (${user.role}) - ${user.first_name} ${user.last_name}`);
    });
    
    // Test admin login
    console.log('\n🔐 Testing admin login...');
    const adminResult = await client.query('SELECT * FROM users WHERE email = $1', ['admin@codeva.com']);
    
    if (adminResult.rows.length > 0) {
      const user = adminResult.rows[0];
      console.log('User found:', user.email);
      
      const isValid = await bcrypt.compare('Admin123!', user.password);
      console.log('Password valid:', isValid);
      
      if (!isValid) {
        console.log('Stored hash:', user.password);
        console.log('Testing password: Admin123!');
      }
    } else {
      console.log('❌ Admin user not found');
      
      // Create admin user
      console.log('Creating admin user...');
      const hashedPassword = await bcrypt.hash('Admin123!', 12);
      
      await client.query(
        'INSERT INTO users (first_name, last_name, email, password, role) VALUES ($1, $2, $3, $4, $5)',
        ['Admin', 'User', 'admin@codeva.com', hashedPassword, 'admin']
      );
      
      console.log('✅ Admin user created');
    }
    
    // Test regular user login
    console.log('\n👤 Testing user login...');
    const userResult = await client.query('SELECT * FROM users WHERE email = $1', ['user@codeva.com']);
    
    if (userResult.rows.length === 0) {
      console.log('Creating regular user...');
      const hashedPassword = await bcrypt.hash('User123!', 12);
      
      await client.query(
        'INSERT INTO users (first_name, last_name, email, password, role) VALUES ($1, $2, $3, $4, $5)',
        ['Regular', 'User', 'user@codeva.com', hashedPassword, 'user']
      );
      
      console.log('✅ Regular user created');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

debugLogin();
