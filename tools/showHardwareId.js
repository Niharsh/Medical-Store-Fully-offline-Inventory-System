const os = require('os');
const crypto = require('crypto');

function getHardwareId() {
  const hostname = os.hostname();
  
  const networks = os.networkInterfaces();
  let macAddress = '';
  for (const name in networks) {
    const interfaces = networks[name];
    for (const iface of interfaces) {
      if (iface.family === 'IPv4' && !iface.internal) {
        macAddress = iface.mac;
        break;
      }
    }
    if (macAddress) break;
  }
  
  const cpus = os.cpus();
  const cpuModel = cpus.length > 0 ? cpus[0].model : 'UNKNOWN';
  
  const combined = `${hostname}|${macAddress}|${cpuModel}`;
  const hardwareId = crypto
    .createHash('sha256')
    .update(combined)
    .digest('hex');

  console.log('\n=== Hardware Info ===');
  console.log('Hostname  :', hostname);
  console.log('MAC       :', macAddress || 'NOT FOUND');
  console.log('CPU       :', cpuModel);
  console.log('\n=== Hardware ID ===');
  console.log(hardwareId);
  console.log('\nFirst 16  :', hardwareId.substring(0, 16) + '...');
  
  return hardwareId;
}

getHardwareId();