const express = require('express');
const router = express.Router();
const {
  requestCredential,
  getMyCredentials,
  getCredentialById,
  retrieveCredentialFromIPFS
} = require('../controllers/credentialController');
const { protect } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');

router.post('/request', protect, checkRole('holder'), requestCredential);
router.get('/my-credentials', protect, checkRole('holder'), getMyCredentials);
router.get('/:credentialId', protect, getCredentialById);
router.get('/:credentialId/retrieve', protect, retrieveCredentialFromIPFS);

module.exports = router;