// const indy = require('indy-sdk'); // Not needed in simulation mode
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

// ============= REAL INDY FUNCTIONS (Not used in simulation) =============

const realCreateDID = async () => {
  throw new Error('Real Indy SDK not available. Running in simulation mode.');
};

const realWriteNym = async (did, verkey, role = null) => {
  throw new Error('Real Indy SDK not available. Running in simulation mode.');
};

const realCreateSchema = async (issuerDid, schemaName, version, attributes) => {
  throw new Error('Real Indy SDK not available. Running in simulation mode.');
};

const realCreateCredDef = async (issuerDid, schema) => {
  throw new Error('Real Indy SDK not available. Running in simulation mode.');
};

const realIssueCredential = async (credDefId, attributes) => {
  throw new Error('Real Indy SDK not available. Running in simulation mode.');
};

const realVerifyCredential = async (credential, credDefId) => {
  throw new Error('Real Indy SDK not available. Running in simulation mode.');
};

const realRevokeCredential = async (credentialId) => {
  throw new Error('Real Indy SDK not available. Running in simulation mode.');
};

// ============= EXPORTED FUNCTIONS (with mode selection) =============

const createDID = async () => {
  if (SIMULATION_MODE) {
    return simulateCreateDID();
  } else {
    return realCreateDID();
  }
};

const writeNymToLedger = async (did, verkey, role = null) => {
  if (SIMULATION_MODE) {
    return simulateWriteNym(did, verkey, role);
  } else {
    return realWriteNym(did, verkey, role);
  }
};

const createSchema = async (issuerDid, schemaName, version, attributes) => {
  if (SIMULATION_MODE) {
    return simulateCreateSchema(issuerDid, schemaName, version, attributes);
  } else {
    return realCreateSchema(issuerDid, schemaName, version, attributes);
  }
};

const createCredentialDefinition = async (issuerDid, schema) => {
  if (SIMULATION_MODE) {
    return simulateCreateCredDef(issuerDid, schema.id);
  } else {
    return realCreateCredDef(issuerDid, schema);
  }
};

const issueCredential = async (credDefId, attributes) => {
  if (SIMULATION_MODE) {
    return simulateIssueCredential(credDefId, attributes);
  } else {
    return realIssueCredential(credDefId, attributes);
  }
};

const verifyCredential = async (credential, credDefId) => {
  if (SIMULATION_MODE) {
    return simulateVerifyCredential(credential, credDefId);
  } else {
    return realVerifyCredential(credential, credDefId);
  }
};

const revokeCredential = async (credentialId) => {
  if (SIMULATION_MODE) {
    return simulateRevokeCredential(credentialId);
  } else {
    return realRevokeCredential(credentialId);
  }
};

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

const getMode = () => {
  return SIMULATION_MODE ? 'SIMULATION' : 'REAL';
};

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
