const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting CodeVA Application...');

// Start backend server
const backend = spawn('node', ['src/index.js'], {
  cwd: path.join(__dirname, 'server'),
  stdio: 'inherit',
  shell: true
});

// Start frontend server after a delay
setTimeout(() => {
  const frontend = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, 'client'),
    stdio: 'inherit',
    shell: true
  });

  frontend.on('error', (err) => {
    console.error('Frontend error:', err);
  });
}, 3000);

backend.on('error', (err) => {
  console.error('Backend error:', err);
});

console.log('Backend starting on http://localhost:5000');
console.log('Frontend will start on http://localhost:3000');
console.log('Press Ctrl+C to stop both servers');

process.on('SIGINT', () => {
  console.log('\nShutting down servers...');
  backend.kill();
  process.exit();
});
