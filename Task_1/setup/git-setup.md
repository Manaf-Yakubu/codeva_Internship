# Git and GitHub Setup Guide

## 📦 Installing Git

### Method 1: Official Git Installer (Recommended)

1. **Download Git**
   - Visit [git-scm.com](https://git-scm.com/download/win)
   - Download the latest version for Windows
   - Choose the 64-bit version for most modern systems

2. **Run the Installer**
   - Double-click the downloaded .exe file
   - **Important Installation Options:**
     - ✅ Use Git from the command line and also from 3rd-party software
     - ✅ Use the OpenSSL library
     - ✅ Checkout Windows-style, commit Unix-style line endings
     - ✅ Use Windows' default console window
     - ✅ Enable Git Credential Manager

3. **Verify Installation**
   ```powershell
   git --version
   # Should output something like: git version 2.41.0.windows.1
   ```

### Method 2: Using Chocolatey
```powershell
choco install git
```

### Method 3: Using Winget
```powershell
winget install --id Git.Git -e --source winget
```

## ⚙️ Initial Git Configuration

### 1. Set Your Identity
```bash
# Set your name (replace with your actual name)
git config --global user.name "Your Full Name"

# Set your email (use the same email as your GitHub account)
git config --global user.email "your.email@example.com"
```

### 2. Configure Default Settings
```bash
# Set default branch name to 'main'
git config --global init.defaultBranch main

# Set default editor (VS Code recommended)
git config --global core.editor "code --wait"

# Enable colored output
git config --global color.ui auto

# Set line ending handling for Windows
git config --global core.autocrlf true

# Set default pull behavior
git config --global pull.rebase false
```

### 3. View Your Configuration
```bash
# View all configuration
git config --list

# View specific configuration
git config user.name
git config user.email
```

## 🔐 SSH Key Setup for GitHub

### 1. Generate SSH Key
```bash
# Generate a new SSH key (replace email with yours)
ssh-keygen -t ed25519 -C "your.email@example.com"

# When prompted:
# - Press Enter to accept default file location
# - Enter a secure passphrase (optional but recommended)
```

### 2. Add SSH Key to SSH Agent
```bash
# Start the SSH agent
eval "$(ssh-agent -s)"

# Add your SSH private key to the ssh-agent
ssh-add ~/.ssh/id_ed25519
```

### 3. Copy SSH Key to Clipboard
```bash
# Copy the SSH key to clipboard (Windows)
clip < ~/.ssh/id_ed25519.pub

# Or display it to copy manually
cat ~/.ssh/id_ed25519.pub
```

### 4. Add SSH Key to GitHub
1. Go to [GitHub.com](https://github.com) and sign in
2. Click your profile picture → **Settings**
3. Click **SSH and GPG keys** in the sidebar
4. Click **New SSH key**
5. Give it a title (e.g., "My Development Machine")
6. Paste your key in the "Key" field
7. Click **Add SSH key**

### 5. Test SSH Connection
```bash
ssh -T git@github.com
# Should output: Hi username! You've successfully authenticated...
```

## 🏗️ Creating Your First Repository

### Method 1: Create on GitHub First (Recommended)

1. **On GitHub:**
   - Go to [github.com](https://github.com)
   - Click the **+** icon → **New repository**
   - Name your repository (e.g., "my-first-project")
   - Add a description
   - ✅ Initialize with README
   - ✅ Add .gitignore (choose appropriate template)
   - Choose a license (MIT is popular for open source)
   - Click **Create repository**

2. **Clone to Your Machine:**
   ```bash
   # Clone using SSH (recommended)
   git clone git@github.com:yourusername/my-first-project.git
   
   # Or clone using HTTPS
   git clone https://github.com/yourusername/my-first-project.git
   
   # Navigate to the project
   cd my-first-project
   ```

### Method 2: Create Locally First

```bash
# Create and navigate to project directory
mkdir my-project
cd my-project

# Initialize Git repository
git init

# Create initial files
echo "# My Project" > README.md
echo "node_modules/" > .gitignore

# Add and commit files
git add .
git commit -m "Initial commit"

# Add remote repository (create on GitHub first)
git remote add origin git@github.com:yourusername/my-project.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## 📋 Essential Git Commands

### Basic Workflow
```bash
# Check repository status
git status

# Add files to staging area
git add filename.txt          # Add specific file
git add .                     # Add all files
git add *.js                  # Add all JavaScript files

# Commit changes
git commit -m "Descriptive commit message"

# Push changes to remote repository
git push

# Pull latest changes from remote
git pull
```

### Branching
```bash
# Create and switch to new branch
git checkout -b feature-branch-name

# Switch between branches
git checkout main
git checkout feature-branch-name

# List all branches
git branch

# Merge branch into current branch
git merge feature-branch-name

# Delete branch
git branch -d feature-branch-name
```

### Viewing History
```bash
# View commit history
git log
git log --oneline             # Compact view
git log --graph --oneline     # Visual graph

# View changes
git diff                      # Unstaged changes
git diff --staged             # Staged changes
git diff HEAD~1               # Compare with previous commit
```

## 🔧 Git Configuration File

Create a global `.gitconfig` file in your home directory:

```bash
# Navigate to home directory
cd ~

# Create/edit .gitconfig file
code .gitconfig
```

Add this configuration:

```ini
[user]
    name = Your Full Name
    email = your.email@example.com

[core]
    editor = code --wait
    autocrlf = true

[init]
    defaultBranch = main

[pull]
    rebase = false

[color]
    ui = auto

[alias]
    st = status
    co = checkout
    br = branch
    ci = commit
    unstage = reset HEAD --
    last = log -1 HEAD
    visual = !gitk
    lg = log --oneline --graph --decorate --all
```

## 🚫 .gitignore Templates

### Node.js .gitignore
```gitignore
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
dist/
build/

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
```

## 🔍 Troubleshooting

### Common Issues:

1. **Permission denied (publickey)**
   ```bash
   # Check if SSH key is added to agent
   ssh-add -l
   
   # If not, add it
   ssh-add ~/.ssh/id_ed25519
   ```

2. **Git command not found**
   - Restart your terminal
   - Check if Git is in your PATH
   - Reinstall Git

3. **Merge conflicts**
   ```bash
   # View conflicted files
   git status
   
   # Edit files to resolve conflicts
   # Then add and commit
   git add .
   git commit -m "Resolve merge conflict"
   ```

4. **Undo last commit (not pushed)**
   ```bash
   git reset --soft HEAD~1    # Keep changes staged
   git reset --hard HEAD~1    # Discard changes completely
   ```

## 📚 Next Steps

1. ✅ Practice basic Git commands
2. 🌿 Learn about branching strategies (Git Flow, GitHub Flow)
3. 🔄 Understand pull requests and code reviews
4. 🏷️ Learn about Git tags and releases
5. 🔧 Explore Git hooks for automation

## 🔗 Useful Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Interactive Git Tutorial](https://learngitbranching.js.org/)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
