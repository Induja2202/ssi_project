const { getIPFSClient } = require('../config/ipfs');
const { encrypt, decrypt } = require('../utils/encryption');

// Upload encrypted data to IPFS
const uploadToIPFS = async (data) => {
  try {
    const ipfs = getIPFSClient();
    
    // Encrypt data before uploading
    const encryptedData = encrypt(data);
    
    // Convert to buffer
    const buffer = Buffer.from(encryptedData);
    
    // Add to IPFS
    const result = await ipfs.add(buffer);
    
    console.log(`✅ Data uploaded to IPFS: ${result.path}`);
    return result.path; // Returns IPFS hash (CID)
  } catch (error) {
    console.error('IPFS upload error:', error);
    throw new Error('Failed to upload to IPFS');
  }
};

// Retrieve and decrypt data from IPFS
const retrieveFromIPFS = async (hash) => {
  try {
    const ipfs = getIPFSClient();
    
    // Retrieve from IPFS
    const chunks = [];
    for await (const chunk of ipfs.cat(hash)) {
      chunks.push(chunk);
    }
    
    const buffer = Buffer.concat(chunks);
    const encryptedData = buffer.toString();
    
    // Decrypt data
    const decryptedData = decrypt(encryptedData);
    
    console.log(`✅ Data retrieved from IPFS: ${hash}`);
    return decryptedData;
  } catch (error) {
    console.error('IPFS retrieval error:', error);
    throw new Error('Failed to retrieve from IPFS');
  }
};

// Check if IPFS is available
const checkIPFSStatus = async () => {
  try {
    const ipfs = getIPFSClient();
    const version = await ipfs.version();
    return { status: 'connected', version: version.version };
  } catch (error) {
    return { status: 'disconnected', error: error.message };
  }
};

module.exports = {
  uploadToIPFS,
  retrieveFromIPFS,
  checkIPFSStatus
};