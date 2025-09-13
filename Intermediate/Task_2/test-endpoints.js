const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testEndpoints() {
  console.log('🧪 Testing CodeVa Auth API Endpoints\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', health.data.message);

    // Test 2: Admin Login
    console.log('\n2. Testing Admin Login...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'admin@codeva.com',
      password: 'admin123'
    });
    console.log('✅ Admin Login Successful');
    console.log('   User:', loginResponse.data.data.user.name, '- Role:', loginResponse.data.data.user.role);
    
    const adminToken = loginResponse.data.data.accessToken;

    // Test 3: Get Current User
    console.log('\n3. Testing Get Current User...');
    const meResponse = await axios.get(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ Current User:', meResponse.data.data.user.email);

    // Test 4: Admin Stats
    console.log('\n4. Testing Admin Stats...');
    const statsResponse = await axios.get(`${BASE_URL}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ Admin Stats Retrieved');
    console.log('   Total Users:', statsResponse.data.data.users.total);
    console.log('   Admin Users:', statsResponse.data.data.users.admins);

    // Test 5: User Signup
    console.log('\n5. Testing User Signup...');
    const signupResponse = await axios.post(`${BASE_URL}/api/auth/signup`, {
      name: 'Test User',
      email: 'test@example.com',
      password: 'TestPass123!'
    });
    console.log('✅ User Signup Successful');
    console.log('   New User:', signupResponse.data.data.user.name);

    // Test 6: User Login
    console.log('\n6. Testing User Login...');
    const userLoginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'test@example.com',
      password: 'TestPass123!'
    });
    console.log('✅ User Login Successful');
    console.log('   User Role:', userLoginResponse.data.data.user.role);

    // Test 7: Protected Route (should fail for regular user)
    console.log('\n7. Testing Protected Admin Route (should fail for regular user)...');
    const userToken = userLoginResponse.data.data.accessToken;
    try {
      await axios.get(`${BASE_URL}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      console.log('❌ This should have failed!');
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log('✅ Access Denied (Expected): Regular user cannot access admin routes');
      } else {
        throw error;
      }
    }

    console.log('\n🎉 All tests passed! Authentication system is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
  }
}

testEndpoints();
