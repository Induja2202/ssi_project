const crypto = require('crypto');

const algorithm = 'aes-256-cbc';

// Get key from environment or use default (ensure it's 32 bytes)
const getKey = () => {
  const envKey = process.env.ENCRYPTION_KEY || 'default_32_byte_key_change_this!!';
  // Ensure exactly 32 bytes
  const keyBuffer = Buffer.alloc(32);
  Buffer.from(envKey, 'utf8').copy(keyBuffer);
  return keyBuffer;
};

const key = getKey();

const encrypt = (text) => {
  try {
    // Handle different input types
    let dataToEncrypt;
    if (typeof text === 'string') {
      dataToEncrypt = text;
    } else if (typeof text === 'object') {
      dataToEncrypt = JSON.stringify(text);
    } else {
      dataToEncrypt = String(text);
    }

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    
    let encrypted = cipher.update(dataToEncrypt, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Return IV + encrypted data
    const result = iv.toString('hex') + ':' + encrypted;
    
    return result;
  } catch (error) {
    console.error('❌ Encryption error:', error);
    console.error('Input type:', typeof text);
    console.error('Input preview:', JSON.stringify(text).substring(0, 100));
    throw new Error('Encryption failed: ' + error.message);
  }
};

const decrypt = (text) => {
  try {
    if (!text || typeof text !== 'string') {
      throw new Error('Invalid encrypted data format');
    }

    const parts = text.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted data structure');
    }

    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = parts[1];
    
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    // Try to parse as JSON
    try {
      return JSON.parse(decrypted);
    } catch (e) {
      // Return as string if not JSON
      return decrypted;
    }
  } catch (error) {
    console.error('❌ Decryption error:', error);
    throw new Error('Decryption failed: ' + error.message);
  }
};

const hashData = (data) => {
  try {
    const dataString = typeof data === 'string' ? data : JSON.stringify(data);
    return crypto.createHash('sha256').update(dataString).digest('hex');
  } catch (error) {
    console.error('❌ Hashing error:', error);
    throw new Error('Hashing failed: ' + error.message);
  }
};

module.exports = { encrypt, decrypt, hashData };
