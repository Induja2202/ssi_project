// Simulated IPFS Service (no actual IPFS dependency)
const { encrypt, decrypt } = require('../utils/encryption');
const { v4: uuidv4 } = require('uuid');

// In-memory storage for simulation
const ipfsStorage = new Map();

// Upload encrypted data to "IPFS" (simulated)
const uploadToIPFS = async (data) => {
  try {
    // Encrypt data before uploading
    const encryptedData = encrypt(data);
    
    // Generate fake IPFS hash
    const ipfsHash = `Qm${uuidv4().replace(/-/g, '')}`;
    
    // Store in memory (simulating IPFS)
    ipfsStorage.set(ipfsHash, encryptedData);
    
    console.log(`✅ [SIMULATION] Data uploaded to IPFS: ${ipfsHash}`);
    return ipfsHash;
  } catch (error) {
    console.error('IPFS upload error:', error);
    throw new Error('Failed to upload to IPFS');
  }
};

// Retrieve and decrypt data from "IPFS" (simulated)
const retrieveFromIPFS = async (hash) => {
  try {
    // Retrieve from memory
    const encryptedData = ipfsStorage.get(hash);
    
    if (!encryptedData) {
      throw new Error('Data not found in IPFS');
    }
    
    // Decrypt data
    const decryptedData = decrypt(encryptedData);
    
    console.log(`✅ [SIMULATION] Data retrieved from IPFS: ${hash}`);
    return decryptedData;
  } catch (error) {
    console.error('IPFS retrieval error:', error);
    throw new Error('Failed to retrieve from IPFS');
  }
};

// Check if IPFS is available (always returns connected in simulation)
const checkIPFSStatus = async () => {
  return { 
    status: 'connected (simulation)', 
    version: 'simulated-1.0.0',
    mode: 'in-memory-storage'
  };
};

module.exports = {
  uploadToIPFS,
  retrieveFromIPFS,
  checkIPFSStatus
};
