import React, { useState, useEffect } from 'react';
import { issuerAPI } from '../../services/api';

const IssueCredential = ({ user, onStatsUpdate }) => {
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revokingId, setRevokingId] = useState(null);
  const [selectedCredential, setSelectedCredential] = useState(null);

  useEffect(() => {
    fetchIssuedCredentials();
  }, []);

  const fetchIssuedCredentials = async () => {
    try {
      const response = await issuerAPI.getIssued();
      setCredentials(response.data.data);
    } catch (error) {
      setError('Failed to fetch issued credentials');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (credentialId) => {
    const reason = prompt('Please enter the reason for revocation:');
    if (!reason) return;

    setRevokingId(credentialId);
    setError('');

    try {
      await issuerAPI.revoke(credentialId, reason);
      alert('Credential revoked successfully!');
      fetchIssuedCredentials();
      onStatsUpdate();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to revoke credential');
    } finally {
      setRevokingId(null);
    }
  };

  const viewDetails = (credential) => {
    setSelectedCredential(credential);
  };

  const closeDetails = () => {
    setSelectedCredential(null);
  };

  if (loading) {
    return <div className="loading">Loading credentials...</div>;
  }

  return (
    <div className="issued-container">
      <div className="page-header">
        <h1>✅ Issued Credentials</h1>
        <p>View and manage issued credentials</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {credentials.length === 0 ? (
        <div className="empty-state">
          <h3>No issued credentials</h3>
          <p>You haven't issued any credentials yet.</p>
        </div>
      ) : (
        <div className="credentials-list">
          {credentials.map((credential) => (
            <div key={credential.credentialId} className="credential-card">
              <div className="credential-header">
                <h3>{credential.credentialType}</h3>
                <span
                  className={`badge badge-${credential.status}`}
                >
                  {credential.status}
                </span>
              </div>

              <div className="credential-info">
                <div className="info-row">
                  <strong>Credential ID:</strong>
                  <code>{credential.credentialId}</code>
                </div>
                <div className="info-row">
                  <strong>Holder DID:</strong>
                  <code>{credential.holderDID.substring(0, 30)}...</code>
                </div>
                <div className="info-row">
                  <strong>Issued At:</strong>
                  <span>{new Date(credential.issuedAt).toLocaleString()}</span>
                </div>
                <div className="info-row">
                  <strong>IPFS Hash:</strong>
                  <code>{credential.ipfsHash.substring(0, 20)}...</code>
                </div>
              </div>

              <div className="credential-actions">
                <button
                  onClick={() => viewDetails(credential)}
                  className="btn-secondary"
                >
                  👁️ View Details
                </button>
                {credential.status === 'issued' && (
                  <button
                    onClick={() => handleRevoke(credential.credentialId)}
                    className="btn-danger"
                    disabled={revokingId === credential.credentialId}
                  >
                    {revokingId === credential.credentialId
                      ? 'Revoking...'
                      : '🚫 Revoke'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCredential && (
        <div className="modal-overlay" onClick={closeDetails}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Credential Details</h2>
              <button onClick={closeDetails} className="btn-close">×</button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h3>Basic Information</h3>
                <div className="detail-grid">
                  <div><strong>Type:</strong> {selectedCredential.credentialType}</div>
                  <div><strong>Status:</strong> {selectedCredential.status}</div>
                  <div><strong>Issued:</strong> {new Date(selectedCredential.issuedAt).toLocaleString()}</div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Blockchain Information</h3>
                <div className="detail-item">
                  <strong>Schema ID:</strong>
                  <code>{selectedCredential.schemaId}</code>
                </div>
                <div className="detail-item">
                  <strong>Credential Definition ID:</strong>
                  <code>{selectedCredential.credDefId}</code>
                </div>
                <div className="detail-item">
                  <strong>IPFS Hash:</strong>
                  <code>{selectedCredential.ipfsHash}</code>
                </div>
                <div className="detail-item">
                  <strong>Blockchain Hash:</strong>
                  <code>{selectedCredential.blockchainHash}</code>
                </div>
              </div>

              <div className="detail-section">
                <h3>Attributes</h3>
                <div className="attributes-display">
                  {Object.entries(selectedCredential.attributes).map(([key, value]) => (
                    <div key={key} className="attribute-row">
                      <strong>{key}:</strong> {value}
                    </div>
                  ))}
                </div>
              </div>

              {selectedCredential.status === 'revoked' && (
                <div className="detail-section">
                  <h3>Revocation Information</h3>
                  <div className="detail-item">
                    <strong>Revoked At:</strong>
                    <span>{new Date(selectedCredential.revokedAt).toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Reason:</strong>
                    <span>{selectedCredential.revocationReason}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button onClick={closeDetails} className="btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueCredential;