const axios = require('axios');

async function testLoginAPI() {
  try {
    console.log('🔐 Testing login with admin credentials...');
    
    const response = await axios.post('http://localhost:5001/api/auth/login', {
      email: 'admin@codeva.com',
      password: 'Admin123!'
    });
    
    console.log('✅ Login successful!');
    console.log('User:', response.data.data.user);
    console.log('Token received:', !!response.data.data.accessToken);
    
    // Test user login
    console.log('\n👤 Testing user credentials...');
    const userResponse = await axios.post('http://localhost:5001/api/auth/login', {
      email: 'user@codeva.com', 
      password: 'User123!'
    });
    
    console.log('✅ User login successful!');
    console.log('User:', userResponse.data.data.user);
    
  } catch (error) {
    console.log('❌ Login failed:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Message:', error.response.data.message);
    } else {
      console.log('Error:', error.message);
    }
  }
}

testLoginAPI();
