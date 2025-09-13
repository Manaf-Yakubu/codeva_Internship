const { Client } = require('pg');

async function testSimpleConnection() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'codeva_Task_3_db',
    user: 'postgres',
    password: '...Yak732',
  });

  try {
    console.log('🔍 Testing direct PostgreSQL connection...');
    await client.connect();
    const result = await client.query('SELECT version()');
    console.log('✅ Connection successful!');
    console.log('PostgreSQL version:', result.rows[0].version);
    await client.end();
    return true;
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    // Try with your Windows username
    const client2 = new Client({
      host: 'localhost',
      port: 5432,
      database: 'codeva_Task_3_db',
      user: 'AMN21',
      password: '...Yak732',
    });
    
    try {
      console.log('🔍 Trying with Windows username AMN21...');
      await client2.connect();
      const result2 = await client2.query('SELECT version()');
      console.log('✅ Connection successful with AMN21 user!');
      console.log('PostgreSQL version:', result2.rows[0].version);
      await client2.end();
      return 'AMN21';
    } catch (error2) {
      console.error('❌ Both connection attempts failed');
      console.error('Error with AMN21 user:', error2.message);
      return false;
    }
  }
}

testSimpleConnection();
