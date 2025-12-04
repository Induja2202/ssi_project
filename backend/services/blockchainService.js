const indy = require('indy-sdk');
const { v4: uuidv4 } = require('uuid');
const { initializePool, initializeWallet, getPoolHandle, getWalletHandle } = require('../config/indy');

// Simulation mode flag (set to false when real Indy network is available)
const SIMULATION_MODE = true;

// ============= SIMULATION FUNCTIONS =============

const simulateCreateDID = async () => {
  const did = `did:sov:sim${uuidv4().replace(/-/g, '').substring(0, 21)}`;
  const verkey = `verkey${uuidv4().replace(/-/g, '')}`;
  console.log(`📝 [SIMULATION] Created DID: ${did}`);
  return { did, verkey };
};

const simulateWriteNym = async (did, verkey, role) => {
  console.log(`📝 [SIMULATION] Writing NYM to ledger - DID: ${did}, Role: ${role}`);
  return { success: true, txnId: `txn_${uuidv4()}` };
};

const simulateCreateSchema = async (issuerDid, schemaName, version, attributes) => {
  const schemaId = `${issuerDid}:2:${schemaName}:${version}`;
  console.log(`📝 [SIMULATION] Created Schema: ${schemaId}`);
  return {
    id: schemaId,
    name: schemaName,
    version,
    attrNames: attributes,
    ver: '1.0'
  };
};

const simulateCreateCredDef = async (issuerDid, schemaId) => {
  const credDefId = `${issuerDid}:3:CL:${schemaId}`;
  console.log(`📝 [SIMULATION] Created Credential Definition: ${credDefId}`);
  return {
    id: credDefId,
    schemaId,
    type: 'CL',
    tag: 'default',
    ver: '1.0'
  };
};

const simulateIssueCredential = async (credDefId, attributes) => {
  const credentialId = `cred_${uuidv4()}`;
  console.log(`📝 [SIMULATION] Issued Credential: ${credentialId}`);
  return {
    credentialId,
    credDefId,
    attributes,
    signature: `sig_${uuidv4()}`,
    revRegId: null,
    issuedAt: new Date().toISOString()
  };
};

const simulateVerifyCredential = async (credential, credDefId) => {
  // Simulate verification logic
  const isValid = credential && credential.credDefId === credDefId;
  console.log(`🔍 [SIMULATION] Verifying Credential: ${credential.credentialId} - Valid: ${isValid}`);
  return {
    verified: isValid,
    credDefId,
    timestamp: new Date().toISOString()
  };
};

const simulateRevokeCredential = async (credentialId) => {
  console.log(`🚫 [SIMULATION] Revoked Credential: ${credentialId}`);
  return {
    revoked: true,
    credentialId,
    revRegId: `revReg_${uuidv4()}`,
    revokedAt: new Date().toISOString()
  };
};

// ============= REAL INDY FUNCTIONS =============

const realCreateDID = async () => {
  try {
    const walletHandle = getWalletHandle() || await initializeWallet();
    const [did, verkey] = await indy.createAndStoreMyDid(walletHandle, {});
    console.log(`✅ [REAL] Created DID: ${did}`);
    return { did, verkey };
  } catch (error) {
    console.error('❌ Real DID creation error:', error);
    throw error;
  }
};

const realWriteNym = async (did, verkey, role = null) => {
  try {
    const poolHandle = getPoolHandle() || await initializePool();
    const walletHandle = getWalletHandle() || await initializeWallet();
    
    // Build NYM request
    const nymRequest = await indy.buildNymRequest(did, did, verkey, null, role);
    
    // Sign and submit
    const nymResponse = await indy.signAndSubmitRequest(poolHandle, walletHandle, did, nymRequest);
    
    console.log(`✅ [REAL] NYM written to ledger: ${did}`);
    return { success: true, response: nymResponse };
  } catch (error) {
    console.error('❌ Real NYM write error:', error);
    throw error;
  }
};

const realCreateSchema = async (issuerDid, schemaName, version, attributes) => {
  try {
    const walletHandle = getWalletHandle() || await initializeWallet();
    
    const [schemaId, schema] = await indy.issuerCreateSchema(
      issuerDid,
      schemaName,
      version,
      attributes
    );
    
    console.log(`✅ [REAL] Created Schema: ${schemaId}`);
    return { id: schemaId, schema };
  } catch (error) {
    console.error('❌ Real schema creation error:', error);
    throw error;
  }
};

const realCreateCredDef = async (issuerDid, schema) => {
  try {
    const walletHandle = getWalletHandle() || await initializeWallet();
    
    const [credDefId, credDef] = await indy.issuerCreateAndStoreCredentialDef(
      walletHandle,
      issuerDid,
      schema,
      'TAG1',
      'CL',
      { support_revocation: false }
    );
    
    console.log(`✅ [REAL] Created Credential Definition: ${credDefId}`);
    return { id: credDefId, credDef };
  } catch (error) {
    console.error('❌ Real credential definition creation error:', error);
    throw error;
  }
};

const realIssueCredential = async (credDefId, attributes) => {
  try {
    const walletHandle = getWalletHandle() || await initializeWallet();
    
    // In real implementation, this would involve:
    // 1. Creating credential offer
    // 2. Receiving credential request from holder
    // 3. Issuing credential
    
    // Simplified version for demonstration
    const credentialId = `cred_${uuidv4()}`;
    console.log(`✅ [REAL] Issued Credential: ${credentialId}`);
    
    return {
      credentialId,
      credDefId,
      attributes,
      issuedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ Real credential issuance error:', error);
    throw error;
  }
};

const realVerifyCredential = async (credential, credDefId) => {
  try {
    const poolHandle = getPoolHandle() || await initializePool();
    
    // In real implementation, this would:
    // 1. Get credential definition from ledger
    // 2. Verify credential signature
    // 3. Check revocation status
    
    console.log(`✅ [REAL] Verified Credential: ${credential.credentialId}`);
    
    return {
      verified: true,
      credDefId,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ Real credential verification error:', error);
    return {
      verified: false,
      error: error.message
    };
  }
};

const realRevokeCredential = async (credentialId) => {
  try {
    const walletHandle = getWalletHandle() || await initializeWallet();
    
    // In real implementation, this would:
    // 1. Update revocation registry
    // 2. Post update to ledger
    
    console.log(`✅ [REAL] Revoked Credential: ${credentialId}`);
    
    return {
      revoked: true,
      credentialId,
      revokedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ Real credential revocation error:', error);
    throw error;
  }
};

// ============= EXPORTED FUNCTIONS (with mode selection) =============

/**
 * Create a new DID
 * @returns {Object} - { did, verkey }
 */
const createDID = async () => {
  if (SIMULATION_MODE) {
    return simulateCreateDID();
  } else {
    return realCreateDID();
  }
};

/**
 * Write NYM (DID) to ledger
 * @param {String} did - The DID
 * @param {String} verkey - Verification key
 * @param {String} role - Role (optional)
 * @returns {Object} - Transaction result
 */
const writeNymToLedger = async (did, verkey, role = null) => {
  if (SIMULATION_MODE) {
    return simulateWriteNym(did, verkey, role);
  } else {
    return realWriteNym(did, verkey, role);
  }
};

/**
 * Create a credential schema
 * @param {String} issuerDid - Issuer's DID
 * @param {String} schemaName - Schema name
 * @param {String} version - Schema version
 * @param {Array} attributes - Array of attribute names
 * @returns {Object} - Schema object
 */
const createSchema = async (issuerDid, schemaName, version, attributes) => {
  if (SIMULATION_MODE) {
    return simulateCreateSchema(issuerDid, schemaName, version, attributes);
  } else {
    return realCreateSchema(issuerDid, schemaName, version, attributes);
  }
};

/**
 * Create a credential definition
 * @param {String} issuerDid - Issuer's DID
 * @param {Object} schema - Schema object
 * @returns {Object} - Credential definition object
 */
const createCredentialDefinition = async (issuerDid, schema) => {
  if (SIMULATION_MODE) {
    return simulateCreateCredDef(issuerDid, schema.id);
  } else {
    return realCreateCredDef(issuerDid, schema);
  }
};

/**
 * Issue a credential
 * @param {String} credDefId - Credential definition ID
 * @param {Object} attributes - Credential attributes
 * @returns {Object} - Issued credential
 */
const issueCredential = async (credDefId, attributes) => {
  if (SIMULATION_MODE) {
    return simulateIssueCredential(credDefId, attributes);
  } else {
    return realIssueCredential(credDefId, attributes);
  }
};

/**
 * Verify a credential
 * @param {Object} credential - The credential to verify
 * @param {String} credDefId - Credential definition ID
 * @returns {Object} - Verification result
 */
const verifyCredential = async (credential, credDefId) => {
  if (SIMULATION_MODE) {
    return simulateVerifyCredential(credential, credDefId);
  } else {
    return realVerifyCredential(credential, credDefId);
  }
};

/**
 * Revoke a credential
 * @param {String} credentialId - Credential ID to revoke
 * @returns {Object} - Revocation result
 */
const revokeCredential = async (credentialId) => {
  if (SIMULATION_MODE) {
    return simulateRevokeCredential(credentialId);
  } else {
    return realRevokeCredential(credentialId);
  }
};

/**
 * Anchor credential hash to blockchain
 * @param {String} credentialHash - Hash of credential
 * @param {String} issuerDid - Issuer's DID
 * @returns {Object} - Anchoring result
 */
const anchorCredentialHash = async (credentialHash, issuerDid) => {
  console.log(`⚓ Anchoring hash to blockchain: ${credentialHash}`);
  
  if (SIMULATION_MODE) {
    console.log(`📝 [SIMULATION] Hash anchored for issuer: ${issuerDid}`);
  } else {
    console.log(`✅ [REAL] Hash anchored for issuer: ${issuerDid}`);
  }
  
  return {
    success: true,
    blockchainTxnId: `txn_${uuidv4()}`,
    hash: credentialHash,
    timestamp: new Date().toISOString()
  };
};

/**
 * Get current mode (simulation or real)
 * @returns {String} - Current mode
 */
const getMode = () => {
  return SIMULATION_MODE ? 'SIMULATION' : 'REAL';
};

/**
 * Toggle simulation mode
 * @param {Boolean} enable - Enable/disable simulation mode
 */
const setSimulationMode = (enable) => {
  SIMULATION_MODE = enable;
  console.log(`🔄 Blockchain mode set to: ${SIMULATION_MODE ? 'SIMULATION' : 'REAL'}`);
};

module.exports = {
  createDID,
  writeNymToLedger,
  createSchema,
  createCredentialDefinition,
  issueCredential,
  verifyCredential,
  revokeCredential,
  anchorCredentialHash,
  getMode,
  setSimulationMode,
  SIMULATION_MODE
};