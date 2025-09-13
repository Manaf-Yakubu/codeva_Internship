const { connectDB, syncDatabase } = require('../config/database');
const { User, Category, Product, Order } = require('../models');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to database
    await connectDB();
    
    // Clear existing data and recreate tables
    await syncDatabase(true);
    
    console.log('📝 Creating users...');
    const users = await User.bulkCreate([
      {
        firstName: 'Yakubu',
        lastName: 'Abdul Manaf',
        email: 'yakubu.manaf@codeva.com',
        password: 'CodeVa2024!',
        phone: '+233244123456',
        role: 'admin',
        addressCity: 'Accra',
        addressRegion: 'Greater Accra',
        emailVerified: true
      },
      {
        firstName: 'Kwame',
        lastName: 'Asante',
        email: 'kwame.asante@gmail.com',
        password: 'Ghana2024!',
        phone: '+233501234567',
        role: 'vendor',
        addressCity: 'Kumasi',
        addressRegion: 'Ashanti',
        emailVerified: true
      },
      {
        firstName: 'Akosua',
        lastName: 'Mensah',
        email: 'akosua.mensah@yahoo.com',
        password: 'Accra2024!',
        phone: '+233277654321',
        role: 'user',
        addressCity: 'Accra',
        addressRegion: 'Greater Accra',
        emailVerified: true
      }
    ], { individualHooks: true });

    console.log('📂 Creating categories...');
    const categories = await Category.bulkCreate([
      {
        name: 'Electronics',
        description: 'Electronic devices and gadgets',
        isGhanaSpecific: false
      },
      {
        name: 'Fashion',
        description: 'Clothing and accessories',
        isGhanaSpecific: false
      },
      {
        name: 'Kente & Traditional Wear',
        description: 'Authentic Ghanaian traditional clothing',
        isGhanaSpecific: true,
        ghanaRegions: ['Ashanti', 'Volta']
      },
      {
        name: 'Local Foods',
        description: 'Ghanaian food products and ingredients',
        isGhanaSpecific: true,
        ghanaRegions: ['Greater Accra', 'Ashanti', 'Central']
      }
    ]);

    console.log('🛍️ Creating products...');
    const vendor = users.find(u => u.role === 'vendor');
    const products = await Product.bulkCreate([
      {
        name: 'Authentic Kente Cloth',
        description: 'Beautiful handwoven Kente cloth from Ashanti region',
        shortDescription: 'Handwoven Kente cloth',
        price: 250.00,
        currency: 'GHS',
        categoryId: categories[2].id,
        vendorId: vendor.id,
        quantity: 15,
        madeInGhana: true,
        ghanaRegion: 'Ashanti',
        isFeatured: true
      },
      {
        name: 'Pure Palm Oil',
        description: 'Fresh palm oil from Central region farms',
        shortDescription: 'Pure Ghanaian palm oil',
        price: 45.00,
        currency: 'GHS',
        categoryId: categories[3].id,
        vendorId: vendor.id,
        quantity: 30,
        madeInGhana: true,
        ghanaRegion: 'Central'
      },
      {
        name: 'Smartphone',
        description: 'Latest Android smartphone',
        shortDescription: 'Android smartphone',
        price: 1200.00,
        currency: 'GHS',
        categoryId: categories[0].id,
        vendorId: vendor.id,
        quantity: 10,
        madeInGhana: false
      }
    ]);

    console.log('📦 Creating orders...');
    const customer = users.find(u => u.role === 'user');
    await Order.bulkCreate([
      {
        orderNumber: 'ORD-2024-001',
        userId: customer.id,
        items: [
          {
            productId: products[0].id,
            quantity: 1,
            price: 250.00,
            productName: 'Authentic Kente Cloth'
          }
        ],
        status: 'delivered',
        paymentStatus: 'paid',
        paymentMethod: 'mobile_money',
        subtotal: 250.00,
        shippingCost: 15.00,
        total: 265.00,
        currency: 'GHS',
        shippingFirstName: 'Akosua',
        shippingLastName: 'Mensah',
        shippingPhone: '+233277654321',
        shippingEmail: 'akosua.mensah@yahoo.com',
        shippingCity: 'Accra',
        shippingRegion: 'Greater Accra'
      }
    ]);

    console.log('✅ Database seeding completed successfully!');
    console.log(`📊 Created: ${users.length} users, ${categories.length} categories, ${products.length} products, 1 order`);
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
