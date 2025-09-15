const { Client } = require('pg');

async function testDirectConnection() {
  console.log('Testing direct PostgreSQL connection...');
  
  const client = new Client({
    user: 'postgres',
    password: '...Yak732',
    host: 'localhost',
    port: 5432,
    database: 'postgres' // Connect to default postgres database first
  });
  
  try {
    await client.connect();
    console.log('✅ Direct connection successful!');
    
    // Check if codeva_fullstack database exists
    const result = await client.query("SELECT datname FROM pg_database WHERE datname = 'codeva_fullstack'");
    
    if (result.rows.length === 0) {
      console.log('Creating codeva_fullstack database...');
      await client.query('CREATE DATABASE codeva_fullstack');
      console.log('✅ Database created!');
    } else {
      console.log('✅ Database codeva_fullstack exists');
    }
    
    await client.end();
    
    // Now test connection to our target database
    const targetClient = new Client({
      user: 'postgres',
      password: '...Yak732',
      host: 'localhost',
      port: 5432,
      database: 'codeva_fullstack'
    });
    
    await targetClient.connect();
    console.log('✅ Connection to codeva_fullstack successful!');
    await targetClient.end();
    
    return true;
    
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
    return false;
  }
}

testDirectConnection().then(success => {
  if (success) {
    console.log('\n🎉 Database connection working! You can now run the seed script.');
  } else {
    console.log('\n❌ Please check your PostgreSQL password and try again.');
  }
});
