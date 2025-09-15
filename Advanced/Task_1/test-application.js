const axios = require('axios');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ApplicationTester {
  constructor() {
    this.baseURL = 'http://localhost:5000';
    this.frontendURL = 'http://localhost:3000';
    this.testResults = [];
  }

  async runTest(name, testFn) {
    try {
      log(`🧪 Testing: ${name}`, 'blue');
      await testFn();
      log(`✅ ${name} - PASSED`, 'green');
      this.testResults.push({ name, status: 'PASSED' });
    } catch (error) {
      log(`❌ ${name} - FAILED: ${error.message}`, 'red');
      this.testResults.push({ name, status: 'FAILED', error: error.message });
    }
  }

  async testHealthEndpoint() {
    const response = await axios.get(`${this.baseURL}/health`);
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }
    if (!response.data.status || response.data.status !== 'OK') {
      throw new Error('Health check returned invalid status');
    }
  }

  async testAuthEndpoints() {
    // Test registration
    const registerData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'TestPassword123!'
    };

    try {
      await axios.post(`${this.baseURL}/api/auth/register`, registerData);
    } catch (error) {
      if (error.response?.status !== 400) { // User might already exist
        throw error;
      }
    }

    // Test login
    const loginData = {
      email: 'test@example.com',
      password: 'TestPassword123!'
    };

    const loginResponse = await axios.post(`${this.baseURL}/api/auth/login`, loginData);
    if (loginResponse.status !== 200) {
      throw new Error(`Login failed with status ${loginResponse.status}`);
    }

    const token = loginResponse.data.token;
    if (!token) {
      throw new Error('No token received from login');
    }

    // Test protected route
    const meResponse = await axios.get(`${this.baseURL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (meResponse.status !== 200) {
      throw new Error(`Protected route failed with status ${meResponse.status}`);
    }
  }

  async testDatabaseConnection() {
    // This will be tested indirectly through API calls
    await this.testAuthEndpoints();
  }

  async testFrontendAccess() {
    const response = await axios.get(this.frontendURL);
    if (response.status !== 200) {
      throw new Error(`Frontend not accessible, status: ${response.status}`);
    }
  }

  async testAPIRoutes() {
    const routes = [
      '/health',
      '/api/auth/me', // This will fail without auth, but should return 401, not 500
    ];

    for (const route of routes) {
      try {
        await axios.get(`${this.baseURL}${route}`);
      } catch (error) {
        if (route === '/api/auth/me' && error.response?.status === 401) {
          // Expected behavior for protected route without token
          continue;
        }
        if (error.response?.status >= 500) {
          throw new Error(`Server error on ${route}: ${error.response.status}`);
        }
      }
    }
  }

  async runAllTests() {
    log('🚀 Starting Application Tests', 'blue');
    log('==============================', 'blue');

    await this.runTest('Health Endpoint', () => this.testHealthEndpoint());
    await this.runTest('API Routes', () => this.testAPIRoutes());
    await this.runTest('Database Connection', () => this.testDatabaseConnection());
    await this.runTest('Frontend Access', () => this.testFrontendAccess());

    // Print summary
    log('\n📊 Test Results Summary', 'blue');
    log('=======================', 'blue');

    const passed = this.testResults.filter(r => r.status === 'PASSED').length;
    const failed = this.testResults.filter(r => r.status === 'FAILED').length;

    this.testResults.forEach(result => {
      const color = result.status === 'PASSED' ? 'green' : 'red';
      log(`${result.status}: ${result.name}`, color);
      if (result.error) {
        log(`  Error: ${result.error}`, 'red');
      }
    });

    log(`\nTotal: ${this.testResults.length} | Passed: ${passed} | Failed: ${failed}`, 'blue');

    if (failed === 0) {
      log('🎉 All tests passed! Application is ready for deployment.', 'green');
    } else {
      log('❌ Some tests failed. Please check the errors above.', 'red');
    }

    return failed === 0;
  }
}

const main = async () => {
  const tester = new ApplicationTester();
  
  // Wait a bit for servers to be ready
  log('⏳ Waiting for servers to be ready...', 'yellow');
  await sleep(5000);

  const success = await tester.runAllTests();
  process.exit(success ? 0 : 1);
};

if (require.main === module) {
  main().catch(error => {
    log(`❌ Test runner failed: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = ApplicationTester;
