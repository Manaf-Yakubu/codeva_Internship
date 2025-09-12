# Full-Stack Development Environment Setup Script for Windows
# Run this script in PowerShell as Administrator

Write-Host "🚀 Starting Full-Stack Development Environment Setup..." -ForegroundColor Green
Write-Host "This script will install Node.js, Git, VS Code, and configure your development environment." -ForegroundColor Yellow

# Check if running as Administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "❌ This script requires Administrator privileges. Please run PowerShell as Administrator." -ForegroundColor Red
    exit 1
}

# Function to check if a command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Install Chocolatey if not present
if (-not (Test-Command choco)) {
    Write-Host "📦 Installing Chocolatey package manager..." -ForegroundColor Blue
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    refreshenv
} else {
    Write-Host "✅ Chocolatey is already installed" -ForegroundColor Green
}

# Install Node.js
if (-not (Test-Command node)) {
    Write-Host "📦 Installing Node.js..." -ForegroundColor Blue
    choco install nodejs -y
    refreshenv
} else {
    Write-Host "✅ Node.js is already installed: $(node --version)" -ForegroundColor Green
}

# Install Git
if (-not (Test-Command git)) {
    Write-Host "📦 Installing Git..." -ForegroundColor Blue
    choco install git -y
    refreshenv
} else {
    Write-Host "✅ Git is already installed: $(git --version)" -ForegroundColor Green
}

# Install VS Code
if (-not (Test-Command code)) {
    Write-Host "📦 Installing Visual Studio Code..." -ForegroundColor Blue
    choco install vscode -y
    refreshenv
} else {
    Write-Host "✅ VS Code is already installed" -ForegroundColor Green
}

# Install Yarn (optional package manager)
if (-not (Test-Command yarn)) {
    Write-Host "📦 Installing Yarn..." -ForegroundColor Blue
    choco install yarn -y
    refreshenv
} else {
    Write-Host "✅ Yarn is already installed: $(yarn --version)" -ForegroundColor Green
}

# Install global npm packages
Write-Host "📦 Installing essential global npm packages..." -ForegroundColor Blue
$globalPackages = @(
    "nodemon",
    "create-react-app",
    "@vue/cli",
    "@angular/cli",
    "express-generator",
    "typescript",
    "ts-node",
    "eslint",
    "prettier"
)

foreach ($package in $globalPackages) {
    Write-Host "Installing $package..." -ForegroundColor Yellow
    npm install -g $package
}

# Install VS Code extensions
Write-Host "📦 Installing VS Code extensions..." -ForegroundColor Blue
$extensions = @(
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json",
    "dsznajder.es7-react-js-snippets",
    "octref.vetur",
    "Angular.ng-template",
    "mongodb.mongodb-vscode",
    "formulahendry.vscode-mysql",
    "ms-ossdata.vscode-postgresql",
    "eamodio.gitlens",
    "github.vscode-pull-request-github",
    "mhutchie.git-graph",
    "ms-vscode.vscode-live-server",
    "ritwickdey.liveserver",
    "ms-vscode-remote.remote-wsl",
    "ms-vscode.powershell"
)

foreach ($extension in $extensions) {
    Write-Host "Installing extension: $extension" -ForegroundColor Yellow
    code --install-extension $extension
}

# Configure Git (prompt for user input)
Write-Host "🔧 Configuring Git..." -ForegroundColor Blue
$gitName = Read-Host "Enter your full name for Git"
$gitEmail = Read-Host "Enter your email for Git"

if ($gitName -and $gitEmail) {
    git config --global user.name "$gitName"
    git config --global user.email "$gitEmail"
    git config --global init.defaultBranch main
    git config --global core.editor "code --wait"
    git config --global color.ui auto
    git config --global core.autocrlf true
    git config --global pull.rebase false
    
    Write-Host "✅ Git configured successfully" -ForegroundColor Green
} else {
    Write-Host "⚠️ Skipping Git configuration - you can configure it later" -ForegroundColor Yellow
}

# Create development directories
Write-Host "📁 Creating development directories..." -ForegroundColor Blue
$devPath = "$env:USERPROFILE\Development"
$projectDirs = @("Projects", "Learning", "Templates", "Tools")

if (-not (Test-Path $devPath)) {
    New-Item -ItemType Directory -Path $devPath -Force
}

foreach ($dir in $projectDirs) {
    $fullPath = Join-Path $devPath $dir
    if (-not (Test-Path $fullPath)) {
        New-Item -ItemType Directory -Path $fullPath -Force
        Write-Host "Created: $fullPath" -ForegroundColor Green
    }
}

# Copy configuration files
Write-Host "📋 Setting up configuration files..." -ForegroundColor Blue
$configSource = Join-Path $PSScriptRoot "..\config"
$vsCodeSettingsPath = "$env:APPDATA\Code\User"

if (Test-Path "$configSource\vscode-settings.json") {
    if (-not (Test-Path $vsCodeSettingsPath)) {
        New-Item -ItemType Directory -Path $vsCodeSettingsPath -Force
    }
    Copy-Item "$configSource\vscode-settings.json" "$vsCodeSettingsPath\settings.json" -Force
    Write-Host "✅ VS Code settings configured" -ForegroundColor Green
}

# Verify installations
Write-Host "🔍 Verifying installations..." -ForegroundColor Blue
Write-Host "Node.js: $(if (Test-Command node) { node --version } else { 'Not installed' })" -ForegroundColor $(if (Test-Command node) { 'Green' } else { 'Red' })
Write-Host "npm: $(if (Test-Command npm) { npm --version } else { 'Not installed' })" -ForegroundColor $(if (Test-Command npm) { 'Green' } else { 'Red' })
Write-Host "Yarn: $(if (Test-Command yarn) { yarn --version } else { 'Not installed' })" -ForegroundColor $(if (Test-Command yarn) { 'Green' } else { 'Red' })
Write-Host "Git: $(if (Test-Command git) { git --version } else { 'Not installed' })" -ForegroundColor $(if (Test-Command git) { 'Green' } else { 'Red' })
Write-Host "VS Code: $(if (Test-Command code) { 'Installed' } else { 'Not installed' })" -ForegroundColor $(if (Test-Command code) { 'Green' } else { 'Red' })

Write-Host ""
Write-Host "🎉 Setup completed!" -ForegroundColor Green
Write-Host "📚 Next steps:" -ForegroundColor Yellow
Write-Host "1. Restart your terminal/PowerShell" -ForegroundColor White
Write-Host "2. Run 'node --version' and 'git --version' to verify" -ForegroundColor White
Write-Host "3. Open VS Code and check if extensions are installed" -ForegroundColor White
Write-Host "4. Create your first project using the templates in this repository" -ForegroundColor White
Write-Host "5. Set up a database (MongoDB, MySQL, or PostgreSQL) using the guides in setup/" -ForegroundColor White
Write-Host ""
Write-Host "📖 Documentation available in the docs/ folder" -ForegroundColor Cyan
Write-Host "🚀 Happy coding!" -ForegroundColor Green
