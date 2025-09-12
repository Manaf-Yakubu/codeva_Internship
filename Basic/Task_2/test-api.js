// Simple test script to demonstrate API functionality
// Run this after starting the server with: node test-api.js

const baseUrl = 'http://localhost:3001';

// Test data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  age: 25
};

const updatedUser = {
  name: 'Updated Test User',
  email: 'updated@example.com',
  age: 26
};

console.log('🧪 API Test Script');
console.log('==================');
console.log('Make sure the server is running on http://localhost:3000');
console.log('You can test these endpoints manually with Postman or Thunder Client:');
console.log('');

console.log('1. Health Check:');
console.log(`   GET ${baseUrl}/health`);
console.log('');

console.log('2. Get All Users:');
console.log(`   GET ${baseUrl}/api/users`);
console.log('');

console.log('3. Get User by ID:');
console.log(`   GET ${baseUrl}/api/users/1`);
console.log('');

console.log('4. Create New User:');
console.log(`   POST ${baseUrl}/api/users`);
console.log('   Body:', JSON.stringify(testUser, null, 2));
console.log('');

console.log('5. Update User:');
console.log(`   PUT ${baseUrl}/api/users/1`);
console.log('   Body:', JSON.stringify(updatedUser, null, 2));
console.log('');

console.log('6. Delete User:');
console.log(`   DELETE ${baseUrl}/api/users/1`);
console.log('');

console.log('📝 cURL Examples:');
console.log('================');
console.log('');
console.log('# Get all users');
console.log(`curl -X GET ${baseUrl}/api/users`);
console.log('');
console.log('# Create user');
console.log(`curl -X POST ${baseUrl}/api/users \\`);
console.log('  -H "Content-Type: application/json" \\');
console.log(`  -d '${JSON.stringify(testUser)}'`);
console.log('');
console.log('# Update user (replace :id with actual ID)');
console.log(`curl -X PUT ${baseUrl}/api/users/1 \\`);
console.log('  -H "Content-Type: application/json" \\');
console.log(`  -d '${JSON.stringify(updatedUser)}'`);
console.log('');
console.log('# Delete user (replace :id with actual ID)');
console.log(`curl -X DELETE ${baseUrl}/api/users/1`);
