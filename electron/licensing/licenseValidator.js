const fs = require('fs');
const path = require('path');
const { getHardwareId } = require('./hardwareId');
const { encryptLicense, decryptLicense, generateSignature, verifySignature } = require('./encryption');

// Store last known timestamp for clock skew detection
let lastRunTimestamp = 0;

/**
 * Initialize license system on app startup
 * @param {Object} app - Electron app instance
 * @returns {Promise<Boolean>} true if valid license found, false if activation needed
 */
async function initializeLicense(app) {
  try {
    console.log('[license] Initializing license system...');
    
    const licensePath = path.join(app.getPath('userData'), 'license.dat');
    console.log('[license] License file path:', licensePath);
    
    // Check if license file exists
    if (!fs.existsSync(licensePath)) {
      console.log('[license] No license file found - activation required');
      return false;
    }
    
    console.log('[license] License file found - validating...');
    
    // Validate existing license
    const isValid = await validateLicense(app);
    
    if (isValid) {
      console.log('[license] License validated successfully');
      return true;
    } else {
      console.log('[license] License validation failed - activation required');
      return false;
    }
    
  } catch (err) {
    console.error('[license] License init error:', err.message);
    return false;
  }
}

/**
 * Validate existing license
 * Checks:
 * 1. Hardware ID matches
 * 2. License not expired
 * 3. Signature is valid
 * 4. System clock not moved backwards
 */
async function validateLicense(app) {
  try {
    console.log('[license] Validating license...');
    
    const licensePath = path.join(app.getPath('userData'), 'license.dat');
    
    if (!fs.existsSync(licensePath)) {
      console.log('[license] License file does not exist');
      return false;
    }
    
    // Read encrypted license
    const encryptedData = fs.readFileSync(licensePath, 'utf8');
    
    // Decrypt license
    let license;
    try {
      license = decryptLicense(encryptedData);
    } catch (err) {
      console.error('[license] Failed to decrypt license:', err.message);
      return false;
    }
    
    console.log('[license] License decrypted');
    
    // Verify signature
    const licenseData = {
      hardwareId: license.hardwareId,
      customerId: license.customerId,
      expiry: license.expiry
    };
    
    try {
      verifySignature(licenseData, license.signature);
      console.log('[license] Signature verified');
    } catch (err) {
      console.error('[license] Signature verification failed:', err.message);
      return false;
    }
    
    // Get current hardware ID
    const currentHardwareId = await getHardwareId();
    
    // Check if hardware ID matches
    if (license.hardwareId !== currentHardwareId) {
      console.error('[license] Hardware ID mismatch!');
      console.error('[license] Expected:', license.hardwareId.substring(0, 16) + '...');
      console.error('[license] Got:', currentHardwareId.substring(0, 16) + '...');
      return false;
    }
    
    console.log('[license] Hardware ID matches');
    
    // Check expiry date
    const now = Date.now();
    const expiryTime = new Date(license.expiry).getTime();
    
    if (now > expiryTime) {
      console.error('[license] License expired on:', license.expiry);
      return false;
    }
    
    console.log('[license] License expires on:', license.expiry);
    
    // Check for system clock skew (clock moving backwards)
    if (lastRunTimestamp > 0 && now < lastRunTimestamp) {
      console.error('[license] SECURITY ALERT: System clock moved backwards!');
      console.error('[license] Last run:', new Date(lastRunTimestamp));
      console.error('[license] Current:', new Date(now));
      return false;
    }
    
    // Update last known timestamp
    lastRunTimestamp = now;
    
    console.log('[license] License is valid');
    return true;
    
  } catch (err) {
    console.error('[license] Validation error:', err.message);
    return false;
  }
}

/**
 * Activate license with provided key
 * Generates signed, encrypted license file
 */
async function activateLicense(app, licenseKey) {
  try {
    console.log('[license] Processing license key...');
    
    // ---- PLACEHOLDER: In production, verify key against server ----
    // For demo, we'll accept any key in format: XXXX-XXXX-XXXX-XXXX
    // Real implementation would: validate against backend, get customer info
    
    if (!licenseKey || typeof licenseKey !== 'string') {
      throw new Error('Invalid license key format');
    }
    
    // Validate key format (basic check)
    const keyRegex = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/i;
    if (!keyRegex.test(licenseKey)) {
      throw new Error('License key format invalid. Expected: XXXX-XXXX-XXXX-XXXX');
    }
    
    console.log('[license] License key format valid');
    
    // Get hardware ID for THIS machine
    const hardwareId = await getHardwareId();
    console.log('[license] Hardware ID generated');
    
    // Calculate 1-year expiry date
    const now = new Date();
    const expiry = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
    
    // Create license object (data to sign)
    const licenseData = {
      hardwareId: hardwareId,
      customerId: 'CUSTOMER-' + licenseKey.replace(/-/g, ''),
      expiry: expiry.toISOString()
    };
    
    // Generate signature
    const signature = generateSignature(licenseData);
    
    // Create complete license object
    const license = {
      ...licenseData,
      signature: signature,
      activatedAt: new Date().toISOString()
    };
    
    // Encrypt license
    const encrypted = encryptLicense(license);
    console.log('[license] License encrypted');
    
    // Save to file
    const licensePath = path.join(app.getPath('userData'), 'license.dat');
    fs.writeFileSync(licensePath, encrypted, 'utf8');
    
    console.log('[license] License saved to:', licensePath);
    
    // Update timestamp
    lastRunTimestamp = Date.now();
    
    return {
      success: true,
      message: 'License activated successfully',
      expiry: license.expiry
    };
    
  } catch (err) {
    console.error('[license] Activation error:', err.message);
    return {
      success: false,
      message: err.message
    };
  }
}

/**
 * Revoke license (for uninstall/reset)
 */
function revokeLicense(app) {
  try {
    const licensePath = path.join(app.getPath('userData'), 'license.dat');
    if (fs.existsSync(licensePath)) {
      fs.unlinkSync(licensePath);
      console.log('[license] License revoked');
      return true;
    }
    return false;
  } catch (err) {
    console.error('[license] Revoke error:', err.message);
    return false;
  }
}

module.exports = {
  initializeLicense,
  validateLicense,
  activateLicense,
  revokeLicense
};
