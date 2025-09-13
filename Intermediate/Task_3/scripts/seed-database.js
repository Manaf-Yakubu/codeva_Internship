const { connectDB, syncDatabase } = require('../config/database');
const { User, Category, Product, Order } = require('../models');

const seedData = {
  users: [
    {
      firstName: 'Yakubu',
      lastName: 'Abdul Manaf',
      email: 'yakubu.manaf@codeva.com',
      password: 'CodeVa2024!',
      phone: '+233244123456',
      role: 'admin',
      addressStreet: '123 Independence Avenue',
      addressCity: 'Accra',
      addressRegion: 'Greater Accra',
      addressPostalCode: 'GA-123-4567',
      emailVerified: true,
      preferences: {
        currency: 'GHS',
        language: 'en',
        notifications: { email: true, sms: true, push: true }
      }
    },
    {
      firstName: 'Kwame',
      lastName: 'Asante',
      email: 'kwame.asante@gmail.com',
      password: 'Ghana2024!',
      phone: '+233501234567',
      role: 'vendor',
      addressStreet: '45 Kumasi Road',
      addressCity: 'Kumasi',
      addressRegion: 'Ashanti',
      addressPostalCode: 'AK-456-7890',
      emailVerified: true
    },
    {
      firstName: 'Akosua',
      lastName: 'Mensah',
      email: 'akosua.mensah@yahoo.com',
      password: 'Accra2024!',
      phone: '+233277654321',
      role: 'user',
      addressStreet: '78 Tema Station Road',
      addressCity: 'Accra',
      addressRegion: 'Greater Accra',
      addressPostalCode: 'GA-789-0123',
      emailVerified: true
    },
    {
      firstName: 'Kofi',
      lastName: 'Boateng',
      email: 'kofi.boateng@outlook.com',
      password: 'Tamale2024!',
      phone: '+233203456789',
      role: 'vendor',
      addressStreet: '12 Northern Highway',
      addressCity: 'Tamale',
      addressRegion: 'Northern',
      addressPostalCode: 'NR-234-5678',
      emailVerified: true
    }
  ],

  categories: [
    {
      name: 'Electronics',
      description: 'Electronic devices and gadgets',
      isGhanaSpecific: false,
      sortOrder: 1,
      metadata: {
        seoTitle: 'Electronics - Latest Gadgets and Devices',
        seoDescription: 'Shop the latest electronic devices and gadgets',
        keywords: ['electronics', 'gadgets', 'devices', 'technology']
      }
    },
    {
      name: 'Fashion & Clothing',
      description: 'Clothing, shoes, and fashion accessories',
      isGhanaSpecific: false,
      sortOrder: 2,
      metadata: {
        seoTitle: 'Fashion & Clothing - Latest Trends',
        seoDescription: 'Discover the latest fashion trends and clothing',
        keywords: ['fashion', 'clothing', 'shoes', 'accessories']
      }
    },
    {
      name: 'Kente & Traditional Wear',
      description: 'Authentic Ghanaian traditional clothing and accessories',
      isGhanaSpecific: true,
      ghanaRegions: ['Ashanti', 'Eastern', 'Volta'],
      sortOrder: 3,
      metadata: {
        seoTitle: 'Kente & Traditional Wear - Authentic Ghanaian Fashion',
        seoDescription: 'Shop authentic Ghanaian Kente cloth and traditional wear',
        keywords: ['kente', 'traditional', 'ghana', 'african', 'clothing']
      }
    },
    {
      name: 'Food & Beverages',
      description: 'Local and international food products',
      isGhanaSpecific: false,
      sortOrder: 4
    },
    {
      name: 'Ghanaian Spices & Foods',
      description: 'Authentic Ghanaian spices, palm oil, and local foods',
      isGhanaSpecific: true,
      ghanaRegions: ['Greater Accra', 'Ashanti', 'Northern', 'Central'],
      sortOrder: 5,
      metadata: {
        seoTitle: 'Ghanaian Spices & Foods - Authentic Local Products',
        seoDescription: 'Shop authentic Ghanaian spices, palm oil, and local foods',
        keywords: ['ghanaian', 'spices', 'palm oil', 'local food', 'africa']
      }
    },
    {
      name: 'Home & Garden',
      description: 'Home improvement and garden supplies',
      isGhanaSpecific: false,
      sortOrder: 6
    }
  ],

  products: [
    {
      name: 'Samsung Galaxy A54 5G',
      description: 'Latest Samsung smartphone with 5G connectivity, 128GB storage, and triple camera system. Perfect for staying connected in Ghana.',
      shortDescription: 'Samsung Galaxy A54 5G smartphone with 128GB storage',
      price: 2800.00,
      comparePrice: 3200.00,
      currency: 'GHS',
      images: [
        { url: 'https://via.placeholder.com/400x400?text=Galaxy+A54', alt: 'Samsung Galaxy A54', isPrimary: true },
        { url: 'https://via.placeholder.com/400x400?text=Galaxy+A54+Back', alt: 'Samsung Galaxy A54 Back', isPrimary: false }
      ],
      quantity: 25,
      lowStockThreshold: 5,
      specifications: [
        { name: 'Storage', value: '128GB' },
        { name: 'RAM', value: '6GB' },
        { name: 'Camera', value: '50MP Triple Camera' },
        { name: 'Battery', value: '5000mAh' }
      ],
      tags: ['smartphone', 'samsung', '5g', 'android'],
      isFeatured: true,
      madeInGhana: false,
      weight: { value: 0.2, unit: 'kg' },
      dimensions: { length: 15.8, width: 7.6, height: 0.8, unit: 'cm' }
    },
    {
      name: 'Authentic Kente Cloth - Ashanti Design',
      description: 'Handwoven authentic Kente cloth from Ashanti region. This beautiful traditional Ghanaian fabric features intricate patterns and vibrant colors, perfect for special occasions and cultural celebrations.',
      shortDescription: 'Handwoven authentic Kente cloth from Ashanti region',
      price: 450.00,
      comparePrice: 600.00,
      currency: 'GHS',
      images: [
        { url: 'https://via.placeholder.com/400x400?text=Kente+Cloth', alt: 'Authentic Kente Cloth', isPrimary: true },
        { url: 'https://via.placeholder.com/400x400?text=Kente+Detail', alt: 'Kente Pattern Detail', isPrimary: false }
      ],
      quantity: 15,
      lowStockThreshold: 3,
      specifications: [
        { name: 'Material', value: '100% Cotton' },
        { name: 'Size', value: '2m x 1.2m' },
        { name: 'Origin', value: 'Ashanti Region, Ghana' },
        { name: 'Weaving', value: 'Traditional Handwoven' }
      ],
      tags: ['kente', 'traditional', 'ghana', 'handwoven', 'ashanti'],
      isFeatured: true,
      madeInGhana: true,
      ghanaRegion: 'Ashanti',
      localLanguageName: {
        twi: 'Kente Ntoma',
        ga: 'Kente Cloth',
        ewe: 'Kente Avɔ',
        hausa: 'Kente Cloth'
      },
      weight: { value: 0.8, unit: 'kg' },
      dimensions: { length: 200, width: 120, height: 2, unit: 'cm' }
    },
    {
      name: 'Pure Ghanaian Palm Oil - 5 Liters',
      description: 'Premium quality pure palm oil from Ghana. Rich in vitamins and perfect for traditional Ghanaian cooking. Sourced directly from local farmers in the Central Region.',
      shortDescription: 'Premium quality pure Ghanaian palm oil',
      price: 85.00,
      currency: 'GHS',
      images: [
        { url: 'https://via.placeholder.com/400x400?text=Palm+Oil', alt: 'Ghanaian Palm Oil', isPrimary: true }
      ],
      quantity: 50,
      lowStockThreshold: 10,
      specifications: [
        { name: 'Volume', value: '5 Liters' },
        { name: 'Type', value: 'Pure Palm Oil' },
        { name: 'Origin', value: 'Central Region, Ghana' },
        { name: 'Processing', value: 'Traditional Method' }
      ],
      tags: ['palm oil', 'cooking', 'ghana', 'traditional', 'organic'],
      madeInGhana: true,
      ghanaRegion: 'Central',
      localLanguageName: {
        twi: 'Abe Ngo',
        ga: 'Palm Oil',
        ewe: 'Deɖe',
        hausa: 'Man Kwakwa'
      },
      weight: { value: 5.2, unit: 'kg' },
      dimensions: { length: 25, width: 15, height: 30, unit: 'cm' }
    },
    {
      name: 'Adinkra Symbol T-Shirt - Gye Nyame',
      description: 'Comfortable cotton t-shirt featuring the Gye Nyame Adinkra symbol, representing the supremacy of God. Made in Ghana with high-quality materials.',
      shortDescription: 'Cotton t-shirt with Gye Nyame Adinkra symbol',
      price: 45.00,
      comparePrice: 60.00,
      currency: 'GHS',
      images: [
        { url: 'https://via.placeholder.com/400x400?text=Adinkra+Tshirt', alt: 'Adinkra T-Shirt', isPrimary: true }
      ],
      quantity: 30,
      lowStockThreshold: 8,
      specifications: [
        { name: 'Material', value: '100% Cotton' },
        { name: 'Sizes', value: 'S, M, L, XL, XXL' },
        { name: 'Symbol', value: 'Gye Nyame' },
        { name: 'Print', value: 'Screen Print' }
      ],
      tags: ['adinkra', 'tshirt', 'ghana', 'cotton', 'gye nyame'],
      madeInGhana: true,
      ghanaRegion: 'Greater Accra',
      localLanguageName: {
        twi: 'Adinkra Shirt',
        ga: 'Adinkra Shirt',
        ewe: 'Adinkra Shirt',
        hausa: 'Adinkra Shirt'
      },
      weight: { value: 0.2, unit: 'kg' }
    }
  ]
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to database
    await connectDB();
    
    // Sync database (recreate tables)
    await syncDatabase(true);
    console.log('✅ Database tables created');

    // Seed Users
    console.log('👥 Seeding users...');
    const createdUsers = [];
    for (const userData of seedData.users) {
      const user = await User.create(userData);
      createdUsers.push(user);
      console.log(`   ✓ Created user: ${user.firstName} ${user.lastName} (${user.role})`);
    }

    // Seed Categories
    console.log('📂 Seeding categories...');
    const createdCategories = [];
    for (const categoryData of seedData.categories) {
      const category = await Category.create(categoryData);
      createdCategories.push(category);
      console.log(`   ✓ Created category: ${category.name}`);
    }

    // Seed Products
    console.log('📦 Seeding products...');
    const vendors = createdUsers.filter(user => ['vendor', 'admin'].includes(user.role));
    
    for (let i = 0; i < seedData.products.length; i++) {
      const productData = seedData.products[i];
      
      // Assign category based on product type
      let categoryId;
      if (productData.name.includes('Galaxy')) {
        categoryId = createdCategories.find(c => c.name === 'Electronics').id;
      } else if (productData.name.includes('Kente')) {
        categoryId = createdCategories.find(c => c.name === 'Kente & Traditional Wear').id;
      } else if (productData.name.includes('Palm Oil')) {
        categoryId = createdCategories.find(c => c.name === 'Ghanaian Spices & Foods').id;
      } else if (productData.name.includes('T-Shirt')) {
        categoryId = createdCategories.find(c => c.name === 'Fashion & Clothing').id;
      } else {
        categoryId = createdCategories[0].id; // Default to first category
      }
      
      // Assign vendor (rotate between available vendors)
      const vendorId = vendors[i % vendors.length].id;
      
      const product = await Product.create({
        ...productData,
        categoryId,
        vendorId
      });
      
      console.log(`   ✓ Created product: ${product.name} (${product.currency} ${product.price})`);
    }

    // Create sample orders
    console.log('🛒 Creating sample orders...');
    const customers = createdUsers.filter(user => ['user', 'admin'].includes(user.role));
    const products = await Product.findAll();
    
    for (let i = 0; i < 3; i++) {
      const customer = customers[i % customers.length];
      const orderProducts = products.slice(i, i + 2); // Take 2 products per order
      
      const items = orderProducts.map(product => ({
        productId: product.id,
        quantity: Math.floor(Math.random() * 3) + 1,
        price: parseFloat(product.price),
        total: 0 // Will be calculated in hook
      }));
      
      const orderData = {
        userId: customer.id,
        items,
        paymentMethod: ['mobile_money', 'card', 'cash'][i % 3],
        shippingFirstName: customer.firstName,
        shippingLastName: customer.lastName,
        shippingPhone: customer.phone,
        shippingEmail: customer.email,
        shippingStreet: customer.addressStreet || '123 Sample Street',
        shippingCity: customer.addressCity || 'Accra',
        shippingRegion: customer.addressRegion || 'Greater Accra',
        shippingPostalCode: customer.addressPostalCode || 'GA-123-456',
        shippingMethod: {
          name: 'Standard Delivery',
          cost: 25,
          estimatedDays: 3
        },
        status: ['pending', 'confirmed', 'delivered'][i % 3],
        paymentStatus: ['pending', 'paid', 'paid'][i % 3]
      };
      
      const order = await Order.create(orderData);
      console.log(`   ✓ Created order: ${order.orderNumber} for ${customer.firstName} ${customer.lastName}`);
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Seeding Summary:');
    console.log(`   👥 Users: ${createdUsers.length}`);
    console.log(`   📂 Categories: ${createdCategories.length}`);
    console.log(`   📦 Products: ${seedData.products.length}`);
    console.log(`   🛒 Orders: 3`);
    
    console.log('\n🔑 Admin Login:');
    console.log('   Email: yakubu.manaf@codeva.com');
    console.log('   Password: CodeVa2024!');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, seedData };
