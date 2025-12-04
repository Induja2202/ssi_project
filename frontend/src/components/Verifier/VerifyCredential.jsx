import React, { useState } from 'react';
import { verifierAPI } from '../../services/api';

const VerifyCredential = ({ user, onVerified }) => {
  const [formData, setFormData] = useState({
    credentialId: '',
    proof: null,
    revealedAttributes: null
  });
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setVerificationResult(null);
  };

  const handleProofUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const proofData = JSON.parse(event.target.result);
          setFormData({
            ...formData,
            proof: proofData.proof,
            revealedAttributes: proofData.revealedAttributes,
            credentialId: proofData.credentialId || formData.credentialId
          });
        } catch (err) {
          setError('Invalid proof file format');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setVerificationResult(null);

    try {
      const response = await verifierAPI.verify({
        credentialId: formData.credentialId,
        proof: formData.proof,
        revealedAttributes: formData.revealedAttributes
      });

      setVerificationResult(response.data);
      if (onVerified) onVerified();
    } catch (error) {
      setError(error.response?.data?.message || 'Verification failed');
      setVerificationResult(error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const checkRevocation = async () => {
    if (!formData.credentialId) {
      setError('Please enter a credential ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await verifierAPI.checkRevocation(formData.credentialId);
      alert(
        response.data.data.isRevoked
          ? `Credential is REVOKED!\nReason: ${response.data.data.revocationDetails?.reason}`
          : 'Credential is NOT revoked'
      );
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to check revocation');
    } finally {
      setLoading(false);
    }
  };

  if (!user.did) {
    return (
      <div className="alert alert-warning">
        <h3>⚠️ DID Required</h3>
        <p>Please create a DID before verifying credentials.</p>
      </div>
    );
  }

  return (
    <div className="verify-container">
      <div className="page-header">
        <h1>🔍 Verify Credential</h1>
        <p>Verify the authenticity of a credential</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleVerify} className="verify-form">
        <div className="form-section">
          <h3>Credential Information</h3>

          <div className="form-group">
            <label htmlFor="credentialId">Credential ID *</label>
            <input
              type="text"
              id="credentialId"
              name="credentialId"
              value={formData.credentialId}
              onChange={handleChange}
              placeholder="Enter the credential ID"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="proofFile">Zero-Knowledge Proof (Optional)</label>
            <input
              type="file"
              id="proofFile"
              accept=".json"
              onChange={handleProofUpload}
            />
            <small>Upload the JSON proof file provided by the holder</small>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Verifying...' : '✓ Verify Credential'}
          </button>
          <button
            type="button"
            onClick={checkRevocation}
            className="btn-secondary"
            disabled={loading}
          >
            🔍 Check Revocation Status
          </button>
        </div>
      </form>

      {verificationResult && (
        <div className={`verification-result ${verificationResult.verified ? 'success' : 'failed'}`}>
          <div className="result-header">
            <h2>
              {verificationResult.verified ? '✅ Credential Verified' : '❌ Verification Failed'}
            </h2>
            <p>{verificationResult.message}</p>
          </div>

          {verificationResult.data && (
            <div className="result-body">
              <div className="result-section">
                <h3>Credential Details</h3>
                <div className="detail-grid">
                  <div>
                    <strong>Credential ID:</strong>
                    <code>{verificationResult.data.credentialId}</code>
                  </div>
                  <div>
                    <strong>Type:</strong>
                    <span>{verificationResult.data.credentialType}</span>
                  </div>
                  <div>
                    <strong>Status:</strong>
                    <span className={`badge badge-${verificationResult.data.status}`}>
                      {verificationResult.data.status}
                    </span>
                  </div>
                  <div>
                    <strong>Issued At:</strong>
                    <span>{new Date(verificationResult.data.issuedAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="result-section">
                <h3>Issuer & Holder</h3>
                <div className="detail-item">
                  <strong>Issuer DID:</strong>
                  <code>{verificationResult.data.issuerDID}</code>
                </div>
                <div className="detail-item">
                  <strong>Holder DID:</strong>
                  <code>{verificationResult.data.holderDID}</code>
                </div>
              </div>

              {verificationResult.data.revealedAttributes &&
                Object.keys(verificationResult.data.revealedAttributes).length > 0 && (
                  <div className="result-section">
                    <h3>Revealed Attributes (via ZKP)</h3>
                    <div className="attributes-display">
                      {Object.entries(verificationResult.data.revealedAttributes).map(
                        ([key, value]) => (
                          <div key={key} className="attribute-row">
                            <strong>{key}:</strong> {value}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              <div className="result-section">
                <h3>Verification Details</h3>
                <div className="detail-grid">
                  {verificationResult.data.zkpVerification && (
                    <div>
                      <strong>ZKP Verified:</strong>
                      <span className={verificationResult.data.zkpVerification.verified ? 'text-success' : 'text-error'}>
                        {verificationResult.data.zkpVerification.verified ? 'Yes ✓' : 'No ✗'}
                      </span>
                    </div>
                  )}
                  {verificationResult.data.blockchainVerification && (
                    <div>
                      <strong>Blockchain Verified:</strong>
                      <span className={verificationResult.data.blockchainVerification.verified ? 'text-success' : 'text-error'}>
                        {verificationResult.data.blockchainVerification.verified ? 'Yes ✓' : 'No ✗'}
                      </span>
                    </div>
                  )}
                  <div>
                    <strong>Verified At:</strong>
                    <span>{verificationResult.data.verifiedAt}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {verificationResult.revocationDetails && (
            <div className="alert alert-error">
              <h3>⚠️ Credential Revoked</h3>
              <p><strong>Revoked At:</strong> {new Date(verificationResult.revocationDetails.revokedAt).toLocaleString()}</p>
              <p><strong>Reason:</strong> {verificationResult.revocationDetails.reason}</p>
            </div>
          )}
        </div>
      )}

      <div className="info-box">
        <h4>How to Verify</h4>
        <ol>
          <li><strong>Basic Verification:</strong> Enter the credential ID and click verify</li>
          <li><strong>ZKP Verification:</strong> Upload the proof JSON file provided by the holder</li>
          <li><strong>Check Revocation:</strong> Verify if the credential has been revoked</li>
        </ol>
        <p>
          The system will check the credential against the blockchain, verify its signature,
          check revocation status, and validate any Zero-Knowledge Proofs.
        </p>
      </div>
    </div>
  );
};

export default VerifyCredential;