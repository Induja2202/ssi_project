const { v4: uuidv4 } = require('uuid');
const Credential = require('../models/Credential');
const User = require('../models/User');
const { uploadToIPFS, retrieveFromIPFS } = require('../services/ipfsService');
const { issueCredential, anchorCredentialHash } = require('../services/blockchainService');
const { hashData } = require('../utils/encryption');
const { logActivity } = require('../utils/logger');

// @desc    Request credential (Holder -> Issuer)
// @route   POST /api/credential/request
// @access  Private (Holder only)
const requestCredential = async (req, res) => {
  try {
    const { issuerDID, credentialType, attributes } = req.body;
    const holderDID = req.user.did;

    if (!holderDID) {
      return res.status(400).json({
        success: false,
        message: 'Please create a DID first'
      });
    }

    // Find issuer
    const issuer = await User.findOne({ did: issuerDID, role: 'issuer' });
    if (!issuer) {
      return res.status(404).json({
        success: false,
        message: 'Issuer not found'
      });
    }

    // Create credential request
    const credentialId = `cred_${uuidv4()}`;
    const credential = await Credential.create({
      credentialId,
      schemaId: `schema_${credentialType}`,
      credDefId: `credDef_${credentialType}`,
      issuerDID,
      holderDID,
      attributes,
      credentialType,
      status: 'pending',
      ipfsHash: 'pending'
    });

    // Log activity
    await logActivity({
      userId: req.user._id,
      userDID: holderDID,
      activityType: 'credential_requested',
      credentialId,
      relatedUserDID: issuerDID,
      status: 'success',
      metadata: { credentialType }
    });

    res.status(201).json({
      success: true,
      message: 'Credential request submitted successfully',
      data: credential
    });
  } catch (error) {
    console.error('Request credential error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to request credential',
      error: error.message
    });
  }
};

// @desc    Get all credentials for holder
// @route   GET /api/credential/my-credentials
// @access  Private (Holder only)
const getMyCredentials = async (req, res) => {
  try {
    const holderDID = req.user.did;

    const credentials = await Credential.find({ holderDID }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: credentials.length,
      data: credentials
    });
  } catch (error) {
    console.error('Get credentials error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get credentials',
      error: error.message
    });
  }
};

// @desc    Get credential by ID
// @route   GET /api/credential/:credentialId
// @access  Private
const getCredentialById = async (req, res) => {
  try {
    const { credentialId } = req.params;
    const userDID = req.user.did;

    const credential = await Credential.findOne({ credentialId });

    if (!credential) {
      return res.status(404).json({
        success: false,
        message: 'Credential not found'
      });
    }

    // Check if user is authorized to view
    if (credential.holderDID !== userDID && credential.issuerDID !== userDID) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this credential'
      });
    }

    res.status(200).json({
      success: true,
      data: credential
    });
  } catch (error) {
    console.error('Get credential error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get credential',
      error: error.message
    });
  }
};

// @desc    Retrieve credential from IPFS
// @route   GET /api/credential/:credentialId/retrieve
// @access  Private
const retrieveCredentialFromIPFS = async (req, res) => {
  try {
    const { credentialId } = req.params;
    const userDID = req.user.did;

    const credential = await Credential.findOne({ credentialId });

    if (!credential) {
      return res.status(404).json({
        success: false,
        message: 'Credential not found'
      });
    }

    // Check authorization
    if (credential.holderDID !== userDID && credential.issuerDID !== userDID) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to retrieve this credential'
      });
    }

    // Retrieve from IPFS
    const credentialData = await retrieveFromIPFS(credential.ipfsHash);

    res.status(200).json({
      success: true,
      data: {
        credential,
        decryptedData: credentialData
      }
    });
  } catch (error) {
    console.error('Retrieve credential error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve credential from IPFS',
      error: error.message
    });
  }
};

module.exports = {
  requestCredential,
  getMyCredentials,
  getCredentialById,
  retrieveCredentialFromIPFS
};