// Simulated IPFS Service (no actual IPFS dependency)
const { encrypt, decrypt } = require('../utils/encryption');
const { v4: uuidv4 } = require('uuid');

// In-memory storage for simulation
const ipfsStorage = new Map();

// Upload encrypted data to "IPFS" (simulated)
const uploadToIPFS = async (data) => {
  try {
    console.log('📤 Attempting to upload to IPFS...');
    console.log('Data to upload:', JSON.stringify(data).substring(0, 100) + '...');
    
    // Validate data
    if (!data) {
      throw new Error('No data provided for IPFS upload');
    }

    // Encrypt data before uploading
    let encryptedData;
    try {
      encryptedData = encrypt(data);
      console.log('✅ Data encrypted successfully');
    } catch (encryptError) {
      console.error('Encryption failed:', encryptError);
      throw new Error('Failed to encrypt data: ' + encryptError.message);
    }
    
    // Generate fake IPFS hash (CID)
    const ipfsHash = `Qm${uuidv4().replace(/-/g, '')}`;
    
    // Store in memory (simulating IPFS)
    ipfsStorage.set(ipfsHash, encryptedData);
    
    console.log(`✅ [SIMULATION] Data uploaded to IPFS: ${ipfsHash}`);
    console.log(`📊 Storage size: ${ipfsStorage.size} items`);
    
    return ipfsHash;
  } catch (error) {
    console.error('❌ IPFS upload error:', error);
    console.error('Error stack:', error.stack);
    throw new Error('Failed to upload to IPFS: ' + error.message);
  }
};

// Retrieve and decrypt data from "IPFS" (simulated)
const retrieveFromIPFS = async (hash) => {
  try {
    console.log(`📥 Attempting to retrieve from IPFS: ${hash}`);
    
    // Retrieve from memory
    const encryptedData = ipfsStorage.get(hash);
    
    if (!encryptedData) {
      console.error(`❌ Data not found for hash: ${hash}`);
      throw new Error('Data not found in IPFS');
    }
    
    console.log('✅ Encrypted data found');
    
    // Decrypt data
    let decryptedData;
    try {
      decryptedData = decrypt(encryptedData);
      console.log('✅ Data decrypted successfully');
    } catch (decryptError) {
      console.error('Decryption failed:', decryptError);
      throw new Error('Failed to decrypt data: ' + decryptError.message);
    }
    
    console.log(`✅ [SIMULATION] Data retrieved from IPFS: ${hash}`);
    return decryptedData;
  } catch (error) {
    console.error('❌ IPFS retrieval error:', error);
    throw new Error('Failed to retrieve from IPFS: ' + error.message);
  }
};

// Check if IPFS is available (always returns connected in simulation)
const checkIPFSStatus = async () => {
  return { 
    status: 'connected (simulation)', 
    version: 'simulated-1.0.0',
    mode: 'in-memory-storage',
    itemsStored: ipfsStorage.size
  };
};

// Clear storage (for testing)
const clearStorage = () => {
  ipfsStorage.clear();
  console.log('🗑️ IPFS storage cleared');
};

module.exports = {
  uploadToIPFS,
  retrieveFromIPFS,
  checkIPFSStatus,
  clearStorage
};
