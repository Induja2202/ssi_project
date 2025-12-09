// Hyperledger Indy Configuration
// This file handles Indy SDK initialization
// Currently running in SIMULATION mode - no real Indy SDK needed

// const indy = require('indy-sdk'); // Not needed in simulation mode

const indyConfig = {
  poolName: process.env.INDY_POOL_NAME || 'sandbox',
  genesisTxnPath: process.env.INDY_GENESIS_TXN_PATH || './indy_genesis.txn',
  walletConfig: { id: 'ssi_wallet' },
  walletCredentials: { key: process.env.INDY_WALLET_KEY || 'wallet_key' }
};

let poolHandle = null;
let walletHandle = null;

// Initialize Indy Pool (Simulation - returns null)
const initializePool = async () => {
  console.log('⚠️ Running in SIMULATION mode - no real Indy pool initialization');
  return null;
};

// Initialize Wallet (Simulation - returns null)
const initializeWallet = async () => {
  console.log('⚠️ Running in SIMULATION mode - no real Indy wallet initialization');
  return null;
};

module.exports = {
  indyConfig,
  initializePool,
  initializeWallet,
  getPoolHandle: () => poolHandle,
  getWalletHandle: () => walletHandle
};
