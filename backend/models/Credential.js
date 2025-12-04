const mongoose = require('mongoose');

const CredentialSchema = new mongoose.Schema({
  credentialId: {
    type: String,
    required: true,
    unique: true
  },
  schemaId: {
    type: String,
    required: true
  },
  credDefId: {
    type: String,
    required: true
  },
  issuerDID: {
    type: String,
    required: true,
    ref: 'User'
  },
  holderDID: {
    type: String,
    required: true,
    ref: 'User'
  },
  attributes: {
    type: Map,
    of: String,
    required: true
  },
  ipfsHash: {
    type: String,
    required: true
  },
  blockchainHash: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'issued', 'revoked'],
    default: 'pending'
  },
  issuedAt: {
    type: Date
  },
  revokedAt: {
    type: Date
  },
  revocationReason: {
    type: String
  },
  credentialType: {
    type: String,
    required: true
  },
  expiryDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
CredentialSchema.index({ holderDID: 1, status: 1 });
CredentialSchema.index({ issuerDID: 1, status: 1 });
CredentialSchema.index({ credentialId: 1 });

module.exports = mongoose.model('Credential', CredentialSchema);