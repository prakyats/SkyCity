const { networkInterfaces } = require('os');
const { spawn } = require('child_process');

const nets = networkInterfaces();
let ip = 'localhost';

for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
    // Skip internal (i.e. 127.0.0.1) and non-ipv4 addresses
    if (net.family === 'IPv4' && !net.internal) {
      // Prioritize the Wi-Fi or Ethernet adapter if possible
      if (name.toLowerCase().includes('wi-fi') || name.toLowerCase().includes('ethernet')) {
        ip = net.address;
        break;
      }
      ip = net.address;
    }
  }
}

console.log('\x1b[36m%s\x1b[0m', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('\x1b[32m%s\x1b[0m', ' 📱 NETWORK ACCESS ENABLED');
console.log('\x1b[36m%s\x1b[0m', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`\n  Connect on your phone: \x1b[1mhttp://${ip}:3000\x1b[0m\n`);
console.log('\x1b[36m%s\x1b[0m', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Start the actual next dev server
const nextDev = spawn('npx next dev -H 0.0.0.0', { 
  stdio: 'inherit',
  shell: true
});

nextDev.on('exit', (code) => {
  process.exit(code);
});
