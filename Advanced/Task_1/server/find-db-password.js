const { Client } = require('pg');
const fs = require('fs');

// Common passwords to try
const passwords = ['', 'postgres', 'password', '123456', 'admin', 'root', '1234'];

async function findWorkingPassword() {
  console.log('🔍 Testing common PostgreSQL passwords...\n');
  
  for (const password of passwords) {
    console.log(`Testing password: "${password || '(empty)'}"`);
    
    const client = new Client({
      user: 'postgres',
      password: password,
      host: 'localhost',
      port: 5432,
      database: 'postgres'
    });
    
    try {
      await client.connect();
      console.log('✅ Connection successful!');
      
      // Check if codeva_fullstack database exists
      const dbResult = await client.query("SELECT 1 FROM pg_database WHERE datname = 'codeva_fullstack'");
      
      if (dbResult.rows.length === 0) {
        console.log('📝 Creating codeva_fullstack database...');
        await client.query('CREATE DATABASE codeva_fullstack');
        console.log('✅ Database created successfully!');
      } else {
        console.log('✅ Database codeva_fullstack already exists');
      }
      
      await client.end();
      
      // Update .env file
      const envPath = '.env';
      let envContent = fs.readFileSync(envPath, 'utf8');
      
      // Update database password in .env
      envContent = envContent.replace(
        /DB_PASSWORD=.*/,
        `DB_PASSWORD=${password}`
      );
      envContent = envContent.replace(
        /DATABASE_URL=postgresql:\/\/postgres:.*@localhost:5432\/codeva_fullstack/,
        `DATABASE_URL=postgresql://postgres:${password}@localhost:5432/codeva_fullstack`
      );
      
      fs.writeFileSync(envPath, envContent);
      
      console.log('\n🎉 SUCCESS! Updated .env file with working credentials');
      console.log(`Database URL: postgresql://postgres:${password}@localhost:5432/codeva_fullstack`);
      console.log('\nYou can now run: node src/scripts/seed.js');
      return true;
      
    } catch (error) {
      console.log(`❌ Failed: ${error.message}`);
      try {
        await client.end();
      } catch {}
    }
  }
  
  console.log('\n❌ Could not find working password with common options.');
  console.log('Please check your PostgreSQL installation or provide the correct password.');
  return false;
}

findWorkingPassword().catch(console.error);
