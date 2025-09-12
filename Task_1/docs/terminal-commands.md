# Essential Terminal Commands for Full-Stack Development

## 📁 File and Directory Operations

### Navigation
```powershell
# Show current directory
pwd

# List files and directories
ls                    # Basic list
ls -la               # Detailed list with hidden files
dir                  # Windows equivalent

# Change directory
cd folder-name       # Enter folder
cd ..               # Go up one level
cd ~                # Go to home directory
cd /                # Go to root directory (Unix/Linux)
cd C:\              # Go to C: drive (Windows)

# Create directories
mkdir folder-name           # Create single folder
mkdir -p path/to/folder    # Create nested folders
New-Item -ItemType Directory -Path "folder-name"  # PowerShell

# Create files
touch filename.txt          # Unix/Linux/Git Bash
New-Item filename.txt       # PowerShell
echo. > filename.txt        # Windows Command Prompt
```

### File Operations
```powershell
# Copy files/folders
cp file.txt newfile.txt              # Copy file
cp -r folder/ newfolder/             # Copy folder recursively
Copy-Item file.txt newfile.txt       # PowerShell

# Move/rename files
mv oldname.txt newname.txt           # Rename/move file
mv file.txt folder/                  # Move file to folder
Move-Item oldname.txt newname.txt    # PowerShell

# Delete files/folders
rm file.txt                          # Delete file
rm -rf folder/                       # Delete folder recursively
Remove-Item file.txt                 # PowerShell
Remove-Item -Recurse folder/         # PowerShell recursive delete

# View file contents
cat file.txt                         # Display entire file
head file.txt                        # First 10 lines
tail file.txt                        # Last 10 lines
Get-Content file.txt                 # PowerShell
```

## 🔍 Search and Find

```powershell
# Find files
find . -name "*.js"                  # Find all .js files
Get-ChildItem -Recurse -Filter "*.js" # PowerShell equivalent

# Search in files
grep "search-term" file.txt          # Search in specific file
grep -r "search-term" .              # Search recursively in all files
Select-String "search-term" file.txt # PowerShell

# Find and replace
sed 's/old/new/g' file.txt           # Replace in file (Unix/Linux)
(Get-Content file.txt) -replace 'old','new' | Set-Content file.txt # PowerShell
```

## 📦 Node.js and npm Commands

### Package Management
```bash
# Initialize new project
npm init                    # Interactive setup
npm init -y                # Quick setup with defaults
yarn init                  # Yarn equivalent

# Install packages
npm install package-name           # Install locally
npm install -g package-name        # Install globally
npm install --save package-name    # Add to dependencies
npm install --save-dev package-name # Add to devDependencies
yarn add package-name              # Yarn equivalent
yarn add --dev package-name        # Yarn dev dependency

# Install from package.json
npm install                # Install all dependencies
yarn install              # Yarn equivalent

# Update packages
npm update                 # Update all packages
npm update package-name    # Update specific package
yarn upgrade              # Yarn equivalent

# Remove packages
npm uninstall package-name         # Remove package
npm uninstall -g package-name      # Remove global package
yarn remove package-name           # Yarn equivalent

# List packages
npm list                   # Show installed packages
npm list -g               # Show global packages
yarn list                 # Yarn equivalent

# Check for outdated packages
npm outdated              # Show outdated packages
yarn outdated             # Yarn equivalent
```

### Running Scripts
```bash
# Run scripts defined in package.json
npm start                 # Run start script
npm test                  # Run test script
npm run build            # Run build script
npm run dev              # Run dev script (if defined)
yarn start               # Yarn equivalent
yarn test                # Yarn equivalent
yarn build               # Yarn equivalent

# Run Node.js files
node app.js              # Run JavaScript file
nodemon app.js           # Run with auto-restart on changes
```

## 🔧 Git Commands

### Basic Git Workflow
```bash
# Initialize repository
git init

# Clone repository
git clone https://github.com/user/repo.git
git clone git@github.com:user/repo.git

# Check status
git status               # Show working directory status
git log                 # Show commit history
git log --oneline       # Compact commit history

# Add files to staging
git add file.txt        # Add specific file
git add .              # Add all files
git add *.js           # Add all JavaScript files

# Commit changes
git commit -m "Commit message"
git commit -am "Add and commit all tracked files"

# Push/pull changes
git push               # Push to remote repository
git pull               # Pull latest changes
git push origin main   # Push to specific branch

# Branch operations
git branch             # List branches
git branch new-branch  # Create new branch
git checkout branch-name # Switch to branch
git checkout -b new-branch # Create and switch to new branch
git merge branch-name  # Merge branch into current branch
git branch -d branch-name # Delete branch
```

### Advanced Git Commands
```bash
# Stash changes
git stash              # Stash current changes
git stash pop          # Apply and remove latest stash
git stash list         # List all stashes

# Reset and revert
git reset HEAD file.txt     # Unstage file
git reset --hard HEAD~1     # Reset to previous commit (destructive)
git revert commit-hash      # Create new commit that undoes changes

# Remote operations
git remote -v               # Show remote repositories
git remote add origin url   # Add remote repository
git fetch                   # Fetch changes without merging
```

## 🗄️ Database Commands

### MongoDB
```bash
# Start MongoDB service
net start MongoDB              # Windows
sudo systemctl start mongod   # Linux
brew services start mongodb   # macOS

# Connect to MongoDB
mongosh                       # New MongoDB shell
mongo                        # Legacy MongoDB shell

# Basic MongoDB operations
use database_name            # Switch/create database
show dbs                     # List databases
show collections            # List collections
db.collection.find()        # Find all documents
db.collection.insertOne({}) # Insert document
```

### MySQL
```bash
# Start MySQL service
net start MySQL80            # Windows
sudo systemctl start mysql   # Linux
brew services start mysql    # macOS

# Connect to MySQL
mysql -u root -p            # Connect as root
mysql -u username -p database_name

# Basic MySQL operations
SHOW DATABASES;             # List databases
USE database_name;          # Switch database
SHOW TABLES;               # List tables
SELECT * FROM table_name;   # Select all records
```

### PostgreSQL
```bash
# Start PostgreSQL service
net start postgresql-x64-15  # Windows
sudo systemctl start postgresql # Linux
brew services start postgresql  # macOS

# Connect to PostgreSQL
psql -U postgres            # Connect as postgres user
psql -U username -d database_name

# Basic PostgreSQL operations
\l                         # List databases
\c database_name          # Connect to database
\dt                       # List tables
SELECT * FROM table_name; # Select all records
\q                        # Quit
```

## 🌐 Web Development Commands

### Development Servers
```bash
# Live Server (if installed globally)
live-server               # Start live server in current directory
live-server --port=8080   # Start on specific port

# Python simple server
python -m http.server 8000        # Python 3
python -m SimpleHTTPServer 8000   # Python 2

# Node.js simple server
npx http-server           # Using http-server package
npx serve                 # Using serve package
```

### Build Tools
```bash
# Create React App
npx create-react-app my-app
cd my-app
npm start

# Create Vue App
npm create vue@latest my-app
cd my-app
npm install
npm run dev

# Create Angular App
npx @angular/cli new my-app
cd my-app
ng serve

# Vite (modern build tool)
npm create vite@latest my-app
cd my-app
npm install
npm run dev
```

## 🔧 System and Process Commands

### Process Management
```powershell
# View running processes
ps                        # Unix/Linux
Get-Process              # PowerShell
tasklist                 # Windows Command Prompt

# Kill processes
kill PID                 # Unix/Linux (replace PID with process ID)
Stop-Process -Id PID     # PowerShell
taskkill /PID PID        # Windows Command Prompt

# Find process using port
netstat -ano | findstr :3000    # Windows
lsof -i :3000                   # Unix/Linux/macOS
```

### System Information
```powershell
# System information
systeminfo               # Windows detailed system info
Get-ComputerInfo         # PowerShell system info
uname -a                 # Unix/Linux system info

# Disk usage
df -h                    # Unix/Linux disk usage
Get-PSDrive              # PowerShell drive info
dir C:\ /s               # Windows directory size

# Memory usage
free -h                  # Unix/Linux memory info
Get-Process | Sort-Object WorkingSet -Descending # PowerShell memory usage
```

## 🔐 Environment Variables

```powershell
# View environment variables
env                      # Unix/Linux - list all
echo $PATH              # Unix/Linux - specific variable
Get-ChildItem Env:      # PowerShell - list all
echo $env:PATH          # PowerShell - specific variable
set                     # Windows Command Prompt - list all

# Set environment variables (temporary)
export VAR_NAME=value   # Unix/Linux
$env:VAR_NAME = "value" # PowerShell
set VAR_NAME=value      # Windows Command Prompt

# Set permanent environment variables (Windows)
setx VAR_NAME "value"   # Set for current user
setx VAR_NAME "value" /M # Set for all users (requires admin)
```

## 🚀 Productivity Tips

### Command History
```bash
# View command history
history                 # Unix/Linux
Get-History            # PowerShell
doskey /history        # Windows Command Prompt

# Search command history
Ctrl+R                 # Reverse search (Unix/Linux)
# Type to search through previous commands

# Repeat last command
!!                     # Unix/Linux
# Up arrow key works in all terminals
```

### Aliases and Shortcuts
```bash
# Create aliases (Unix/Linux/Git Bash)
alias ll='ls -la'
alias gs='git status'
alias gp='git push'

# PowerShell aliases
Set-Alias ll Get-ChildItem
Set-Alias gs 'git status'

# Make aliases permanent by adding to profile
# Unix/Linux: ~/.bashrc or ~/.zshrc
# PowerShell: $PROFILE
```

### Useful Keyboard Shortcuts
- `Ctrl+C` - Cancel current command
- `Ctrl+D` - Exit terminal (Unix/Linux)
- `Ctrl+L` - Clear screen
- `Ctrl+A` - Move cursor to beginning of line
- `Ctrl+E` - Move cursor to end of line
- `Ctrl+U` - Clear line before cursor
- `Ctrl+K` - Clear line after cursor
- `Tab` - Auto-complete commands and file names
- `Up/Down arrows` - Navigate command history

## 🔍 Troubleshooting Commands

```bash
# Check if command exists
which node              # Unix/Linux
Get-Command node        # PowerShell
where node             # Windows Command Prompt

# Check versions
node --version
npm --version
git --version
code --version

# Check running services
netstat -an            # Show all network connections
netstat -tulpn         # Unix/Linux - show listening ports
Get-NetTCPConnection   # PowerShell - show TCP connections

# Test network connectivity
ping google.com        # Test internet connection
curl -I https://google.com # Test HTTP connection
Test-NetConnection google.com # PowerShell network test
```

Remember: Practice these commands regularly to build muscle memory. Start with the basics and gradually incorporate more advanced commands into your workflow!
