# Development Environment Verification Script
# This script checks if all required tools are properly installed

Write-Host "🔍 Verifying Full-Stack Development Environment..." -ForegroundColor Green
Write-Host "=" * 50 -ForegroundColor Gray

$allGood = $true

# Function to check if a command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Function to display check result
function Show-CheckResult($name, $condition, $version = "", $recommendation = "") {
    if ($condition) {
        Write-Host "✅ $name" -ForegroundColor Green
        if ($version) {
            Write-Host "   Version: $version" -ForegroundColor Gray
        }
    } else {
        Write-Host "❌ $name" -ForegroundColor Red
        if ($recommendation) {
            Write-Host "   💡 $recommendation" -ForegroundColor Yellow
        }
        $script:allGood = $false
    }
}

Write-Host "`n🔧 Core Tools:" -ForegroundColor Cyan

# Check Node.js
$nodeInstalled = Test-Command node
$nodeVersion = if ($nodeInstalled) { node --version } else { "" }
Show-CheckResult "Node.js" $nodeInstalled $nodeVersion "Install from nodejs.org or run setup-windows.ps1"

# Check npm
$npmInstalled = Test-Command npm
$npmVersion = if ($npmInstalled) { npm --version } else { "" }
Show-CheckResult "npm" $npmInstalled $npmVersion "Comes with Node.js installation"

# Check Yarn (optional)
$yarnInstalled = Test-Command yarn
$yarnVersion = if ($yarnInstalled) { yarn --version } else { "" }
Show-CheckResult "Yarn (optional)" $yarnInstalled $yarnVersion "Install with: npm install -g yarn"

# Check Git
$gitInstalled = Test-Command git
$gitVersion = if ($gitInstalled) { (git --version).Split(' ')[2] } else { "" }
Show-CheckResult "Git" $gitInstalled $gitVersion "Install from git-scm.com or run setup-windows.ps1"

# Check VS Code
$codeInstalled = Test-Command code
Show-CheckResult "VS Code" $codeInstalled "" "Install from code.visualstudio.com"

Write-Host "`n🌐 Global npm Packages:" -ForegroundColor Cyan

$globalPackages = @(
    @{name="nodemon"; command="nodemon"; description="Auto-restart server during development"},
    @{name="create-react-app"; command="create-react-app"; description="React application generator"},
    @{name="typescript"; command="tsc"; description="TypeScript compiler"},
    @{name="eslint"; command="eslint"; description="JavaScript linter"},
    @{name="prettier"; command="prettier"; description="Code formatter"}
)

foreach ($package in $globalPackages) {
    $installed = Test-Command $package.command
    Show-CheckResult $package.name $installed "" "Install with: npm install -g $($package.name)"
}

Write-Host "`n🔧 Git Configuration:" -ForegroundColor Cyan

try {
    $gitName = git config --global user.name 2>$null
    $gitEmail = git config --global user.email 2>$null
    
    Show-CheckResult "Git user.name" ($gitName -ne $null -and $gitName -ne "") $gitName "Set with: git config --global user.name 'Your Name'"
    Show-CheckResult "Git user.email" ($gitEmail -ne $null -and $gitEmail -ne "") $gitEmail "Set with: git config --global user.email 'your@email.com'"
} catch {
    Show-CheckResult "Git Configuration" $false "" "Configure Git with your name and email"
}

Write-Host "`n💾 Database Tools (Optional):" -ForegroundColor Cyan

# Check MongoDB
$mongoInstalled = Test-Command mongosh
Show-CheckResult "MongoDB Shell (mongosh)" $mongoInstalled "" "Install MongoDB Community Server"

# Check MySQL
$mysqlInstalled = Test-Command mysql
Show-CheckResult "MySQL Client" $mysqlInstalled "" "Install MySQL Server or MySQL Workbench"

# Check PostgreSQL
$psqlInstalled = Test-Command psql
Show-CheckResult "PostgreSQL Client (psql)" $psqlInstalled "" "Install PostgreSQL"

Write-Host "`n🔌 VS Code Extensions:" -ForegroundColor Cyan

if ($codeInstalled) {
    $extensions = @(
        "ms-vscode.vscode-typescript-next",
        "esbenp.prettier-vscode",
        "ms-vscode.vscode-eslint",
        "eamodio.gitlens"
    )
    
    try {
        $installedExtensions = code --list-extensions 2>$null
        foreach ($ext in $extensions) {
            $installed = $installedExtensions -contains $ext
            $name = $ext.Split('.')[-1]
            Show-CheckResult "Extension: $name" $installed "" "Install with: code --install-extension $ext"
        }
    } catch {
        Write-Host "⚠️ Could not check VS Code extensions" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️ VS Code not installed - skipping extension check" -ForegroundColor Yellow
}

Write-Host "`n📁 Development Directories:" -ForegroundColor Cyan

$devPath = "$env:USERPROFILE\Development"
$projectDirs = @("Projects", "Learning", "Templates", "Tools")

Show-CheckResult "Development folder" (Test-Path $devPath) $devPath "Create with: mkdir $devPath"

foreach ($dir in $projectDirs) {
    $fullPath = Join-Path $devPath $dir
    $exists = Test-Path $fullPath
    Show-CheckResult "$dir folder" $exists $fullPath "Create with: mkdir '$fullPath'"
}

Write-Host "`n🧪 Quick Functionality Test:" -ForegroundColor Cyan

if ($nodeInstalled -and $npmInstalled) {
    try {
        # Test npm list
        $npmList = npm list -g --depth=0 2>$null
        Show-CheckResult "npm global packages accessible" ($npmList -ne $null) "" "Check npm installation"
        
        # Test Node.js execution
        $nodeTest = node -e "console.log('Node.js working')" 2>$null
        Show-CheckResult "Node.js execution" ($nodeTest -eq "Node.js working") "" "Reinstall Node.js"
    } catch {
        Show-CheckResult "Node.js/npm functionality" $false "" "Reinstall Node.js and npm"
    }
}

Write-Host "`n" + "=" * 50 -ForegroundColor Gray

if ($allGood) {
    Write-Host "🎉 All checks passed! Your development environment is ready." -ForegroundColor Green
    Write-Host "🚀 You can now start building full-stack applications!" -ForegroundColor Green
} else {
    Write-Host "⚠️ Some issues found. Please address the items marked with ❌" -ForegroundColor Yellow
    Write-Host "💡 Run setup-windows.ps1 to automatically install missing tools" -ForegroundColor Cyan
}

Write-Host "`n📚 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Create a new project using templates in the templates/ folder" -ForegroundColor White
Write-Host "2. Set up a database using guides in setup/database-setup.md" -ForegroundColor White
Write-Host "3. Read the documentation in docs/ folder" -ForegroundColor White
Write-Host "4. Start coding! 🚀" -ForegroundColor White
