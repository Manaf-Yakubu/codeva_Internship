const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const PORT = 3000;

// Serve static files from client/src directory
app.use(express.static(path.join(__dirname, 'client/src')));
app.use('/pages', express.static(path.join(__dirname, 'client/src/pages')));

// Simple HTML template for testing
const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enhanced PERN App</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)),
                        url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80');
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 16px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            padding: 40px;
            max-width: 500px;
            width: 100%;
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
            font-weight: bold;
        }
        
        h1 {
            text-align: center;
            font-size: 2.5rem;
            font-weight: 800;
            background: linear-gradient(135deg, #CE1126 0%, #FCD116 50%, #006B3F 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 10px;
        }
        
        .subtitle {
            text-align: center;
            color: #666;
            font-size: 1.2rem;
            margin-bottom: 30px;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-row {
            display: flex;
            gap: 15px;
        }
        
        .form-row .form-group {
            flex: 1;
        }
        
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: 600;
            color: #333;
        }
        
        input {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e1e5e9;
            border-radius: 8px;
            font-size: 1rem;
            transition: all 0.3s ease;
            background: rgba(255, 255, 255, 0.8);
        }
        
        input:focus {
            outline: none;
            border-color: #CE1126;
            background: rgba(255, 255, 255, 1);
            box-shadow: 0 0 0 3px rgba(206, 17, 38, 0.1);
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
            transition: all 0.3s ease;
            margin: 20px 0;
        }
        
        .btn:hover {
            background: linear-gradient(135deg, #B50E20 0%, #E8BC0A 50%, #005A35 100%);
            transform: translateY(-2px);
            box-shadow: 0 12px 40px rgba(206, 17, 38, 0.4);
        }
        
        .demo-buttons {
            display: flex;
            gap: 10px;
            margin: 20px 0;
        }
        
        .demo-btn {
            flex: 1;
            padding: 10px;
            border: 2px solid #CE1126;
            background: transparent;
            color: #CE1126;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .demo-btn:hover {
            background: rgba(206, 17, 38, 0.04);
            transform: scale(1.05);
        }
        
        .demo-btn.user {
            border-color: #006B3F;
            color: #006B3F;
        }
        
        .demo-btn.user:hover {
            background: rgba(0, 107, 63, 0.04);
        }
        
        .link {
            text-align: center;
            margin-top: 20px;
        }
        
        .link a {
            color: #CE1126;
            text-decoration: none;
            font-weight: 700;
        }
        
        .link a:hover {
            text-decoration: underline;
        }
        
        .alert {
            background: #f8d7da;
            color: #721c24;
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 20px;
            border: 1px solid #f5c6cb;
        }
        
        .alert.success {
            background: #d4edda;
            color: #155724;
            border-color: #c3e6cb;
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="avatar">👤</div>
        <h1>Join CodeVA</h1>
        <p class="subtitle">Create your account and start your journey</p>
        
        <div id="alert" style="display: none;"></div>
        
        <form id="registerForm">
            <div class="form-row">
                <div class="form-group">
                    <label for="firstName">First Name</label>
                    <input type="text" id="firstName" name="firstName" required>
                </div>
                <div class="form-group">
                    <label for="lastName">Last Name</label>
                    <input type="text" id="lastName" name="lastName" required>
                </div>
            </div>
            
            <div class="form-group">
                <label for="email">Email Address</label>
                <input type="email" id="email" name="email" required>
            </div>
            
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
            </div>
            
            <div class="form-group">
                <label for="confirmPassword">Confirm Password</label>
                <input type="password" id="confirmPassword" name="confirmPassword" required>
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
            
            // Basic validation
            if (formData.password !== formData.confirmPassword) {
                showAlert('Passwords do not match', 'error');
                return;
            }
            
            if (formData.password.length < 6) {
                showAlert('Password must be at least 6 characters', 'error');
                return;
            }
            
            try {
                const response = await fetch('http://localhost:5001/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    showAlert('Registration successful! Redirecting...', 'success');
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 2000);
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
            alert.className = 'alert ' + (type === 'success' ? 'success' : '');
            alert.style.display = 'block';
            
            setTimeout(() => {
                alert.style.display = 'none';
            }, 5000);
        }
    </script>
</body>
</html>
`;

const loginTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enhanced PERN App - Login</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)),
                        url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80');
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 16px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            padding: 40px;
            max-width: 450px;
            width: 100%;
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
            font-weight: bold;
        }
        
        h1 {
            text-align: center;
            font-size: 2.5rem;
            font-weight: 800;
            background: linear-gradient(135deg, #CE1126 0%, #FCD116 50%, #006B3F 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 10px;
        }
        
        .subtitle {
            text-align: center;
            color: #666;
            font-size: 1.2rem;
            margin-bottom: 30px;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: 600;
            color: #333;
        }
        
        input {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e1e5e9;
            border-radius: 8px;
            font-size: 1rem;
            transition: all 0.3s ease;
            background: rgba(255, 255, 255, 0.8);
        }
        
        input:focus {
            outline: none;
            border-color: #CE1126;
            background: rgba(255, 255, 255, 1);
            box-shadow: 0 0 0 3px rgba(206, 17, 38, 0.1);
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
            transition: all 0.3s ease;
            margin: 20px 0;
        }
        
        .btn:hover {
            background: linear-gradient(135deg, #B50E20 0%, #E8BC0A 50%, #005A35 100%);
            transform: translateY(-2px);
            box-shadow: 0 12px 40px rgba(206, 17, 38, 0.4);
        }
        
        .demo-buttons {
            display: flex;
            gap: 10px;
            margin: 20px 0;
        }
        
        .demo-btn {
            flex: 1;
            padding: 10px;
            border: 2px solid #CE1126;
            background: transparent;
            color: #CE1126;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .demo-btn:hover {
            background: rgba(206, 17, 38, 0.04);
            transform: scale(1.05);
        }
        
        .demo-btn.user {
            border-color: #006B3F;
            color: #006B3F;
        }
        
        .demo-btn.user:hover {
            background: rgba(0, 107, 63, 0.04);
        }
        
        .link {
            text-align: center;
            margin-top: 20px;
        }
        
        .link a {
            color: #CE1126;
            text-decoration: none;
            font-weight: 700;
        }
        
        .link a:hover {
            text-decoration: underline;
        }
        
        .alert {
            background: #f8d7da;
            color: #721c24;
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 20px;
            border: 1px solid #f5c6cb;
        }
        
        .alert.success {
            background: #d4edda;
            color: #155724;
            border-color: #c3e6cb;
        }
        
        .divider {
            text-align: center;
            margin: 20px 0;
            position: relative;
        }
        
        .divider::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            height: 1px;
            background: #e1e5e9;
        }
        
        .divider span {
            background: rgba(255, 255, 255, 0.95);
            padding: 0 15px;
            color: #666;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="avatar">🔐</div>
        <h1>Welcome Back</h1>
        <p class="subtitle">Sign in to your CodeVA account</p>
        
        <div id="alert" style="display: none;"></div>
        
        <form id="loginForm">
            <div class="form-group">
                <label for="email">Email Address</label>
                <input type="email" id="email" name="email" required>
            </div>
            
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
            </div>
            
            <button type="submit" class="btn">Sign In</button>
        </form>
        
        <div class="divider">
            <span>Demo Accounts</span>
        </div>
        
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
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    showAlert('Login successful! Redirecting...', 'success');
                    localStorage.setItem('accessToken', data.data.accessToken);
                    setTimeout(() => {
                        window.location.href = '/dashboard';
                    }, 2000);
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
            alert.className = 'alert ' + (type === 'success' ? 'success' : '');
            alert.style.display = 'block';
            
            setTimeout(() => {
                alert.style.display = 'none';
            }, 5000);
        }
    </script>
</body>
</html>
`;

// Routes
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Enhanced PERN App</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                .btn { display: inline-block; padding: 15px 30px; margin: 10px; background: #CE1126; color: white; text-decoration: none; border-radius: 8px; }
                .btn:hover { background: #B50E20; }
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
});

app.get('/login', (req, res) => {
    res.send(loginTemplate);
});

app.get('/register', (req, res) => {
    res.send(htmlTemplate);
});

app.get('/dashboard', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Dashboard - Enhanced PERN App</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .header { background: linear-gradient(135deg, #CE1126 0%, #FCD116 50%, #006B3F 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
                .card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 20px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Dashboard</h1>
                <p>Welcome to your Enhanced PERN Application Dashboard</p>
            </div>
            <div class="card">
                <h2>🎉 Authentication Successful!</h2>
                <p>You have successfully logged into the Enhanced PERN application with Ghana-themed design.</p>
                <p><strong>Features:</strong></p>
                <ul>
                    <li>✅ Beautiful background images</li>
                    <li>✅ Glassmorphism card styling</li>
                    <li>✅ Ghana flag color scheme</li>
                    <li>✅ Working authentication</li>
                    <li>✅ Demo credentials</li>
                </ul>
            </div>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`🚀 Simple server running on http://localhost:${PORT}`);
    console.log(`📱 Register: http://localhost:${PORT}/register`);
    console.log(`🔐 Login: http://localhost:${PORT}/login`);
    console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard`);
});
