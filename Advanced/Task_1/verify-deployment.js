const fs = require('fs');
const path = require('path');

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

class DeploymentVerifier {
  constructor() {
    this.checks = [];
    this.warnings = [];
    this.errors = [];
  }

  check(name, condition, message, isWarning = false) {
    const status = condition ? 'PASS' : 'FAIL';
    const color = condition ? 'green' : (isWarning ? 'yellow' : 'red');
    
    log(`${condition ? '✅' : (isWarning ? '⚠️' : '❌')} ${name}: ${status}`, color);
    
    if (!condition) {
      if (isWarning) {
        this.warnings.push({ name, message });
      } else {
        this.errors.push({ name, message });
      }
    }
    
    this.checks.push({ name, status, isWarning });
  }

  fileExists(filePath) {
    return fs.existsSync(filePath);
  }

  directoryExists(dirPath) {
    return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
  }

  hasContent(filePath, minSize = 10) {
    if (!this.fileExists(filePath)) return false;
    return fs.statSync(filePath).size > minSize;
  }

  verifyProjectStructure() {
    log('\n📁 Verifying Project Structure', 'blue');
    log('================================', 'blue');

    // Root files
    this.check('Package.json exists', this.fileExists('package.json'));
    this.check('README.md exists', this.fileExists('README.md'));
    this.check('Docker Compose exists', this.fileExists('docker-compose.yml'));
    this.check('Production Docker Compose exists', this.fileExists('docker-compose.prod.yml'));
    this.check('Deployment guide exists', this.fileExists('DEPLOYMENT.md'));

    // Server structure
    this.check('Server directory exists', this.directoryExists('server'));
    this.check('Server package.json exists', this.fileExists('server/package.json'));
    this.check('Server Dockerfile exists', this.fileExists('server/Dockerfile'));
    this.check('Server source directory exists', this.directoryExists('server/src'));

    // Client structure
    this.check('Client directory exists', this.directoryExists('client'));
    this.check('Client package.json exists', this.fileExists('client/package.json'));
    this.check('Client Dockerfile exists', this.fileExists('client/Dockerfile'));
    this.check('Client source directory exists', this.directoryExists('client/src'));
  }

  verifyEnvironmentFiles() {
    log('\n🔧 Verifying Environment Configuration', 'blue');
    log('======================================', 'blue');

    // Environment files
    this.check('Server .env exists', this.fileExists('server/.env'));
    this.check('Server .env.example exists', this.fileExists('server/.env.example'));
    this.check('Server .env.production exists', this.fileExists('server/.env.production'));
    this.check('Client .env exists', this.fileExists('client/.env'));
    this.check('Client .env.example exists', this.fileExists('client/.env.example'));
    this.check('Client .env.production exists', this.fileExists('client/.env.production'));

    // Check environment content
    if (this.fileExists('server/.env')) {
      const serverEnv = fs.readFileSync('server/.env', 'utf8');
      this.check('Server has database config', serverEnv.includes('DATABASE_URL'));
      this.check('Server has JWT secrets', serverEnv.includes('JWT_SECRET'));
      this.check('Server port is 5000', serverEnv.includes('PORT=5000'));
    }

    if (this.fileExists('client/.env')) {
      const clientEnv = fs.readFileSync('client/.env', 'utf8');
      this.check('Client has API URL', clientEnv.includes('VITE_API_URL'));
      this.check('Client API points to port 5000', clientEnv.includes('localhost:5000'));
    }
  }

  verifySourceCode() {
    log('\n💻 Verifying Source Code', 'blue');
    log('========================', 'blue');

    // Server source files
    this.check('Server index.js exists', this.fileExists('server/src/index.js'));
    this.check('Database config exists', this.fileExists('server/src/config/database.js'));
    this.check('Auth routes exist', this.fileExists('server/src/routes/auth.js'));
    this.check('User model exists', this.fileExists('server/src/models/User.js'));
    this.check('Migration script exists', this.fileExists('server/src/scripts/migrate.js'));
    this.check('Seed script exists', this.fileExists('server/src/scripts/seed.js'));

    // Client source files
    this.check('Client App.jsx exists', this.fileExists('client/src/App.jsx'));
    this.check('Client main.jsx exists', this.fileExists('client/src/main.jsx'));
    this.check('Auth context exists', this.fileExists('client/src/context/AuthContext.jsx'));
    this.check('API service exists', this.fileExists('client/src/services/api.js'));
  }

  verifyDeploymentFiles() {
    log('\n🚀 Verifying Deployment Files', 'blue');
    log('==============================', 'blue');

    this.check('Deployment script (.sh) exists', this.fileExists('deploy.sh'));
    this.check('Deployment script (.bat) exists', this.fileExists('deploy.bat'));
    this.check('Database setup script exists', this.fileExists('setup-database.js'));
    this.check('Application test script exists', this.fileExists('test-application.js'));
    this.check('PM2 ecosystem config exists', this.fileExists('ecosystem.config.js'));
    this.check('Dockerignore exists', this.fileExists('.dockerignore'));
    this.check('Nginx config exists', this.fileExists('nginx.conf'));
  }

  verifyPackageScripts() {
    log('\n📦 Verifying Package Scripts', 'blue');
    log('=============================', 'blue');

    if (this.fileExists('package.json')) {
      const rootPackage = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const scripts = rootPackage.scripts || {};
      
      this.check('Has dev script', 'dev' in scripts);
      this.check('Has install-all script', 'install-all' in scripts);
      this.check('Has build script', 'build' in scripts);
      this.check('Has start script', 'start' in scripts);
    }

    if (this.fileExists('server/package.json')) {
      const serverPackage = JSON.parse(fs.readFileSync('server/package.json', 'utf8'));
      const scripts = serverPackage.scripts || {};
      
      this.check('Server has start script', 'start' in scripts);
      this.check('Server has dev script', 'dev' in scripts);
      this.check('Server has migrate script', 'migrate' in scripts);
      this.check('Server has seed script', 'seed' in scripts);
    }

    if (this.fileExists('client/package.json')) {
      const clientPackage = JSON.parse(fs.readFileSync('client/package.json', 'utf8'));
      const scripts = clientPackage.scripts || {};
      
      this.check('Client has dev script', 'dev' in scripts);
      this.check('Client has build script', 'build' in scripts);
      this.check('Client has preview script', 'preview' in scripts);
    }
  }

  verifySecurityConfiguration() {
    log('\n🔒 Verifying Security Configuration', 'blue');
    log('===================================', 'blue');

    if (this.fileExists('server/.env.production')) {
      const prodEnv = fs.readFileSync('server/.env.production', 'utf8');
      
      this.check('Production JWT secret is secure', 
        !prodEnv.includes('your-super-secret-jwt-key-change-in-production'), 
        'Change default JWT secrets in production!', true);
      
      this.check('Production has NODE_ENV=production', 
        prodEnv.includes('NODE_ENV=production'));
      
      this.check('Production database URL is configured', 
        prodEnv.includes('DATABASE_URL=') && !prodEnv.includes('localhost'), 
        'Update production database URL', true);
    }

    if (this.fileExists('server/src/index.js')) {
      const serverCode = fs.readFileSync('server/src/index.js', 'utf8');
      this.check('CORS is configured', serverCode.includes('cors('));
      this.check('Helmet security is enabled', serverCode.includes('helmet('));
      this.check('Rate limiting is enabled', serverCode.includes('rateLimit'));
    }
  }

  generateReport() {
    log('\n📊 Deployment Readiness Report', 'blue');
    log('===============================', 'blue');

    const totalChecks = this.checks.length;
    const passed = this.checks.filter(c => c.status === 'PASS').length;
    const failed = this.checks.filter(c => c.status === 'FAIL' && !c.isWarning).length;
    const warnings = this.checks.filter(c => c.status === 'FAIL' && c.isWarning).length;

    log(`\nTotal Checks: ${totalChecks}`);
    log(`Passed: ${passed}`, 'green');
    log(`Failed: ${failed}`, failed > 0 ? 'red' : 'green');
    log(`Warnings: ${warnings}`, warnings > 0 ? 'yellow' : 'green');

    if (this.errors.length > 0) {
      log('\n❌ Critical Issues (Must Fix):', 'red');
      this.errors.forEach(error => {
        log(`  • ${error.name}: ${error.message}`, 'red');
      });
    }

    if (this.warnings.length > 0) {
      log('\n⚠️ Warnings (Recommended to Fix):', 'yellow');
      this.warnings.forEach(warning => {
        log(`  • ${warning.name}: ${warning.message}`, 'yellow');
      });
    }

    const readinessScore = Math.round((passed / totalChecks) * 100);
    log(`\n🎯 Deployment Readiness Score: ${readinessScore}%`, 
      readinessScore >= 90 ? 'green' : readinessScore >= 70 ? 'yellow' : 'red');

    if (readinessScore >= 90 && this.errors.length === 0) {
      log('\n🎉 Application is ready for deployment!', 'green');
      log('You can proceed with:', 'green');
      log('  • npm run dev (development)', 'blue');
      log('  • docker-compose up --build (containerized)', 'blue');
      log('  • ./deploy.sh production (production)', 'blue');
    } else if (this.errors.length > 0) {
      log('\n🚨 Critical issues found. Please fix them before deployment.', 'red');
    } else {
      log('\n⚠️ Some issues found. Consider fixing them for optimal deployment.', 'yellow');
    }

    return readinessScore >= 90 && this.errors.length === 0;
  }

  run() {
    log('🔍 CodeVA Deployment Verification', 'blue');
    log('==================================', 'blue');

    this.verifyProjectStructure();
    this.verifyEnvironmentFiles();
    this.verifySourceCode();
    this.verifyDeploymentFiles();
    this.verifyPackageScripts();
    this.verifySecurityConfiguration();

    return this.generateReport();
  }
}

const main = () => {
  const verifier = new DeploymentVerifier();
  const isReady = verifier.run();
  process.exit(isReady ? 0 : 1);
};

if (require.main === module) {
  main();
}

module.exports = DeploymentVerifier;
