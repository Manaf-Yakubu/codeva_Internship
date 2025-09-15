const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login with admin credentials...');
    
    const response = await axios.post('http://localhost:5001/api/auth/login', {
      email: 'admin@codeva.com',
      password: 'Admin123!'
    });
    
    console.log('✅ Login successful!');
    console.log('Response:', response.data);
    
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

testLogin();
