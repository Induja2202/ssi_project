const User = require('../models/User');
const { createDID, writeNymToLedger } = require('../services/blockchainService');
const { createWallet } = require('../services/walletService');
const { logActivity } = require('../utils/logger');

// @desc    Create DID for user
// @route   POST /api/did/create
// @access  Private
const createUserDID = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    // Check if user already has DID
    if (user.did) {
      return res.status(400).json({
        success: false,
        message: 'User already has a DID',
        data: { 
          did: user.did, 
          verkey: user.verkey,
          walletId: user.walletId 
        }
      });
    }

    // Create DID on blockchain
    const { did, verkey } = await createDID();

    // Write to ledger
    await writeNymToLedger(did, verkey, user.role);

    // Create wallet - THIS IS THE FIX
    const walletData = await createWallet(userId, did);

    // Update user with DID and verkey
    user.did = did;
    user.verkey = verkey;
    // walletId is already set by createWallet function
    await user.save();

    // Refresh user data to get walletId
    const updatedUser = await User.findById(userId);

    // Log activity
    await logActivity({
      userId: user._id,
      userDID: did,
      activityType: 'did_created',
      status: 'success',
      metadata: { verkey, walletId: updatedUser.walletId }
    });

    res.status(201).json({
      success: true,
      message: 'DID created successfully',
      data: {
        did: updatedUser.did,
        verkey: updatedUser.verkey,
        walletId: updatedUser.walletId  // Now included
      }
    });
  } catch (error) {
    console.error('DID creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create DID',
      error: error.message
    });
  }
};

// @desc    Get user DID details
// @route   GET /api/did/me
// @access  Private
const getMyDID = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.did) {
      return res.status(404).json({
        success: false,
        message: 'DID not found. Please create a DID first.'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        did: user.did,
        verkey: user.verkey,
        walletId: user.walletId,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Get DID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get DID',
      error: error.message
    });
  }
};

// @desc    Resolve DID (get public info)
// @route   GET /api/did/resolve/:did
// @access  Public
const resolveDID = async (req, res) => {
  try {
    const { did } = req.params;

    const user = await User.findOne({ did }).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'DID not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        did: user.did,
        verkey: user.verkey,
        role: user.role,
        organization: user.organization,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Resolve DID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resolve DID',
      error: error.message
    });
  }
};

module.exports = {
  createUserDID,
  getMyDID,
  resolveDID
};
