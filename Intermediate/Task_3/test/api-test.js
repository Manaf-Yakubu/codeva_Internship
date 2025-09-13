const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

// Test data
const testData = {
  user: {
    firstName: 'Test',
    lastName: 'User',
    email: 'test.user@example.com',
    password: 'TestPassword123!',
    phone: '+233244567890',
    addressCity: 'Accra',
    addressRegion: 'Greater Accra'
  },
  category: {
    name: 'Test Category',
    description: 'A test category for API testing',
    isGhanaSpecific: true,
    ghanaRegions: ['Greater Accra']
  },
  product: {
    name: 'Test Product',
    description: 'A test product for API testing with comprehensive details',
    shortDescription: 'Test product for API testing',
    price: 99.99,
    comparePrice: 129.99,
    currency: 'GHS',
    quantity: 50,
    lowStockThreshold: 10,
    images: [
      { url: 'https://via.placeholder.com/400x400?text=Test+Product', alt: 'Test Product', isPrimary: true }
    ],
    specifications: [
      { name: 'Material', value: 'Test Material' },
      { name: 'Size', value: 'Medium' }
    ],
    tags: ['test', 'api', 'product'],
    madeInGhana: true,
    ghanaRegion: 'Greater Accra'
  },
  order: {
    items: [
      {
        quantity: 2,
        price: 99.99
      }
    ],
    paymentMethod: 'mobile_money',
    shippingFirstName: 'Test',
    shippingLastName: 'Customer',
    shippingPhone: '+233244567890',
    shippingEmail: 'test.customer@example.com',
    shippingStreet: '123 Test Street',
    shippingCity: 'Accra',
    shippingRegion: 'Greater Accra',
    shippingPostalCode: 'GA-123-456',
    shippingMethod: {
      name: 'Standard Delivery',
      cost: 25,
      estimatedDays: 3
    }
  }
};

// Store created IDs for cleanup
const createdIds = {
  users: [],
  categories: [],
  products: [],
  orders: []
};

// Helper functions
const makeRequest = async (method, endpoint, data = null) => {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: { 'Content-Type': 'application/json' }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || error.message, 
      status: error.response?.status 
    };
  }
};

const logTest = (testName, success, details = '') => {
  const status = success ? '✅' : '❌';
  console.log(`${status} ${testName} ${details}`);
};

const runTests = async () => {
  console.log('🧪 Starting API Tests for CodeVa Task 3: Database Integration\n');
  
  let testsPassed = 0;
  let testsTotal = 0;

  // Test 1: Health Check
  testsTotal++;
  console.log('1️⃣ Testing Health Check...');
  const healthCheck = await makeRequest('GET', '/health');
  if (healthCheck.success && healthCheck.data.success) {
    logTest('Health Check', true, '- Server is running');
    testsPassed++;
  } else {
    logTest('Health Check', false, '- Server not responding');
  }

  // Test 2: Welcome Endpoint
  testsTotal++;
  console.log('\n2️⃣ Testing Welcome Endpoint...');
  const welcome = await makeRequest('GET', '/');
  if (welcome.success && welcome.data.success) {
    logTest('Welcome Endpoint', true, '- API information retrieved');
    testsPassed++;
  } else {
    logTest('Welcome Endpoint', false, '- Failed to get API info');
  }

  // Test 3: User CRUD Operations
  console.log('\n3️⃣ Testing User CRUD Operations...');
  
  // Create User
  testsTotal++;
  const createUser = await makeRequest('POST', '/api/users', testData.user);
  if (createUser.success && createUser.data.success) {
    createdIds.users.push(createUser.data.data.id);
    logTest('Create User', true, `- User ID: ${createUser.data.data.id}`);
    testsPassed++;
  } else {
    logTest('Create User', false, `- ${createUser.error?.message || 'Unknown error'}`);
  }

  // Get Users
  testsTotal++;
  const getUsers = await makeRequest('GET', '/api/users');
  if (getUsers.success && getUsers.data.success) {
    logTest('Get Users', true, `- Found ${getUsers.data.data.users.length} users`);
    testsPassed++;
  } else {
    logTest('Get Users', false, '- Failed to retrieve users');
  }

  // Get User Stats
  testsTotal++;
  const getUserStats = await makeRequest('GET', '/api/users/stats');
  if (getUserStats.success && getUserStats.data.success) {
    logTest('Get User Stats', true, `- Total users: ${getUserStats.data.data.totalUsers}`);
    testsPassed++;
  } else {
    logTest('Get User Stats', false, '- Failed to get user statistics');
  }

  // Test 4: Category CRUD Operations
  console.log('\n4️⃣ Testing Category CRUD Operations...');
  
  // Create Category
  testsTotal++;
  const createCategory = await makeRequest('POST', '/api/categories', testData.category);
  if (createCategory.success && createCategory.data.success) {
    createdIds.categories.push(createCategory.data.data.id);
    logTest('Create Category', true, `- Category ID: ${createCategory.data.data.id}`);
    testsPassed++;
  } else {
    logTest('Create Category', false, `- ${createCategory.error?.message || 'Unknown error'}`);
  }

  // Get Categories
  testsTotal++;
  const getCategories = await makeRequest('GET', '/api/categories');
  if (getCategories.success && getCategories.data.success) {
    logTest('Get Categories', true, `- Found ${getCategories.data.data.categories.length} categories`);
    testsPassed++;
  } else {
    logTest('Get Categories', false, '- Failed to retrieve categories');
  }

  // Get Category Tree
  testsTotal++;
  const getCategoryTree = await makeRequest('GET', '/api/categories/tree');
  if (getCategoryTree.success && getCategoryTree.data.success) {
    logTest('Get Category Tree', true, `- Tree structure retrieved`);
    testsPassed++;
  } else {
    logTest('Get Category Tree', false, '- Failed to get category tree');
  }

  // Get Ghana Categories
  testsTotal++;
  const getGhanaCategories = await makeRequest('GET', '/api/categories/ghana');
  if (getGhanaCategories.success && getGhanaCategories.data.success) {
    logTest('Get Ghana Categories', true, `- Found ${getGhanaCategories.data.data.length} Ghana-specific categories`);
    testsPassed++;
  } else {
    logTest('Get Ghana Categories', false, '- Failed to get Ghana categories');
  }

  // Test 5: Product CRUD Operations
  console.log('\n5️⃣ Testing Product CRUD Operations...');
  
  // Create Product (need category and user IDs)
  testsTotal++;
  if (createdIds.categories.length > 0 && createdIds.users.length > 0) {
    const productData = {
      ...testData.product,
      categoryId: createdIds.categories[0],
      vendorId: createdIds.users[0]
    };
    
    const createProduct = await makeRequest('POST', '/api/products', productData);
    if (createProduct.success && createProduct.data.success) {
      createdIds.products.push(createProduct.data.data.id);
      logTest('Create Product', true, `- Product ID: ${createProduct.data.data.id}`);
      testsPassed++;
    } else {
      logTest('Create Product', false, `- ${createProduct.error?.message || 'Unknown error'}`);
    }
  } else {
    logTest('Create Product', false, '- Missing required category or user');
  }

  // Get Products
  testsTotal++;
  const getProducts = await makeRequest('GET', '/api/products');
  if (getProducts.success && getProducts.data.success) {
    logTest('Get Products', true, `- Found ${getProducts.data.data.products.length} products`);
    testsPassed++;
  } else {
    logTest('Get Products', false, '- Failed to retrieve products');
  }

  // Get Featured Products
  testsTotal++;
  const getFeaturedProducts = await makeRequest('GET', '/api/products/featured');
  if (getFeaturedProducts.success && getFeaturedProducts.data.success) {
    logTest('Get Featured Products', true, `- Found ${getFeaturedProducts.data.data.length} featured products`);
    testsPassed++;
  } else {
    logTest('Get Featured Products', false, '- Failed to get featured products');
  }

  // Get Ghana-made Products
  testsTotal++;
  const getGhanaMadeProducts = await makeRequest('GET', '/api/products/ghana-made');
  if (getGhanaMadeProducts.success && getGhanaMadeProducts.data.success) {
    logTest('Get Ghana-made Products', true, `- Found ${getGhanaMadeProducts.data.data.length} Ghana-made products`);
    testsPassed++;
  } else {
    logTest('Get Ghana-made Products', false, '- Failed to get Ghana-made products');
  }

  // Search Products
  testsTotal++;
  const searchProducts = await makeRequest('GET', '/api/products/search?q=test');
  if (searchProducts.success && searchProducts.data.success) {
    logTest('Search Products', true, `- Search completed`);
    testsPassed++;
  } else {
    logTest('Search Products', false, '- Search failed');
  }

  // Test 6: Order CRUD Operations
  console.log('\n6️⃣ Testing Order CRUD Operations...');
  
  // Create Order (need user and product IDs)
  testsTotal++;
  if (createdIds.users.length > 0 && createdIds.products.length > 0) {
    const orderData = {
      ...testData.order,
      userId: createdIds.users[0],
      items: [{
        ...testData.order.items[0],
        productId: createdIds.products[0]
      }]
    };
    
    const createOrder = await makeRequest('POST', '/api/orders', orderData);
    if (createOrder.success && createOrder.data.success) {
      createdIds.orders.push(createOrder.data.data.id);
      logTest('Create Order', true, `- Order ID: ${createOrder.data.data.id}`);
      testsPassed++;
    } else {
      logTest('Create Order', false, `- ${createOrder.error?.message || 'Unknown error'}`);
    }
  } else {
    logTest('Create Order', false, '- Missing required user or product');
  }

  // Get Orders
  testsTotal++;
  const getOrders = await makeRequest('GET', '/api/orders');
  if (getOrders.success && getOrders.data.success) {
    logTest('Get Orders', true, `- Found ${getOrders.data.data.orders.length} orders`);
    testsPassed++;
  } else {
    logTest('Get Orders', false, '- Failed to retrieve orders');
  }

  // Get Order Stats
  testsTotal++;
  const getOrderStats = await makeRequest('GET', '/api/orders/stats');
  if (getOrderStats.success && getOrderStats.data.success) {
    logTest('Get Order Stats', true, `- Statistics retrieved`);
    testsPassed++;
  } else {
    logTest('Get Order Stats', false, '- Failed to get order statistics');
  }

  // Get Orders by Region
  testsTotal++;
  const getOrdersByRegion = await makeRequest('GET', '/api/orders/regions');
  if (getOrdersByRegion.success && getOrdersByRegion.data.success) {
    logTest('Get Orders by Region', true, `- Regional data retrieved`);
    testsPassed++;
  } else {
    logTest('Get Orders by Region', false, '- Failed to get regional data');
  }

  // Test 7: Error Handling
  console.log('\n7️⃣ Testing Error Handling...');
  
  // Test 404 for non-existent resource
  testsTotal++;
  const test404 = await makeRequest('GET', '/api/users/00000000-0000-0000-0000-000000000000');
  if (!test404.success && test404.status === 404) {
    logTest('404 Error Handling', true, '- Properly returns 404 for non-existent resource');
    testsPassed++;
  } else {
    logTest('404 Error Handling', false, '- Does not handle 404 properly');
  }

  // Test validation error
  testsTotal++;
  const testValidation = await makeRequest('POST', '/api/users', { email: 'invalid-email' });
  if (!testValidation.success && testValidation.status === 400) {
    logTest('Validation Error Handling', true, '- Properly validates input data');
    testsPassed++;
  } else {
    logTest('Validation Error Handling', false, '- Does not validate input properly');
  }

  // Test Results Summary
  console.log('\n📊 Test Results Summary');
  console.log('═'.repeat(50));
  console.log(`Total Tests: ${testsTotal}`);
  console.log(`Passed: ${testsPassed}`);
  console.log(`Failed: ${testsTotal - testsPassed}`);
  console.log(`Success Rate: ${Math.round((testsPassed / testsTotal) * 100)}%`);
  
  if (testsPassed === testsTotal) {
    console.log('\n🎉 All tests passed! The API is working correctly.');
  } else {
    console.log('\n⚠️ Some tests failed. Please check the implementation.');
  }

  console.log('\n🧹 Cleanup: Test data will remain in database for inspection.');
  console.log('   Run the seed script again to reset the database if needed.');
  
  process.exit(testsPassed === testsTotal ? 0 : 1);
};

// Run tests if called directly
if (require.main === module) {
  console.log('🚀 Make sure the server is running on http://localhost:5000');
  console.log('   Run: npm start (in another terminal)\n');
  
  setTimeout(() => {
    runTests().catch(error => {
      console.error('❌ Test execution failed:', error.message);
      process.exit(1);
    });
  }, 2000); // Wait 2 seconds for server to be ready
}

module.exports = { runTests, testData };
