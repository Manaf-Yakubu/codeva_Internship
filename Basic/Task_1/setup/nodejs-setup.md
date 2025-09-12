# Node.js and npm/yarn Setup Guide

## 📦 Installing Node.js

### Method 1: Official Installer (Recommended)

1. **Download Node.js**
   - Visit [nodejs.org](https://nodejs.org/)
   - Download the LTS version (Long Term Support)
   - Choose the Windows Installer (.msi)

2. **Run the Installer**
   - Double-click the downloaded .msi file
   - Follow the installation wizard
   - ✅ Check "Automatically install the necessary tools" when prompted
   - This includes npm (Node Package Manager)

3. **Verify Installation**
   ```powershell
   # Check Node.js version
   node --version
   # Should output something like: v18.17.0
   
   # Check npm version
   npm --version
   # Should output something like: 9.6.7
   ```

### Method 2: Using Chocolatey (Alternative)

```powershell
# Install Chocolatey first (if not already installed)
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install Node.js via Chocolatey
choco install nodejs
```

### Method 3: Using Node Version Manager (nvm-windows)

```powershell
# Download and install nvm-windows from GitHub
# https://github.com/coreybutler/nvm-windows/releases

# After installation, restart PowerShell and run:
nvm install latest
nvm use latest
```

## 📦 Installing Yarn (Alternative Package Manager)

### Option 1: Using npm
```powershell
npm install -g yarn
```

### Option 2: Using Chocolatey
```powershell
choco install yarn
```

### Option 3: Using Scoop
```powershell
# Install Scoop first (if not already installed)
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex

# Install Yarn
scoop install yarn
```

## ⚙️ Configuration

### 1. Configure npm Registry (Optional)
```powershell
# Set npm registry (default is fine for most users)
npm config set registry https://registry.npmjs.org/

# Check current configuration
npm config list
```

### 2. Set Global Package Location (Optional)
```powershell
# Create a directory for global packages
mkdir C:\Users\%USERNAME%\npm-global

# Configure npm to use this directory
npm config set prefix 'C:\Users\%USERNAME%\npm-global'

# Add to PATH environment variable
# Add C:\Users\%USERNAME%\npm-global to your PATH
```

### 3. Configure Yarn (if using Yarn)
```powershell
# Check Yarn version
yarn --version

# Set global folder (optional)
yarn config set global-folder "C:\Users\%USERNAME%\yarn-global"
```

## 🔧 Essential Global Packages

Install these commonly used global packages:

```powershell
# Using npm
npm install -g nodemon          # Auto-restart server during development
npm install -g create-react-app # React application generator
npm install -g @vue/cli         # Vue.js CLI
npm install -g @angular/cli     # Angular CLI
npm install -g express-generator # Express.js generator
npm install -g typescript       # TypeScript compiler
npm install -g ts-node          # TypeScript execution engine

# Using yarn (alternative)
yarn global add nodemon
yarn global add create-react-app
yarn global add @vue/cli
yarn global add @angular/cli
yarn global add express-generator
yarn global add typescript
yarn global add ts-node
```

## 🧪 Testing Your Installation

Create a test project to verify everything works:

```powershell
# Create a test directory
mkdir nodejs-test
cd nodejs-test

# Initialize a new Node.js project
npm init -y

# Install a test package
npm install express

# Create a simple server
echo 'const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World! Node.js is working!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});' > server.js

# Run the server
node server.js
```

Visit `http://localhost:3000` in your browser to see "Hello World!"

## 🔍 Troubleshooting

### Common Issues:

1. **'node' is not recognized as an internal or external command**
   - Node.js is not in your PATH
   - Restart your terminal/PowerShell
   - Reinstall Node.js and ensure "Add to PATH" is checked

2. **Permission errors when installing global packages**
   ```powershell
   # Run PowerShell as Administrator, or configure npm prefix
   npm config set prefix 'C:\Users\%USERNAME%\AppData\Roaming\npm'
   ```

3. **Slow npm installs**
   ```powershell
   # Clear npm cache
   npm cache clean --force
   
   # Use a faster registry (optional)
   npm config set registry https://registry.npmmirror.com/
   ```

4. **Yarn command not found after installation**
   - Restart your terminal
   - Check if Yarn is in your PATH
   - Reinstall using a different method

## 📚 Next Steps

1. ✅ Verify Node.js and npm/yarn are working
2. 📖 Learn about package.json and dependency management
3. 🚀 Create your first Node.js project
4. 🔧 Set up your development workflow with nodemon
5. 📦 Explore the npm ecosystem

## 🔗 Useful Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [npm Documentation](https://docs.npmjs.com/)
- [Yarn Documentation](https://yarnpkg.com/getting-started)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
