import React, { useState, useEffect } from 'react';
import { credentialAPI, holderAPI } from '../../services/api';

const ShareCredential = ({ user }) => {
  const [credentials, setCredentials] = useState([]);
  const [selectedCredential, setSelectedCredential] = useState('');
  const [verifierDID, setVerifierDID] = useState('');
  const [attributes, setAttributes] = useState({});
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [shareResult, setShareResult] = useState(null);

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    try {
      const response = await credentialAPI.getMyCredentials();
      const issuedCreds = response.data.data.filter(c => c.status === 'issued');
      setCredentials(issuedCreds);
    } catch (error) {
      console.error('Failed to fetch credentials:', error);
    }
  };

  const handleCredentialSelect = async (credentialId) => {
    setSelectedCredential(credentialId);
    setSelectedAttributes([]);
    setAttributes({});
    setShareResult(null);

    if (credentialId) {
      try {
        const response = await credentialAPI.retrieve(credentialId);
        setAttributes(response.data.data.decryptedData.attributes);
      } catch (error) {
        setError('Failed to load credential attributes');
      }
    }
  };

  const handleAttributeToggle = (attrName) => {
    setSelectedAttributes(prev => {
      if (prev.includes(attrName)) {
        return prev.filter(a => a !== attrName);
      } else {
        return [...prev, attrName];
      }
    });
  };

  const handleShare = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setShareResult(null);

    if (selectedAttributes.length === 0) {
      setError('Please select at least one attribute to share');
      setLoading(false);
      return;
    }

    try {
      const response = await holderAPI.shareCredential(selectedCredential, {
        verifierDID,
        revealedAttributes: selectedAttributes
      });

      setSuccess('Credential shared successfully with Zero-Knowledge Proof!');
      setShareResult(response.data.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to share credential');
    } finally {
      setLoading(false);
    }
  };

  if (!user.did) {
    return (
      <div className="alert alert-warning">
        <h3>⚠️ DID Required</h3>
        <p>Please create a DID before sharing credentials.</p>
      </div>
    );
  }

  return (
    <div className="share-container">
      <div className="page-header">
        <h1>🔗 Share Credential</h1>
        <p>Share your credential with selective disclosure using Zero-Knowledge Proofs</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleShare} className="share-form">
        <div className="form-section">
          <h3>Select Credential</h3>
          
          <div className="form-group">
            <label htmlFor="credential">Choose a credential to share *</label>
            <select
              id="credential"
              value={selectedCredential}
              onChange={(e) => handleCredentialSelect(e.target.value)}
              required
            >
              <option value="">-- Select Credential --</option>
              {credentials.map(cred => (
                <option key={cred.credentialId} value={cred.credentialId}>
                  {cred.credentialType} - {cred.credentialId.substring(0, 15)}...
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="verifierDID">Verifier DID *</label>
            <input
              type="text"
              id="verifierDID"
              value={verifierDID}
              onChange={(e) => setVerifierDID(e.target.value)}
              placeholder="Enter the verifier's DID"
              required
            />
          </div>
        </div>

        {Object.keys(attributes).length > 0 && (
          <div className="form-section">
            <h3>🔒 Selective Disclosure</h3>
            <p>Choose which attributes to reveal (others will remain hidden)</p>

            <div className="attributes-selector">
              {Object.keys(attributes).map(attrName => (
                <div key={attrName} className="attribute-checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedAttributes.includes(attrName)}
                      onChange={() => handleAttributeToggle(attrName)}
                    />
                    <span className="attribute-name">{attrName}</span>
                    <span className="attribute-value">
                      {selectedAttributes.includes(attrName) 
                        ? attributes[attrName] 
                        : '●●●●●●●●'}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="form-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={loading || !selectedCredential}
          >
            {loading ? 'Generating Proof...' : '🔐 Generate & Share'}
          </button>
        </div>
      </form>

      {shareResult && (
        <div className="share-result">
          <h3>✅ Zero-Knowledge Proof Generated</h3>
          
          <div className="result-section">
            <h4>Proof Information</h4>
            <div className="result-item">
              <strong>Proof Type:</strong> {shareResult.proof.proofType}
            </div>
            <div className="result-item">
              <strong>Proof Hash:</strong>
              <code>{shareResult.proof.proofHash}</code>
            </div>
            <div className="result-item">
              <strong>Timestamp:</strong> {shareResult.proof.timestamp}
            </div>
          </div>

          <div className="result-section">
            <h4>Revealed Attributes ({Object.keys(shareResult.revealedAttributes).length})</h4>
            <div className="revealed-attributes">
              {Object.entries(shareResult.revealedAttributes).map(([key, value]) => (
                <div key={key} className="revealed-attr">
                  <strong>{key}:</strong> {value}
                </div>
              ))}
            </div>
          </div>

          <div className="result-section">
            <h4>Privacy Information</h4>
            <div className="result-item">
              <strong>Hidden Attributes:</strong> {shareResult.hiddenAttributesCount}
            </div>
            <div className="result-item">
              <strong>Credential ID:</strong> {shareResult.credentialId}
            </div>
          </div>

          <div className="info-box">
            <p>
              ℹ️ This proof can be verified by the verifier using their verification interface.
              Only the selected attributes are revealed, while others remain cryptographically hidden.
            </p>
          </div>
        </div>
      )}

      <div className="info-box">
        <h4>🔐 What is Selective Disclosure?</h4>
        <p>
          Selective disclosure allows you to prove certain facts about your credential
          without revealing all information. Using Zero-Knowledge Proofs (ZKP), you can:
        </p>
        <ul>
          <li>Choose which attributes to reveal to the verifier</li>
          <li>Keep other attributes completely hidden</li>
          <li>Prove the credential's authenticity without exposing unnecessary data</li>
          <li>Maintain your privacy while providing necessary verification</li>
        </ul>
      </div>
    </div>
  );
};

export default ShareCredential;