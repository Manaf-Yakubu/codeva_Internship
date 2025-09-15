const http = require('http');
const fs = require('fs');
const url = require('url');

const PORT = 3000;

const registerHTML = `<!DOCTYPE html>
<html>
<head>
    <title>Register - Enhanced PERN App</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)),
                        url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80');
            background-size: cover;
            background-position: center;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .card {
            background: rgba(255,255,255,0.95);
            backdrop-filter: blur(20px);
            border-radius: 16px;
            padding: 40px;
            max-width: 500px;
            width: 100%;
            box-shadow: 0 25px 50px rgba(0,0,0,0.25);
        }
        .avatar {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #CE1126 0%, #FCD116 50%, #006B3F 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            color: white;
            font-size: 2rem;
        }
        h1 {
            text-align: center;
            font-size: 2.5rem;
            font-weight: 800;
            background: linear-gradient(135deg, #CE1126 0%, #FCD116 50%, #006B3F 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 30px;
        }
        .form-row { display: flex; gap: 15px; }
        .form-group { margin-bottom: 20px; flex: 1; }
        label { display: block; margin-bottom: 5px; font-weight: 600; }
        input {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e1e5e9;
            border-radius: 8px;
            font-size: 1rem;
            background: rgba(255,255,255,0.8);
        }
        input:focus {
            outline: none;
            border-color: #CE1126;
            background: white;
        }
        .btn {
            width: 100%;
            padding: 15px;
            background: linear-gradient(135deg, #CE1126 0%, #FCD116 50%, #006B3F 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1.1rem;
            font-weight: 700;
            cursor: pointer;
            margin: 20px 0;
        }
        .btn:hover {
            background: linear-gradient(135deg, #B50E20 0%, #E8BC0A 50%, #005A35 100%);
            transform: translateY(-2px);
        }
        .link { text-align: center; margin-top: 20px; }
        .link a { color: #CE1126; text-decoration: none; font-weight: 700; }
        .alert {
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
            display: none;
        }
        .alert.error { background: #f8d7da; color: #721c24; }
        .alert.success { background: #d4edda; color: #155724; }
    </style>
</head>
<body>
    <div class="card">
        <div class="avatar">👤</div>
        <h1>Join CodeVA</h1>
        
        <div id="alert" class="alert"></div>
        
        <form id="registerForm">
            <div class="form-row">
                <div class="form-group">
                    <label>First Name</label>
                    <input type="text" id="firstName" required>
                </div>
                <div class="form-group">
                    <label>Last Name</label>
                    <input type="text" id="lastName" required>
                </div>
            </div>
            
            <div class="form-group">
                <label>Email</label>
                <input type="email" id="email" required>
            </div>
            
            <div class="form-group">
                <label>Password</label>
                <input type="password" id="password" required>
            </div>
            
            <div class="form-group">
                <label>Confirm Password</label>
                <input type="password" id="confirmPassword" required>
            </div>
            
            <button type="submit" class="btn">Create Account</button>
        </form>
        
        <div class="link">
            <p>Already have an account? <a href="/login">Sign in here</a></p>
        </div>
    </div>
    
    <script>
        document.getElementById('registerForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                confirmPassword: document.getElementById('confirmPassword').value
            };
            
            if (formData.password !== formData.confirmPassword) {
                showAlert('Passwords do not match', 'error');
                return;
            }
            
            try {
                const response = await fetch('http://localhost:5001/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    showAlert('Registration successful!', 'success');
                    setTimeout(() => window.location.href = '/login', 2000);
                } else {
                    showAlert(data.message || 'Registration failed', 'error');
                }
            } catch (error) {
                showAlert('Network error. Please try again.', 'error');
            }
        });
        
        function showAlert(message, type) {
            const alert = document.getElementById('alert');
            alert.textContent = message;
            alert.className = 'alert ' + type;
            alert.style.display = 'block';
            setTimeout(() => alert.style.display = 'none', 5000);
        }
    </script>
</body>
</html>`;

const loginHTML = `<!DOCTYPE html>
<html>
<head>
    <title>Login - Enhanced PERN App</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)),
                        url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80');
            background-size: cover;
            background-position: center;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .card {
            background: rgba(255,255,255,0.95);
            backdrop-filter: blur(20px);
            border-radius: 16px;
            padding: 40px;
            max-width: 450px;
            width: 100%;
            box-shadow: 0 25px 50px rgba(0,0,0,0.25);
        }
        .avatar {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #CE1126 0%, #FCD116 50%, #006B3F 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            color: white;
            font-size: 2rem;
        }
        h1 {
            text-align: center;
            font-size: 2.5rem;
            font-weight: 800;
            background: linear-gradient(135deg, #CE1126 0%, #FCD116 50%, #006B3F 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 30px;
        }
        .form-group { margin-bottom: 20px; }
        label { display: block; margin-bottom: 5px; font-weight: 600; }
        input {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e1e5e9;
            border-radius: 8px;
            font-size: 1rem;
            background: rgba(255,255,255,0.8);
        }
        input:focus {
            outline: none;
            border-color: #CE1126;
            background: white;
        }
        .btn {
            width: 100%;
            padding: 15px;
            background: linear-gradient(135deg, #CE1126 0%, #FCD116 50%, #006B3F 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1.1rem;
            font-weight: 700;
            cursor: pointer;
            margin: 20px 0;
        }
        .btn:hover {
            background: linear-gradient(135deg, #B50E20 0%, #E8BC0A 50%, #005A35 100%);
            transform: translateY(-2px);
        }
        .demo-buttons { display: flex; gap: 10px; margin: 20px 0; }
        .demo-btn {
            flex: 1;
            padding: 10px;
            border: 2px solid #CE1126;
            background: transparent;
            color: #CE1126;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
        }
        .demo-btn.user { border-color: #006B3F; color: #006B3F; }
        .link { text-align: center; margin-top: 20px; }
        .link a { color: #CE1126; text-decoration: none; font-weight: 700; }
        .alert {
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
            display: none;
        }
        .alert.error { background: #f8d7da; color: #721c24; }
        .alert.success { background: #d4edda; color: #155724; }
    </style>
</head>
<body>
    <div class="card">
        <div class="avatar">🔐</div>
        <h1>Welcome Back</h1>
        
        <div id="alert" class="alert"></div>
        
        <form id="loginForm">
            <div class="form-group">
                <label>Email</label>
                <input type="email" id="email" required>
            </div>
            
            <div class="form-group">
                <label>Password</label>
                <input type="password" id="password" required>
            </div>
            
            <button type="submit" class="btn">Sign In</button>
        </form>
        
        <div class="demo-buttons">
            <button type="button" class="demo-btn" onclick="fillDemo('admin')">Admin Demo</button>
            <button type="button" class="demo-btn user" onclick="fillDemo('user')">User Demo</button>
        </div>
        
        <div class="link">
            <p>Don't have an account? <a href="/register">Sign up here</a></p>
        </div>
    </div>
    
    <script>
        function fillDemo(type) {
            if (type === 'admin') {
                document.getElementById('email').value = 'admin@codeva.com';
                document.getElementById('password').value = 'Admin123!';
            } else {
                document.getElementById('email').value = 'user@codeva.com';
                document.getElementById('password').value = 'User123!';
            }
        }
        
        document.getElementById('loginForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            };
            
            try {
                const response = await fetch('http://localhost:5001/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    showAlert('Login successful!', 'success');
                    localStorage.setItem('accessToken', data.data.accessToken);
                    setTimeout(() => window.location.href = '/dashboard', 2000);
                } else {
                    showAlert(data.message || 'Login failed', 'error');
                }
            } catch (error) {
                showAlert('Network error. Please try again.', 'error');
            }
        });
        
        function showAlert(message, type) {
            const alert = document.getElementById('alert');
            alert.textContent = message;
            alert.className = 'alert ' + type;
            alert.style.display = 'block';
            setTimeout(() => alert.style.display = 'none', 5000);
        }
    </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (pathname === '/' || pathname === '/home') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Enhanced PERN App</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                    .btn { display: inline-block; padding: 15px 30px; margin: 10px; background: #CE1126; color: white; text-decoration: none; border-radius: 8px; }
                </style>
            </head>
            <body>
                <h1>Enhanced PERN Application</h1>
                <p>Welcome to the CodeVA Full-Stack Application</p>
                <a href="/login" class="btn">Login</a>
                <a href="/register" class="btn">Register</a>
            </body>
            </html>
        `);
    } else if (pathname === '/login') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(loginHTML);
    } else if (pathname === '/register') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(registerHTML);
    } else if (pathname === '/dashboard') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <!DOCTYPE html>
            <html>
            <head><title>Dashboard</title></head>
            <body style="font-family: Arial; padding: 20px;">
                <h1>🎉 Dashboard</h1>
                <p>Authentication successful! Enhanced PERN app with Ghana-themed design is working.</p>
            </body>
            </html>
        `);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - Page Not Found</h1>');
    }
});

server.listen(PORT, () => {
    console.log(`🚀 Frontend server running on http://localhost:${PORT}`);
    console.log(`📱 Register: http://localhost:${PORT}/register`);
    console.log(`🔐 Login: http://localhost:${PORT}/login`);
});
