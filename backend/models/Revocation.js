const mongoose = require('mongoose');

const RevocationSchema = new mongoose.Schema({
  credentialId: {
    type: String,
    required: true,
    unique: true
  },
  revRegId: {
    type: String,
    required: true
  },
  revRegDefId: {
    type: String,
    required: true
  },
  credRevId: {
    type: String,
    required: true
  },
  issuerDID: {
    type: String,
    required: true
  },
  holderDID: {
    type: String,
    required: true
  },
  revokedAt: {
    type: Date,
    default: Date.now
  },
  reason: {
    type: String,
    required: true
  },
  revokedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  blockchainTxnId: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Index for efficient queries
RevocationSchema.index({ credentialId: 1 });
RevocationSchema.index({ revRegId: 1 });
RevocationSchema.index({ holderDID: 1 });

module.exports = mongoose.model('Revocation', RevocationSchema);