const { create } = require('ipfs-http-client');

let ipfsClient = null;

const getIPFSClient = () => {
  if (!ipfsClient) {
    try {
      ipfsClient = create({
        host: process.env.IPFS_HOST || 'localhost',
        port: process.env.IPFS_PORT || 5001,
        protocol: process.env.IPFS_PROTOCOL || 'http'
      });
      console.log('✅ IPFS Client initialized');
    } catch (error) {
      console.error('❌ IPFS Client initialization failed:', error.message);
      throw error;
    }
  }
  return ipfsClient;
};

module.exports = { getIPFSClient };