require('dotenv').config();
const { Client } = require('pg');

async function testDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/codeva_pern'
  });

  try {
    await client.connect();
    console.log('✅ Database connected');
    
    const result = await client.query('SELECT email, role, first_name, last_name FROM users LIMIT 10');
    console.log('\n📋 Users in database:');
    result.rows.forEach(user => {
      console.log(`- ${user.email} (${user.role}) - ${user.first_name} ${user.last_name}`);
    });
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await client.end();
  }
}

testDatabase();
