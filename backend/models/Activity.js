const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userDID: {
    type: String,
    required: true
  },
  activityType: {
    type: String,
    enum: [
      'did_created',
      'wallet_created',
      'credential_requested',
      'credential_issued',
      'credential_received',
      'credential_shared',
      'credential_verified',
      'credential_revoked',
      'login',
      'logout'
    ],
    required: true
  },
  credentialId: {
    type: String
  },
  relatedUserDID: {
    type: String
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  status: {
    type: String,
    enum: ['success', 'failed', 'pending'],
    default: 'success'
  },
  errorMessage: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
ActivitySchema.index({ userId: 1, timestamp: -1 });
ActivitySchema.index({ userDID: 1, timestamp: -1 });
ActivitySchema.index({ credentialId: 1 });

module.exports = mongoose.model('Activity', ActivitySchema);