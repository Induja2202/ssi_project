const express = require('express');
const router = express.Router();
const {
  getDashboard,
  shareCredential,
  generateAgeProof
} = require('../controllers/holderController');
const { protect } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');

router.get('/dashboard', protect, checkRole('holder'), getDashboard);
router.post('/share/:credentialId', protect, checkRole('holder'), shareCredential);
router.post('/proof/age/:credentialId', protect, checkRole('holder'), generateAgeProof);

module.exports = router;