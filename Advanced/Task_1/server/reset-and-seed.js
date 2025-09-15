const { Client } = require('pg');
const bcrypt = require('bcryptjs');

async function resetAndSeed() {
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

    // Drop existing tables
    console.log('🗑️ Dropping existing tables...');
    await client.query('DROP TABLE IF EXISTS refresh_tokens CASCADE');
    await client.query('DROP TABLE IF EXISTS products CASCADE');
    await client.query('DROP TABLE IF EXISTS users CASCADE');

    // Enable UUID extension
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    
    console.log('📝 Creating fresh tables...');
    
    // Users table
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

    // Products table
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

    // Refresh tokens table
    await client.query(`
      CREATE TABLE refresh_tokens (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        token VARCHAR(500) UNIQUE NOT NULL,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        expires_at TIMESTAMP NOT NULL,
        is_revoked BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Tables created successfully');

    // Create admin user
    console.log('👤 Creating admin user...');
    const adminPassword = await bcrypt.hash('Admin123!', 12);
    const adminResult = await client.query(`
      INSERT INTO users (first_name, last_name, email, password, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `, ['Admin', 'User', 'admin@codeva.com', adminPassword, 'admin']);
    
    const adminId = adminResult.rows[0].id;
    console.log('✅ Admin user created');

    // Create regular user
    console.log('👤 Creating regular user...');
    const userPassword = await bcrypt.hash('User123!', 12);
    await client.query(`
      INSERT INTO users (first_name, last_name, email, password, role)
      VALUES ($1, $2, $3, $4, $5)
    `, ['John', 'Doe', 'user@codeva.com', userPassword, 'user']);
    console.log('✅ Regular user created');

    // Create sample products
    console.log('🛍️ Creating sample products...');
    const products = [
      {
        name: 'Ghana Kente Cloth',
        description: 'Traditional handwoven Kente cloth from Ghana with authentic patterns and vibrant colors',
        price: 150.00,
        stock: 25,
        category: 'Textiles',
        sku: 'GKC001',
        is_featured: true
      },
      {
        name: 'Shea Butter - Pure',
        description: 'Organic shea butter from Northern Ghana, perfect for skincare and hair care',
        price: 25.99,
        stock: 100,
        category: 'Cosmetics',
        sku: 'SB001',
        is_featured: true
      },
      {
        name: 'Adinkra Symbol Art',
        description: 'Beautiful Adinkra symbol artwork representing wisdom and knowledge',
        price: 75.50,
        stock: 15,
        category: 'Art',
        sku: 'ASA001',
        is_featured: false
      },
      {
        name: 'Ghana Chocolate',
        description: 'Premium dark chocolate made from Ghanaian cocoa beans',
        price: 12.99,
        stock: 50,
        category: 'Food',
        sku: 'GC001',
        is_featured: true
      },
      {
        name: 'Dashiki Shirt',
        description: 'Traditional African dashiki shirt with colorful patterns',
        price: 45.00,
        stock: 30,
        category: 'Clothing',
        sku: 'DS001',
        is_featured: false
      }
    ];

    for (const product of products) {
      await client.query(`
        INSERT INTO products (name, description, price, stock, category, sku, is_featured, created_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
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

    console.log('✅ Sample products created');

    console.log('\n🎉 Database reset and seeded successfully!');
    console.log('\n📋 Default accounts:');
    console.log('👨‍💼 Admin: admin@codeva.com / Admin123!');
    console.log('👤 User: user@codeva.com / User123!');
    console.log('\n🛍️ Sample products created with Ghana theme');

  } catch (error) {
    console.error('❌ Reset and seeding failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await client.end();
  }
}

resetAndSeed();
