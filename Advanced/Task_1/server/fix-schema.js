const { Client } = require('pg');

async function fixSchema() {
  const client = new Client({
    user: 'postgres',
    password: '...Yak732',
    host: 'localhost',
    port: 5432,
    database: 'codeva_fullstack'
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Drop all tables and recreate with proper schema
    console.log('🗑️ Dropping all tables...');
    await client.query('DROP SCHEMA public CASCADE');
    await client.query('CREATE SCHEMA public');
    await client.query('GRANT ALL ON SCHEMA public TO postgres');
    await client.query('GRANT ALL ON SCHEMA public TO public');

    // Enable UUID extension
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    
    console.log('📝 Creating tables with correct schema...');
    
    // Users table with proper naming
    await client.query(`
      CREATE TABLE "Users" (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "firstName" VARCHAR(255) NOT NULL,
        "lastName" VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        "isActive" BOOLEAN DEFAULT true,
        preferences JSONB DEFAULT '{}',
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Products table with proper naming
    await client.query(`
      CREATE TABLE "Products" (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        stock INTEGER DEFAULT 0,
        category VARCHAR(100),
        sku VARCHAR(100) UNIQUE,
        "isFeatured" BOOLEAN DEFAULT false,
        "isActive" BOOLEAN DEFAULT true,
        images TEXT[],
        "createdBy" UUID REFERENCES "Users"(id),
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // RefreshTokens table with proper naming
    await client.query(`
      CREATE TABLE "RefreshTokens" (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        token VARCHAR(500) UNIQUE NOT NULL,
        "userId" UUID REFERENCES "Users"(id) ON DELETE CASCADE,
        "expiresAt" TIMESTAMP NOT NULL,
        "isRevoked" BOOLEAN DEFAULT false,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Tables created with proper schema');
    console.log('🎉 Database schema fixed successfully!');

  } catch (error) {
    console.error('❌ Schema fix failed:', error.message);
  } finally {
    await client.end();
  }
}

fixSchema();
