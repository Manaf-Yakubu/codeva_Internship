const { User, Product } = require('../models');
const { connectDB } = require('../config/database');

const seedData = async () => {
  try {
    await connectDB();
    console.log('🔗 Database connected for seeding');

    // Create admin user
    const adminUser = await User.findOrCreate({
      where: { email: 'admin@codeva.com' },
      defaults: {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@codeva.com',
        password: 'Admin123!',
        role: 'admin',
        isActive: true,
        emailVerified: true,
        country: 'Ghana'
      }
    });

    console.log('👤 Admin user created/found');

    // Create sample user
    const sampleUser = await User.findOrCreate({
      where: { email: 'user@codeva.com' },
      defaults: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'user@codeva.com',
        password: 'User123!',
        role: 'user',
        isActive: true,
        emailVerified: true,
        country: 'Ghana',
        city: 'Accra'
      }
    });

    console.log('👤 Sample user created/found');

    // Sample products data
    const sampleProducts = [
      {
        name: 'Ghana Kente Cloth',
        description: 'Authentic handwoven Kente cloth from Ghana. Perfect for special occasions and cultural events.',
        price: 150.00,
        category: 'Fashion',
        brand: 'Ghana Heritage',
        sku: 'GH-KENTE-001',
        stock: 25,
        images: ['/images/kente-cloth.jpg'],
        specifications: {
          material: '100% Cotton',
          origin: 'Ghana',
          pattern: 'Traditional Ashanti'
        },
        tags: ['kente', 'traditional', 'ghana', 'fashion'],
        isFeatured: true,
        createdBy: adminUser[0].id
      },
      {
        name: 'Shea Butter - Pure & Natural',
        description: 'Premium quality shea butter sourced directly from Northern Ghana. Perfect for skincare and hair care.',
        price: 25.99,
        category: 'Beauty',
        brand: 'Ghana Natural',
        sku: 'GH-SHEA-001',
        stock: 100,
        images: ['/images/shea-butter.jpg'],
        specifications: {
          type: 'Unrefined',
          origin: 'Northern Ghana',
          weight: '250g'
        },
        tags: ['shea butter', 'natural', 'skincare', 'ghana'],
        isFeatured: true,
        createdBy: adminUser[0].id
      },
      {
        name: 'Cocoa Powder - Premium Grade',
        description: 'High-quality cocoa powder from Ghana\'s finest cocoa beans. Perfect for baking and beverages.',
        price: 18.50,
        category: 'Food',
        brand: 'Ghana Cocoa',
        sku: 'GH-COCOA-001',
        stock: 75,
        images: ['/images/cocoa-powder.jpg'],
        specifications: {
          grade: 'Premium',
          origin: 'Ashanti Region',
          weight: '500g'
        },
        tags: ['cocoa', 'chocolate', 'baking', 'ghana'],
        isFeatured: false,
        createdBy: adminUser[0].id
      },
      {
        name: 'Adinkra Symbol T-Shirt',
        description: 'Comfortable cotton t-shirt featuring traditional Adinkra symbols with modern design.',
        price: 29.99,
        category: 'Fashion',
        brand: 'Modern Ghana',
        sku: 'GH-TSHIRT-001',
        stock: 50,
        images: ['/images/adinkra-tshirt.jpg'],
        specifications: {
          material: '100% Cotton',
          sizes: ['S', 'M', 'L', 'XL'],
          color: 'Black'
        },
        tags: ['adinkra', 'tshirt', 'fashion', 'symbols'],
        isFeatured: false,
        createdBy: sampleUser[0].id
      },
      {
        name: 'Djembe Drum - Handcrafted',
        description: 'Authentic handcrafted djembe drum made by skilled artisans in Ghana. Perfect for music enthusiasts.',
        price: 120.00,
        category: 'Music',
        brand: 'Ghana Drums',
        sku: 'GH-DJEMBE-001',
        stock: 15,
        images: ['/images/djembe-drum.jpg'],
        specifications: {
          material: 'Hardwood & Goatskin',
          height: '24 inches',
          diameter: '12 inches'
        },
        tags: ['djembe', 'drum', 'music', 'handcrafted'],
        isFeatured: true,
        createdBy: adminUser[0].id
      },
      {
        name: 'Plantain Chips - Spicy',
        description: 'Crispy plantain chips with a spicy kick. A popular Ghanaian snack perfect for any time.',
        price: 8.99,
        category: 'Food',
        brand: 'Ghana Snacks',
        sku: 'GH-PLANTAIN-001',
        stock: 200,
        images: ['/images/plantain-chips.jpg'],
        specifications: {
          flavor: 'Spicy',
          weight: '150g',
          ingredients: 'Plantain, Palm Oil, Spices'
        },
        tags: ['plantain', 'chips', 'snack', 'spicy'],
        isFeatured: false,
        createdBy: sampleUser[0].id
      }
    ];

    // Create products
    for (const productData of sampleProducts) {
      await Product.findOrCreate({
        where: { sku: productData.sku },
        defaults: productData
      });
    }

    console.log('🛍️ Sample products created/found');
    console.log('✅ Database seeding completed successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
