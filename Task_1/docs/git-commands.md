# Git Commands Reference Guide

## 🚀 Getting Started

### Initial Setup
```bash
# Configure Git (run once after installation)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
git config --global init.defaultBranch main

# View configuration
git config --list
git config user.name
git config user.email
```

### Repository Initialization
```bash
# Create new repository
git init

# Clone existing repository
git clone https://github.com/Manaf-Yakubu/codeva_Internship.git
git clone git@github.com:username/repository.git  # SSH
git clone https://github.com/Manaf-Yakubu/codeva_Internship.git   # Custom folder name
```

## 📁 Basic Workflow

### Checking Status and Changes
```bash
# Check repository status
git status
git status -s  # Short format

# View changes
git diff                    # Unstaged changes
git diff --staged          # Staged changes
git diff HEAD              # All changes since last commit
git diff branch1..branch2  # Compare branches
```

### Staging and Committing
```bash
# Add files to staging area
git add filename.txt       # Add specific file
git add .                 # Add all files in current directory
git add *.js              # Add all JavaScript files
git add -A                # Add all files (including deleted)
git add -u                # Add only modified/deleted files

# Remove from staging area
git reset filename.txt     # Unstage specific file
git reset                 # Unstage all files

# Commit changes
git commit -m "Commit message"
git commit -am "Add and commit all tracked files"
git commit --amend -m "New commit message"  # Amend last commit
```

## 🌿 Branching and Merging

### Branch Operations
```bash
# List branches
git branch                 # Local branches
git branch -r             # Remote branches
git branch -a             # All branches

# Create branches
git branch new-branch-name
git checkout -b new-branch-name  # Create and switch
git switch -c new-branch-name    # Modern alternative

# Switch branches
git checkout branch-name
git switch branch-name     # Modern alternative

# Rename branch
git branch -m old-name new-name
git branch -m new-name     # Rename current branch

# Delete branches
git branch -d branch-name  # Delete merged branch
git branch -D branch-name  # Force delete branch
git push origin --delete branch-name  # Delete remote branch
```

### Merging
```bash
# Merge branch into current branch
git merge branch-name
git merge --no-ff branch-name  # Create merge commit even for fast-forward

# Abort merge (if conflicts)
git merge --abort

# Rebase (alternative to merge)
git rebase main           # Rebase current branch onto main
git rebase --interactive HEAD~3  # Interactive rebase last 3 commits
git rebase --abort        # Abort rebase
git rebase --continue     # Continue after resolving conflicts
```

## 🔄 Remote Operations

### Remote Repository Management
```bash
# View remotes
git remote -v
git remote show origin

# Add remote
git remote add origin https://github.com/username/repo.git
git remote add upstream https://github.com/original/repo.git  # For forks

# Change remote URL
git remote set-url origin https://github.com/username/new-repo.git

# Remove remote
git remote remove origin
```

### Pushing and Pulling
```bash
# Push changes
git push                  # Push current branch
git push origin main      # Push to specific branch
git push -u origin main   # Set upstream and push
git push --all           # Push all branches
git push --tags          # Push all tags

# Pull changes
git pull                 # Fetch and merge
git pull origin main     # Pull from specific branch
git pull --rebase        # Pull with rebase instead of merge

# Fetch (without merging)
git fetch               # Fetch all remotes
git fetch origin        # Fetch specific remote
git fetch origin main   # Fetch specific branch
```

## 📚 History and Logs

### Viewing History
```bash
# Basic log
git log
git log --oneline        # Compact format
git log --graph          # Visual graph
git log --graph --oneline --all  # Full visual history

# Detailed logs
git log -p              # Show patches (diffs)
git log --stat          # Show file statistics
git log -n 5            # Show last 5 commits
git log --since="2 weeks ago"
git log --author="John Doe"
git log --grep="bug fix"  # Search commit messages

# File history
git log filename.txt     # History of specific file
git log -p filename.txt  # History with changes
git blame filename.txt   # Show who changed each line
```

### Viewing Specific Commits
```bash
# Show commit details
git show commit-hash
git show HEAD           # Show last commit
git show HEAD~1         # Show previous commit

# List files in commit
git show --name-only commit-hash
git show --stat commit-hash
```

## 🔧 Undoing Changes

### Working Directory Changes
```bash
# Discard unstaged changes
git checkout -- filename.txt    # Restore specific file
git checkout .                  # Restore all files
git restore filename.txt        # Modern alternative
git restore .                   # Restore all files

# Clean untracked files
git clean -n            # Preview what will be deleted
git clean -f            # Delete untracked files
git clean -fd           # Delete untracked files and directories
```

### Staged Changes
```bash
# Unstage files
git reset filename.txt   # Unstage specific file
git reset               # Unstage all files
git restore --staged filename.txt  # Modern alternative
```

### Committed Changes
```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Undo specific commit (create new commit)
git revert commit-hash

# Reset to specific commit
git reset --hard commit-hash  # DANGEROUS: loses all changes after commit
```

## 🏷️ Tags

### Creating and Managing Tags
```bash
# List tags
git tag
git tag -l "v1.*"       # List tags matching pattern

# Create tags
git tag v1.0.0          # Lightweight tag
git tag -a v1.0.0 -m "Version 1.0.0"  # Annotated tag
git tag -a v1.0.0 commit-hash -m "Tag message"  # Tag specific commit

# Push tags
git push origin v1.0.0  # Push specific tag
git push origin --tags  # Push all tags

# Delete tags
git tag -d v1.0.0       # Delete local tag
git push origin --delete v1.0.0  # Delete remote tag
```

## 🔄 Stashing

### Temporary Storage
```bash
# Stash changes
git stash               # Stash unstaged changes
git stash -u            # Include untracked files
git stash -a            # Include all files (even ignored)
git stash push -m "Work in progress"  # Stash with message

# List stashes
git stash list

# Apply stashes
git stash pop           # Apply and remove latest stash
git stash apply         # Apply latest stash (keep in stash)
git stash apply stash@{1}  # Apply specific stash

# Manage stashes
git stash show          # Show stash contents
git stash show -p       # Show stash diff
git stash drop          # Delete latest stash
git stash clear         # Delete all stashes
```

## 🔍 Searching and Finding

### Search in Repository
```bash
# Search in files
git grep "search-term"
git grep -n "search-term"  # Show line numbers
git grep -i "search-term"  # Case insensitive

# Search in commit messages
git log --grep="bug fix"
git log --grep="feature" --oneline

# Search in commit content
git log -S "function-name"  # Search for code changes
git log -G "regex-pattern"  # Search with regex
```

## 🔀 Advanced Operations

### Cherry-picking
```bash
# Apply specific commit to current branch
git cherry-pick commit-hash
git cherry-pick commit1..commit3  # Range of commits
git cherry-pick --no-commit commit-hash  # Don't auto-commit
```

### Bisect (Binary Search for Bugs)
```bash
# Start bisect
git bisect start
git bisect bad          # Mark current commit as bad
git bisect good commit-hash  # Mark known good commit

# Git will checkout middle commit, test it, then:
git bisect good         # If commit is good
git bisect bad          # If commit is bad

# Finish bisect
git bisect reset
```

### Submodules
```bash
# Add submodule
git submodule add https://github.com/user/repo.git path/to/submodule

# Clone repository with submodules
git clone --recursive https://github.com/user/repo.git

# Update submodules
git submodule update --init --recursive
git submodule update --remote

# Remove submodule
git submodule deinit path/to/submodule
git rm path/to/submodule
```

## 🛠️ Configuration and Aliases

### Useful Aliases
```bash
# Set up common aliases
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual '!gitk'
git config --global alias.lg 'log --oneline --graph --decorate --all'
git config --global alias.undo 'reset --soft HEAD~1'
```

### Advanced Configuration
```bash
# Set default editor
git config --global core.editor "code --wait"  # VS Code
git config --global core.editor "vim"          # Vim

# Set merge tool
git config --global merge.tool vimdiff

# Set line ending handling
git config --global core.autocrlf true   # Windows
git config --global core.autocrlf input  # macOS/Linux

# Set default push behavior
git config --global push.default simple
```

## 🚨 Emergency Commands

### When Things Go Wrong
```bash
# Recover deleted branch
git reflog              # Find commit hash
git checkout -b recovered-branch commit-hash

# Recover lost commits
git reflog              # Find lost commit
git cherry-pick commit-hash

# Fix "detached HEAD" state
git checkout main       # Switch to main branch
git checkout -b new-branch  # Create branch from current state

# Force push (use with caution)
git push --force-with-lease  # Safer force push
git push --force            # Dangerous force push

# Reset to remote state
git fetch origin
git reset --hard origin/main  # DANGEROUS: loses local changes
```

## 📋 Git Workflow Examples

### Feature Branch Workflow
```bash
# Start new feature
git checkout main
git pull origin main
git checkout -b feature/new-feature

# Work on feature
git add .
git commit -m "Add new feature"
git push -u origin feature/new-feature

# Merge feature (after code review)
git checkout main
git pull origin main
git merge feature/new-feature
git push origin main
git branch -d feature/new-feature
```

### Hotfix Workflow
```bash
# Create hotfix from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug

# Fix bug
git add .
git commit -m "Fix critical bug"
git push -u origin hotfix/critical-bug

# Merge hotfix
git checkout main
git merge hotfix/critical-bug
git push origin main
git branch -d hotfix/critical-bug
```

## 🔗 Useful Resources

- [Git Documentation](https://git-scm.com/doc)
- [Interactive Git Tutorial](https://learngitbranching.js.org/)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [Oh Shit, Git!?!](https://ohshitgit.com/) - Fixing common Git mistakes
