const express = require('express');
const router = express.Router();
const {
  getPendingRequests,
  issueCredentialToHolder,
  getIssuedCredentials,
  revokeCredential
} = require('../controllers/issuerController');
const { protect } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');

router.get('/requests', protect, checkRole('issuer'), getPendingRequests);
router.post('/issue/:credentialId', protect, checkRole('issuer'), issueCredentialToHolder);
router.get('/issued', protect, checkRole('issuer'), getIssuedCredentials);
router.post('/revoke/:credentialId', protect, checkRole('issuer'), revokeCredential);

module.exports = router;