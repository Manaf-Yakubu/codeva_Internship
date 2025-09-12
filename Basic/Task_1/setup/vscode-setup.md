# VS Code Setup Guide

## 📦 Installing Visual Studio Code

### Method 1: Official Installer (Recommended)

1. **Download VS Code**
   - Visit [code.visualstudio.com](https://code.visualstudio.com/)
   - Click "Download for Windows"
   - Choose the System Installer (recommended)

2. **Run the Installer**
   - Double-click the downloaded .exe file
   - **Important Installation Options:**
     - ✅ Add "Open with Code" action to Windows Explorer file context menu
     - ✅ Add "Open with Code" action to Windows Explorer directory context menu
     - ✅ Register Code as an editor for supported file types
     - ✅ Add to PATH (requires shell restart)

3. **Verify Installation**
   ```powershell
   code --version
   # Should output version information
   ```

### Method 2: Using Chocolatey
```powershell
choco install vscode
```

### Method 3: Using Winget
```powershell
winget install -e --id Microsoft.VisualStudioCode
```

## 🔧 Essential Extensions

Install these extensions for full-stack development:

### Core Development Extensions
```bash
# Install via command line
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension bradlc.vscode-tailwindcss
code --install-extension esbenp.prettier-vscode
code --install-extension ms-vscode.vscode-eslint
code --install-extension formulahendry.auto-rename-tag
code --install-extension christian-kohler.path-intellisense
code --install-extension ms-vscode.vscode-json
```

### Language Support
```bash
# JavaScript/TypeScript
code --install-extension ms-vscode.vscode-typescript-next

# Python
code --install-extension ms-python.python

# HTML/CSS
code --install-extension ecmel.vscode-html-css

# React
code --install-extension dsznajder.es7-react-js-snippets

# Vue.js
code --install-extension octref.vetur

# Angular
code --install-extension Angular.ng-template
```

### Database Extensions
```bash
# MongoDB
code --install-extension mongodb.mongodb-vscode

# MySQL
code --install-extension formulahendry.vscode-mysql

# PostgreSQL
code --install-extension ms-ossdata.vscode-postgresql
```

### Git and Version Control
```bash
code --install-extension eamodio.gitlens
code --install-extension github.vscode-pull-request-github
code --install-extension mhutchie.git-graph
```

### Productivity Extensions
```bash
code --install-extension ms-vscode.vscode-live-server
code --install-extension ritwickdey.liveserver
code --install-extension ms-vscode-remote.remote-wsl
code --install-extension ms-vscode.powershell
code --install-extension alefragnani.bookmarks
code --install-extension gruntfuggly.todo-tree
```

## ⚙️ VS Code Configuration

### 1. User Settings (settings.json)

Access via: `Ctrl+Shift+P` → "Preferences: Open Settings (JSON)"

```json
{
  "editor.fontSize": 14,
  "editor.fontFamily": "'Fira Code', 'Cascadia Code', Consolas, 'Courier New', monospace",
  "editor.fontLigatures": true,
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "editor.wordWrap": "on",
  "editor.minimap.enabled": true,
  "editor.bracketPairColorization.enabled": true,
  "editor.guides.bracketPairs": true,
  "editor.formatOnSave": true,
  "editor.formatOnPaste": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "files.autoSave": "afterDelay",
  "files.autoSaveDelay": 1000,
  "files.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/build": true,
    "**/.git": true
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact",
    "typescript": "typescriptreact"
  },
  "prettier.singleQuote": true,
  "prettier.semi": true,
  "prettier.tabWidth": 2,
  "eslint.format.enable": true,
  "javascript.updateImportsOnFileMove.enabled": "always",
  "typescript.updateImportsOnFileMove.enabled": "always",
  "git.enableSmartCommit": true,
  "git.confirmSync": false,
  "terminal.integrated.defaultProfile.windows": "PowerShell",
  "workbench.colorTheme": "Dark+ (default dark)",
  "workbench.iconTheme": "vs-seti"
}
```

### 2. Workspace Settings

For project-specific settings, create `.vscode/settings.json` in your project root:

```json
{
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "files.associations": {
    "*.env": "dotenv"
  },
  "eslint.workingDirectories": ["frontend", "backend"],
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

### 3. Launch Configuration (.vscode/launch.json)

For debugging Node.js applications:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Node.js",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/server.js",
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal",
      "restart": true,
      "runtimeExecutable": "nodemon"
    },
    {
      "name": "Launch React App",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["start"]
    }
  ]
}
```

### 4. Tasks Configuration (.vscode/tasks.json)

For build and development tasks:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "npm install",
      "type": "shell",
      "command": "npm install",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    },
    {
      "label": "npm start",
      "type": "shell",
      "command": "npm start",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    },
    {
      "label": "npm build",
      "type": "shell",
      "command": "npm run build",
      "group": "build"
    }
  ]
}
```

## 🎨 Recommended Themes and Fonts

### Popular Themes
- **Dark+ (default dark)** - Built-in, great for beginners
- **One Dark Pro** - Popular Atom-inspired theme
- **Material Theme** - Google Material Design
- **Dracula Official** - Popular dark theme
- **Night Owl** - Designed for night owls

Install themes:
```bash
code --install-extension zhuangtongfa.Material-theme
code --install-extension dracula-theme.theme-dracula
code --install-extension sdras.night-owl
```

### Recommended Fonts
- **Fira Code** - Free, includes ligatures
- **Cascadia Code** - Microsoft's programming font
- **JetBrains Mono** - Designed for developers
- **Source Code Pro** - Adobe's monospace font

## 🔧 Code Snippets

### JavaScript/React Snippets

Create custom snippets: `Ctrl+Shift+P` → "Preferences: Configure User Snippets"

```json
{
  "React Functional Component": {
    "prefix": "rfc",
    "body": [
      "import React from 'react';",
      "",
      "const ${1:ComponentName} = () => {",
      "  return (",
      "    <div>",
      "      $2",
      "    </div>",
      "  );",
      "};",
      "",
      "export default ${1:ComponentName};"
    ],
    "description": "Create a React functional component"
  },
  "Express Route": {
    "prefix": "route",
    "body": [
      "app.${1:get}('/${2:path}', (req, res) => {",
      "  $3",
      "});"
    ],
    "description": "Create an Express route"
  }
}
```

## ⌨️ Essential Keyboard Shortcuts

### File Operations
- `Ctrl+N` - New file
- `Ctrl+O` - Open file
- `Ctrl+S` - Save file
- `Ctrl+Shift+S` - Save as
- `Ctrl+W` - Close file
- `Ctrl+Shift+T` - Reopen closed file

### Navigation
- `Ctrl+P` - Quick open file
- `Ctrl+Shift+P` - Command palette
- `Ctrl+G` - Go to line
- `Ctrl+Shift+O` - Go to symbol
- `F12` - Go to definition
- `Alt+Left/Right` - Navigate back/forward

### Editing
- `Ctrl+D` - Select next occurrence
- `Ctrl+Shift+L` - Select all occurrences
- `Alt+Up/Down` - Move line up/down
- `Shift+Alt+Up/Down` - Copy line up/down
- `Ctrl+/` - Toggle line comment
- `Shift+Alt+A` - Toggle block comment

### Terminal
- `Ctrl+`` ` - Toggle terminal
- `Ctrl+Shift+`` ` - New terminal
- `Ctrl+Shift+5` - Split terminal

## 🔍 Debugging Setup

### 1. Node.js Debugging
- Set breakpoints by clicking in the gutter
- Press `F5` to start debugging
- Use `F10` (step over), `F11` (step into), `Shift+F11` (step out)

### 2. Browser Debugging
Install "Debugger for Chrome" extension:
```bash
code --install-extension msjsdiag.debugger-for-chrome
```

### 3. Debug Configuration for React
```json
{
  "name": "Debug React App",
  "type": "chrome",
  "request": "launch",
  "url": "http://localhost:3000",
  "webRoot": "${workspaceFolder}/src",
  "sourceMapPathOverrides": {
    "webpack:///src/*": "${webRoot}/*"
  }
}
```

## 🧪 Testing Your Setup

1. **Create a test project:**
   ```powershell
   mkdir vscode-test
   cd vscode-test
   code .
   ```

2. **Test extensions:**
   - Create `index.html` - HTML snippets should work
   - Create `app.js` - JavaScript IntelliSense should work
   - Create `style.css` - CSS suggestions should work

3. **Test Git integration:**
   - Initialize Git: `git init`
   - Make changes and see Git indicators in sidebar

## 🔍 Troubleshooting

### Common Issues:

1. **Extensions not working**
   - Reload VS Code: `Ctrl+Shift+P` → "Developer: Reload Window"
   - Check extension compatibility
   - Disable conflicting extensions

2. **IntelliSense not working**
   - Check if TypeScript is installed: `npm install -g typescript`
   - Restart TypeScript server: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

3. **Terminal not opening**
   - Check default terminal setting
   - Try different terminal (PowerShell, Command Prompt, Git Bash)

4. **Slow performance**
   - Disable unused extensions
   - Exclude large folders in settings
   - Increase memory limit: `"typescript.tsserver.maxTsServerMemory": 4096`

## 📚 Next Steps

1. ✅ Customize your workspace to your preferences
2. 🔧 Learn keyboard shortcuts for efficiency
3. 🎨 Explore themes and customize appearance
4. 📦 Install language-specific extensions as needed
5. 🐛 Practice debugging with breakpoints
6. 📝 Create custom snippets for common code patterns

## 🔗 Useful Resources

- [VS Code Documentation](https://code.visualstudio.com/docs)
- [VS Code Tips and Tricks](https://code.visualstudio.com/docs/getstarted/tips-and-tricks)
- [Extension Marketplace](https://marketplace.visualstudio.com/vscode)
- [VS Code Keyboard Shortcuts](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf)
