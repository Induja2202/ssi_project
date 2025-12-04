const express = require('express');
const router = express.Router();
const { createUserDID, getMyDID, resolveDID } = require('../controllers/didController');
const { protect } = require('../middleware/auth');

router.post('/create', protect, createUserDID);
router.get('/me', protect, getMyDID);
router.get('/resolve/:did', resolveDID);

module.exports = router;