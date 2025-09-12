# Troubleshooting Guide

## 🔧 Common Installation Issues

### Node.js and npm Issues

#### "node is not recognized as an internal or external command"
**Problem:** Node.js is not in your system PATH.

**Solutions:**
1. **Restart your terminal/PowerShell** after installation
2. **Check PATH environment variable:**
   ```powershell
   echo $env:PATH
   # Look for Node.js installation path (usually C:\Program Files\nodejs\)
   ```
3. **Manually add to PATH:**
   - Open System Properties → Advanced → Environment Variables
   - Add `C:\Program Files\nodejs\` to PATH
   - Restart terminal

4. **Reinstall Node.js:**
   - Uninstall current version
   - Download fresh installer from nodejs.org
   - Ensure "Add to PATH" is checked during installation

#### npm Permission Errors (EACCES)
**Problem:** Permission denied when installing global packages.

**Solutions:**
1. **Run PowerShell as Administrator:**
   ```powershell
   npm install -g package-name
   ```

2. **Configure npm prefix (Recommended):**
   ```powershell
   mkdir "$env:USERPROFILE\npm-global"
   npm config set prefix "$env:USERPROFILE\npm-global"
   # Add %USERPROFILE%\npm-global to your PATH
   ```

3. **Use Yarn instead:**
   ```powershell
   yarn global add package-name
   ```

#### npm install fails with network errors
**Problem:** Network connectivity or proxy issues.

**Solutions:**
1. **Clear npm cache:**
   ```powershell
   npm cache clean --force
   ```

2. **Check proxy settings:**
   ```powershell
   npm config get proxy
   npm config get https-proxy
   # If behind corporate proxy:
   npm config set proxy http://proxy.company.com:8080
   npm config set https-proxy http://proxy.company.com:8080
   ```

3. **Use different registry:**
   ```powershell
   npm config set registry https://registry.npmmirror.com/
   # To reset: npm config set registry https://registry.npmjs.org/
   ```

### Git Issues

#### "git is not recognized as an internal or external command"
**Problem:** Git is not in your system PATH.

**Solutions:**
1. **Restart terminal** after Git installation
2. **Check Git installation:**
   ```powershell
   where git
   # Should show path like: C:\Program Files\Git\cmd\git.exe
   ```
3. **Reinstall Git** with "Use Git from the command line" option selected

#### SSH Key Issues
**Problem:** "Permission denied (publickey)" when pushing to GitHub.

**Solutions:**
1. **Check if SSH key exists:**
   ```bash
   ls ~/.ssh/
   # Look for id_rsa, id_ed25519, or similar files
   ```

2. **Generate new SSH key:**
   ```bash
   ssh-keygen -t ed25519 -C "your.email@example.com"
   ```

3. **Add SSH key to ssh-agent:**
   ```bash
   eval "$(ssh-agent -s)"
   ssh-add ~/.ssh/id_ed25519
   ```

4. **Add public key to GitHub:**
   ```bash
   cat ~/.ssh/id_ed25519.pub
   # Copy output and add to GitHub → Settings → SSH Keys
   ```

5. **Test SSH connection:**
   ```bash
   ssh -T git@github.com
   ```

#### Git push rejected
**Problem:** "Updates were rejected because the remote contains work that you do not have locally."

**Solutions:**
1. **Pull latest changes first:**
   ```bash
   git pull origin main
   # Resolve any merge conflicts, then:
   git push origin main
   ```

2. **Force push (use with caution):**
   ```bash
   git push --force-with-lease origin main
   ```

### VS Code Issues

#### Extensions not working
**Problem:** VS Code extensions not functioning properly.

**Solutions:**
1. **Reload VS Code:**
   - `Ctrl+Shift+P` → "Developer: Reload Window"

2. **Check extension compatibility:**
   - Disable conflicting extensions
   - Update VS Code to latest version

3. **Reset extension host:**
   - `Ctrl+Shift+P` → "Developer: Restart Extension Host"

4. **Clear extension cache:**
   ```powershell
   # Close VS Code first
   Remove-Item -Recurse -Force "$env:USERPROFILE\.vscode\extensions"
   # Restart VS Code and reinstall extensions
   ```

#### IntelliSense not working
**Problem:** No code completion or suggestions.

**Solutions:**
1. **Install TypeScript globally:**
   ```powershell
   npm install -g typescript
   ```

2. **Restart TypeScript server:**
   - `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

3. **Check workspace trust:**
   - `Ctrl+Shift+P` → "Workspaces: Manage Workspace Trust"

4. **Verify file associations:**
   - Check if files have correct language mode in bottom-right corner

#### Terminal not opening in VS Code
**Problem:** Integrated terminal fails to open.

**Solutions:**
1. **Check default terminal setting:**
   - `Ctrl+,` → Search "terminal.integrated.defaultProfile.windows"
   - Set to "PowerShell" or "Command Prompt"

2. **Reset terminal:**
   - `Ctrl+Shift+P` → "Terminal: Kill All Terminals"
   - Try opening new terminal with `Ctrl+``

3. **Check antivirus software:**
   - Some antivirus programs block terminal access
   - Add VS Code to exceptions

## 🗄️ Database Issues

### MongoDB Issues

#### MongoDB service won't start
**Problem:** MongoDB service fails to start.

**Solutions:**
1. **Check Windows Services:**
   ```powershell
   Get-Service -Name MongoDB
   Start-Service -Name MongoDB
   ```

2. **Check data directory permissions:**
   ```powershell
   # Ensure C:\data\db exists and has proper permissions
   mkdir C:\data\db -Force
   ```

3. **Check MongoDB logs:**
   ```
   C:\Program Files\MongoDB\Server\7.0\log\mongod.log
   ```

4. **Restart as Administrator:**
   ```powershell
   # Run PowerShell as Admin
   net start MongoDB
   ```

#### Can't connect to MongoDB
**Problem:** Connection refused or timeout errors.

**Solutions:**
1. **Check if MongoDB is running:**
   ```powershell
   netstat -an | findstr :27017
   ```

2. **Check connection string:**
   ```javascript
   // Correct format:
   mongodb://localhost:27017/database_name
   ```

3. **Check firewall settings:**
   - Allow MongoDB through Windows Firewall
   - Port 27017 should be open

### MySQL Issues

#### MySQL service won't start
**Problem:** MySQL service fails to start.

**Solutions:**
1. **Check Windows Services:**
   ```powershell
   Get-Service -Name MySQL80
   Start-Service -Name MySQL80
   ```

2. **Check MySQL error log:**
   ```
   C:\ProgramData\MySQL\MySQL Server 8.0\Data\*.err
   ```

3. **Reset MySQL password:**
   ```bash
   # Stop MySQL service first
   mysqld --skip-grant-tables
   # In another terminal:
   mysql -u root
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
   FLUSH PRIVILEGES;
   ```

#### Access denied for user 'root'
**Problem:** Can't connect to MySQL with root user.

**Solutions:**
1. **Check password:**
   ```bash
   mysql -u root -p
   # Enter the password you set during installation
   ```

2. **Reset root password:**
   ```bash
   # Stop MySQL service
   mysqld --skip-grant-tables --skip-networking
   mysql -u root
   USE mysql;
   UPDATE user SET authentication_string=PASSWORD('new_password') WHERE User='root';
   FLUSH PRIVILEGES;
   ```

### PostgreSQL Issues

#### PostgreSQL service won't start
**Problem:** PostgreSQL service fails to start.

**Solutions:**
1. **Check Windows Services:**
   ```powershell
   Get-Service -Name postgresql*
   Start-Service -Name "postgresql-x64-15"
   ```

2. **Check PostgreSQL logs:**
   ```
   C:\Program Files\PostgreSQL\15\data\log\
   ```

3. **Check data directory:**
   ```
   C:\Program Files\PostgreSQL\15\data\
   ```

## 🌐 Network and Firewall Issues

### Port Already in Use
**Problem:** "Port 3000 is already in use" or similar errors.

**Solutions:**
1. **Find process using the port:**
   ```powershell
   netstat -ano | findstr :3000
   # Note the PID (last column)
   tasklist | findstr PID_NUMBER
   ```

2. **Kill the process:**
   ```powershell
   taskkill /PID PID_NUMBER /F
   ```

3. **Use different port:**
   ```bash
   # For React apps:
   set PORT=3001 && npm start
   
   # For Node.js apps:
   const PORT = process.env.PORT || 3001;
   ```

### Firewall Blocking Connections
**Problem:** Can't access localhost applications from other devices.

**Solutions:**
1. **Allow app through Windows Firewall:**
   - Windows Security → Firewall & network protection
   - Allow an app through firewall
   - Add Node.js, VS Code, etc.

2. **Create firewall rule for port:**
   ```powershell
   # Run as Administrator
   New-NetFirewallRule -DisplayName "Node.js App" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow
   ```

## 🔄 Performance Issues

### Slow npm installs
**Problem:** npm install takes very long time.

**Solutions:**
1. **Clear npm cache:**
   ```powershell
   npm cache clean --force
   ```

2. **Use faster registry:**
   ```powershell
   npm config set registry https://registry.npmmirror.com/
   ```

3. **Use Yarn instead:**
   ```powershell
   yarn install
   ```

4. **Disable antivirus real-time scanning** for node_modules folder

### VS Code running slowly
**Problem:** VS Code is sluggish or unresponsive.

**Solutions:**
1. **Disable unused extensions**
2. **Exclude large folders from file watcher:**
   ```json
   {
     "files.watcherExclude": {
       "**/node_modules/**": true,
       "**/dist/**": true,
       "**/build/**": true
     }
   }
   ```

3. **Increase memory limit:**
   ```json
   {
     "typescript.tsserver.maxTsServerMemory": 4096
   }
   ```

## 🆘 Emergency Recovery

### Completely Reset Development Environment
**Problem:** Everything is broken, need fresh start.

**Solutions:**
1. **Uninstall everything:**
   ```powershell
   # Uninstall Node.js from Control Panel
   # Uninstall Git from Control Panel
   # Uninstall VS Code from Control Panel
   ```

2. **Clean up remaining files:**
   ```powershell
   # Remove Node.js folders
   Remove-Item -Recurse -Force "$env:APPDATA\npm"
   Remove-Item -Recurse -Force "$env:USERPROFILE\.npm"
   
   # Remove VS Code settings
   Remove-Item -Recurse -Force "$env:APPDATA\Code"
   ```

3. **Run setup script:**
   ```powershell
   .\setup\setup-windows.ps1
   ```

### Recover Lost Work
**Problem:** Accidentally deleted files or lost changes.

**Solutions:**
1. **Check Git history:**
   ```bash
   git log --oneline
   git reflog  # Shows all recent actions
   git checkout commit-hash -- filename
   ```

2. **Check VS Code local history:**
   - `Ctrl+Shift+P` → "Local History: Find Entry to Restore"

3. **Check Windows File History:**
   - Right-click folder → Properties → Previous Versions

## 📞 Getting Help

### Where to Find Help
1. **Official Documentation:**
   - [Node.js Docs](https://nodejs.org/docs/)
   - [Git Documentation](https://git-scm.com/doc)
   - [VS Code Docs](https://code.visualstudio.com/docs)

2. **Community Forums:**
   - [Stack Overflow](https://stackoverflow.com/)
   - [GitHub Discussions](https://github.com/discussions)
   - [Reddit r/webdev](https://reddit.com/r/webdev)

3. **Error-Specific Resources:**
   - Copy exact error message and search online
   - Check GitHub issues for specific packages
   - Look for similar problems on Stack Overflow

### How to Ask for Help
1. **Include error messages** (full text)
2. **Specify your environment:**
   - Windows version
   - Node.js version (`node --version`)
   - npm version (`npm --version`)
   - VS Code version
3. **Describe what you were trying to do**
4. **Include relevant code snippets**
5. **Mention what you've already tried**

Remember: Most issues have been encountered by others before. Don't hesitate to search for solutions online!
