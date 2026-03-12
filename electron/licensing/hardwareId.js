const os = require('os');
const crypto = require('crypto');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

/**
 * Generate a unique, consistent hardware ID for this machine
 * Combines: hostname, MAC address, CPU model
 * Hashed with SHA-256 for consistency and privacy
 * 
 * NEVER expose this to frontend - keep in main process only
 */
async function getHardwareId() {
  try {
    console.log('[license] Generating hardware ID...');
    
    // 1. Get hostname
    const hostname = os.hostname();
    console.log('[license] Hostname:', hostname);

    // 2. Get MAC address (first network interface)
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
    console.log('[license] MAC address found:', macAddress ? 'YES' : 'NO');

    // 3. Get CPU model
    const cpus = os.cpus();
    const cpuModel = cpus.length > 0 ? cpus[0].model : 'UNKNOWN';
    console.log('[license] CPU model:', cpuModel);

    // 4. Combine all components
    const combined = `${hostname}|${macAddress}|${cpuModel}`;
    console.log('[license] Combined string created');

    // 5. Hash with SHA-256
    const hardwareId = crypto
      .createHash('sha256')
      .update(combined)
      .digest('hex');

    console.log('[license] Hardware ID generated (first 16 chars):', hardwareId.substring(0, 16) + '...');
    return hardwareId;

  } catch (err) {
    console.error('[license] Error generating hardware ID:', err);
    throw new Error('Failed to generate hardware ID: ' + err.message);
  }
}

module.exports = {
  getHardwareId
};
