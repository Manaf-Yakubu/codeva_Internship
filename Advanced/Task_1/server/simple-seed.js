const { Client } = require('pg');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
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

    // Create tables
    console.log('📝 Creating tables...');
    
    // Enable UUID extension
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    
    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
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

    // Products table
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
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

    // Refresh tokens table
    await client.query(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        token VARCHAR(500) UNIQUE NOT NULL,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        expires_at TIMESTAMP NOT NULL,
        is_revoked BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Tables created');

    // Create admin user
    const adminPassword = await bcrypt.hash('Admin123!', 12);
    await client.query(`
      INSERT INTO users (first_name, last_name, email, password, role)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO NOTHING
    `, ['Admin', 'User', 'admin@codeva.com', adminPassword, 'admin']);

    // Create regular user
    const userPassword = await bcrypt.hash('User123!', 12);
    await client.query(`
      INSERT INTO users (first_name, last_name, email, password, role)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO NOTHING
    `, ['John', 'Doe', 'user@codeva.com', userPassword, 'user']);

    console.log('✅ Users created');

    // Get admin user ID for products
    const adminResult = await client.query('SELECT id FROM users WHERE email = $1', ['admin@codeva.com']);
    const adminId = adminResult.rows[0]?.id;

    if (adminId) {
      // Create sample products
      const products = [
        {
          name: 'Ghana Kente Cloth',
          description: 'Traditional handwoven Kente cloth from Ghana',
          price: 150.00,
          stock: 25,
          category: 'Textiles',
          sku: 'GKC001',
          is_featured: true
        },
        {
          name: 'Shea Butter - Pure',
          description: 'Organic shea butter from Northern Ghana',
          price: 25.99,
          stock: 100,
          category: 'Cosmetics',
          sku: 'SB001',
          is_featured: true
        },
        {
          name: 'Adinkra Symbol Art',
          description: 'Beautiful Adinkra symbol artwork',
          price: 75.50,
          stock: 15,
          category: 'Art',
          sku: 'ASA001',
          is_featured: false
        }
      ];

      for (const product of products) {
        await client.query(`
          INSERT INTO products (name, description, price, stock, category, sku, is_featured, created_by)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (sku) DO NOTHING
        `, [
          product.name,
          product.description,
          product.price,
          product.stock,
          product.category,
          product.sku,
          product.is_featured,
          adminId
        ]);
      }

      console.log('✅ Products created');
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log('\nDefault accounts:');
    console.log('Admin: admin@codeva.com / Admin123!');
    console.log('User: user@codeva.com / User123!');

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
  } finally {
    await client.end();
  }
}

seedDatabase();
