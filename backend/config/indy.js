// Hyperledger Indy Configuration
// This file handles Indy SDK initialization

const indy = require('indy-sdk');

const indyConfig = {
  poolName: process.env.INDY_POOL_NAME || 'sandbox',
  genesisTxnPath: process.env.INDY_GENESIS_TXN_PATH || './indy_genesis.txn',
  walletConfig: { id: 'ssi_wallet' },
  walletCredentials: { key: process.env.INDY_WALLET_KEY || 'wallet_key' }
};

let poolHandle = null;
let walletHandle = null;

// Initialize Indy Pool
const initializePool = async () => {
  try {
    const poolConfig = {
      genesis_txn: indyConfig.genesisTxnPath
    };

    await indy.createPoolLedgerConfig(indyConfig.poolName, poolConfig);
    poolHandle = await indy.openPoolLedger(indyConfig.poolName);
    console.log('✅ Indy Pool initialized');
    return poolHandle;
  } catch (error) {
    if (error.message.includes('PoolLedgerConfigAlreadyExistsError')) {
      poolHandle = await indy.openPoolLedger(indyConfig.poolName);
      console.log('✅ Indy Pool opened (already exists)');
      return poolHandle;
    }
    console.error('❌ Indy Pool initialization failed:', error.message);
    throw error;
  }
};

// Initialize Wallet
const initializeWallet = async () => {
  try {
    await indy.createWallet(indyConfig.walletConfig, indyConfig.walletCredentials);
    walletHandle = await indy.openWallet(indyConfig.walletConfig, indyConfig.walletCredentials);
    console.log('✅ Indy Wallet initialized');
    return walletHandle;
  } catch (error) {
    if (error.message.includes('WalletAlreadyExistsError')) {
      walletHandle = await indy.openWallet(indyConfig.walletConfig, indyConfig.walletCredentials);
      console.log('✅ Indy Wallet opened (already exists)');
      return walletHandle;
    }
    console.error('❌ Indy Wallet initialization failed:', error.message);
    throw error;
  }
};

module.exports = {
  indyConfig,
  initializePool,
  initializeWallet,
  getPoolHandle: () => poolHandle,
  getWalletHandle: () => walletHandle
};