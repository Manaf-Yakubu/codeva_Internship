const { Client } = require('pg');

async function seedDatabase() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'codeva_Task_3_db',
    user: 'postgres',
    password: '...Yak732',
  });

  try {
    console.log('🌱 Starting minimal database seeding...');
    await client.connect();

    // Create a simple user
    console.log('📝 Creating admin user...');
    const userResult = await client.query(`
      INSERT INTO "Users" (
        id, "firstName", "lastName", email, password, phone, role, 
        "addressCity", "addressRegion", "emailVerified", "createdAt", "updatedAt"
      ) VALUES (
        gen_random_uuid(), 'Yakubu', 'Abdul Manaf', 'yakubu.manaf@codeva.com',
        '$2b$12$LQv3c1yX8LjjW6TXF3NqKe.0CJY.QIUQ02T6yrT3l0FJU6FQU6T36',
        '+233244123456', 'admin', 'Accra', 'Greater Accra', true, NOW(), NOW()
      ) RETURNING id;
    `);
    
    const userId = userResult.rows[0].id;
    console.log(`✅ Created admin user with ID: ${userId}`);

    // Create a category
    console.log('📂 Creating category...');
    const categoryResult = await client.query(`
      INSERT INTO "Categories" (
        id, name, slug, description, "isActive", "isGhanaSpecific", "createdAt", "updatedAt"
      ) VALUES (
        gen_random_uuid(), 'Electronics', 'electronics', 'Electronic devices and gadgets',
        true, false, NOW(), NOW()
      ) RETURNING id;
    `);
    
    const categoryId = categoryResult.rows[0].id;
    console.log(`✅ Created category with ID: ${categoryId}`);

    // Create a product
    console.log('🛍️ Creating product...');
    await client.query(`
      INSERT INTO "Products" (
        id, name, slug, description, "shortDescription", price, currency,
        "categoryId", "vendorId", quantity, "isActive", "madeInGhana", "createdAt", "updatedAt"
      ) VALUES (
        gen_random_uuid(), 'Sample Product', 'sample-product', 
        'A sample product for testing', 'Sample product', 99.99, 'GHS',
        $1, $2, 50, true, true, NOW(), NOW()
      );
    `, [categoryId, userId]);

    console.log('✅ Database seeding completed successfully!');
    console.log('📊 Created: 1 user, 1 category, 1 product');
    
    await client.end();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    await client.end();
    process.exit(1);
  }
}

seedDatabase();
