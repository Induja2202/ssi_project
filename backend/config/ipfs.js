// Simulated IPFS Configuration
// No actual IPFS client needed

let ipfsClient = null;

const getIPFSClient = () => {
  if (!ipfsClient) {
    console.log('✅ IPFS Client initialized (SIMULATION MODE)');
    ipfsClient = {
      mode: 'simulation',
      status: 'ready'
    };
  }
  return ipfsClient;
};

module.exports = { getIPFSClient };
