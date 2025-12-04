const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');

/**
 * Create a wallet for a user
 * @param {String} userId - User ID
 * @param {String} did - User's DID
 * @returns {Object} - Wallet details
 */
const createWallet = async (userId, did) => {
  try {
    const walletId = `wallet_${uuidv4()}`;
    
    // In production, this would create an actual Indy wallet
    // For now, we simulate by storing wallet ID in user document
    
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.walletId = walletId;
    user.did = did;
    await user.save();

    console.log(`✅ Wallet created for user: ${user.username}`);
    
    return {
      walletId,
      did,
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Wallet creation error:', error);
    throw new Error('Failed to create wallet');
  }
};

/**
 * Get wallet details
 * @param {String} walletId - Wallet ID
 * @returns {Object} - Wallet details
 */
const getWalletDetails = async (walletId) => {
  try {
    const user = await User.findOne({ walletId });
    
    if (!user) {
      throw new Error('Wallet not found');
    }

    return {
      walletId: user.walletId,
      did: user.did,
      verkey: user.verkey,
      owner: user.username,
      role: user.role
    };
  } catch (error) {
    console.error('Get wallet error:', error);
    throw new Error('Failed to retrieve wallet details');
  }
};

module.exports = {
  createWallet,
  getWalletDetails
};