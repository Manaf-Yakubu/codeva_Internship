const { Client } = require('pg');
const bcrypt = require('bcryptjs');

async function startFresh() {
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

    // Drop everything and start fresh
    console.log('🗑️ Dropping all tables...');
    await client.query('DROP SCHEMA public CASCADE');
    await client.query('CREATE SCHEMA public');
    await client.query('GRANT ALL ON SCHEMA public TO postgres');
    await client.query('GRANT ALL ON SCHEMA public TO public');
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    
    console.log('📝 Creating simple tables...');
    
    // Simple Users table
    await client.query(`
      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        is_active BOOLEAN DEFAULT true,
        preferences JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Simple Products table
    await client.query(`
      CREATE TABLE products (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        stock INTEGER DEFAULT 0,
        category VARCHAR(100),
        sku VARCHAR(100) UNIQUE,
        is_featured BOOLEAN DEFAULT false,
        is_active BOOLEAN DEFAULT true,
        images TEXT[],
        created_by UUID REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Simple RefreshTokens table
    await client.query(`
      CREATE TABLE refresh_tokens (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        token VARCHAR(500) UNIQUE NOT NULL,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        expires_at TIMESTAMP NOT NULL,
        is_revoked BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Simple tables created');

    // Create users with simple data
    const adminPassword = await bcrypt.hash('Admin123!', 12);
    const userPassword = await bcrypt.hash('User123!', 12);

    await client.query(`
      INSERT INTO users (first_name, last_name, email, password, role)
      VALUES 
        ('Admin', 'User', 'admin@codeva.com', $1, 'admin'),
        ('John', 'Doe', 'user@codeva.com', $2, 'user')
    `, [adminPassword, userPassword]);

    const adminResult = await client.query('SELECT id FROM users WHERE email = $1', ['admin@codeva.com']);
    const adminId = adminResult.rows[0].id;

    // Create simple products
    await client.query(`
      INSERT INTO products (name, description, price, stock, category, sku, is_featured, created_by)
      VALUES 
        ('Ghana Kente Cloth', 'Traditional handwoven Kente cloth', 150.00, 25, 'Textiles', 'GKC001', true, $1),
        ('Shea Butter', 'Organic shea butter from Ghana', 25.99, 100, 'Cosmetics', 'SB001', true, $1),
        ('Adinkra Art', 'Beautiful Adinkra symbol artwork', 75.50, 15, 'Art', 'ASA001', false, $1)
    `, [adminId]);

    console.log('✅ Sample data created');
    console.log('\n🎉 Fresh database setup complete!');
    console.log('Admin: admin@codeva.com / Admin123!');
    console.log('User: user@codeva.com / User123!');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    await client.end();
  }
}

startFresh();
