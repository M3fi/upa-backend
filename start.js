const { spawn } = require('child_process');
const path = require('path');

const server = spawn('cmd.exe', ['/c', 'node', 'dist\\main.js'], {
  cwd: path.resolve(__dirname),
  stdio: ['pipe', 'inherit', 'inherit'],
  env: { ...process.env, PATH: process.env.PATH },
  shell: false,
});

server.on('error', (err) => {
  console.error('Failed to start:', err.message);
  process.exit(1);
});

process.on('SIGINT', () => { server.kill(); process.exit(); });
process.on('SIGTERM', () => { server.kill(); process.exit(); });

console.log(`Backend PID: ${server.pid}`);
