import React, { useState, useEffect } from 'react';
import { credentialAPI } from '../../services/api';

const MyCredentials = ({ user }) => {
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCredential, setSelectedCredential] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    try {
      const response = await credentialAPI.getMyCredentials();
      setCredentials(response.data.data);
    } catch (error) {
      setError('Failed to fetch credentials');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const viewDetails = async (credential) => {
    try {
      if (credential.status === 'issued') {
        const response = await credentialAPI.retrieve(credential.credentialId);
        setSelectedCredential(response.data.data);
      } else {
        setSelectedCredential({ credential });
      }
    } catch (error) {
      alert('Failed to retrieve credential details');
    }
  };

  const closeDetails = () => {
    setSelectedCredential(null);
  };

  const filteredCredentials = credentials.filter(cred => {
    if (filter === 'all') return true;
    return cred.status === filter;
  });

  if (!user.did) {
    return (
      <div className="alert alert-warning">
        <h3>⚠️ DID Required</h3>
        <p>Please create a DID before viewing credentials.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Loading credentials...</div>;
  }

  return (
    <div className="credentials-container">
      <div className="page-header">
        <h1>🎫 My Credentials</h1>
        <p>View and manage your verifiable credentials</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="filter-bar">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All ({credentials.length})
        </button>
        <button
          className={filter === 'issued' ? 'active' : ''}
          onClick={() => setFilter('issued')}
        >
          Issued ({credentials.filter(c => c.status === 'issued').length})
        </button>
        <button
          className={filter === 'pending' ? 'active' : ''}
          onClick={() => setFilter('pending')}
        >
          Pending ({credentials.filter(c => c.status === 'pending').length})
        </button>
        <button
          className={filter === 'revoked' ? 'active' : ''}
          onClick={() => setFilter('revoked')}
        >
          Revoked ({credentials.filter(c => c.status === 'revoked').length})
        </button>
      </div>

      {filteredCredentials.length === 0 ? (
        <div className="empty-state">
          <h3>No credentials found</h3>
          <p>
            {filter === 'all'
              ? "You don't have any credentials yet. Request one to get started!"
              : `No ${filter} credentials found.`}
          </p>
        </div>
      ) : (
        <div className="credentials-grid">
          {filteredCredentials.map((credential) => (
            <div key={credential.credentialId} className="credential-card">
              <div className="credential-header">
                <h3>{credential.credentialType}</h3>
                <span className={`badge badge-${credential.status}`}>
                  {credential.status}
                </span>
              </div>

              <div className="credential-body">
                <div className="credential-field">
                  <strong>Credential ID:</strong>
                  <code>{credential.credentialId.substring(0, 20)}...</code>
                </div>
                <div className="credential-field">
                  <strong>Issuer DID:</strong>
                  <code>{credential.issuerDID.substring(0, 25)}...</code>
                </div>
                <div className="credential-field">
                  <strong>Created:</strong>
                  <span>{new Date(credential.createdAt).toLocaleDateString()}</span>
                </div>
                {credential.issuedAt && (
                  <div className="credential-field">
                    <strong>Issued:</strong>
                    <span>{new Date(credential.issuedAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <div className="credential-actions">
                <button
                  onClick={() => viewDetails(credential)}
                  className="btn-secondary"
                >
                  👁️ View Details
                </button>
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
                <div className="detail-item">
                  <strong>Type:</strong> {selectedCredential.credential.credentialType}
                </div>
                <div className="detail-item">
                  <strong>Status:</strong> {selectedCredential.credential.status}
                </div>
                <div className="detail-item">
                  <strong>Credential ID:</strong>
                  <code>{selectedCredential.credential.credentialId}</code>
                </div>
              </div>

              {selectedCredential.decryptedData && (
                <>
                  <div className="detail-section">
                    <h3>Attributes</h3>
                    <div className="attributes-display">
                      {Object.entries(selectedCredential.decryptedData.attributes).map(([key, value]) => (
                        <div key={key} className="attribute-row">
                          <strong>{key}:</strong> {value}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="detail-section">
                    <h3>Blockchain Information</h3>
                    <div className="detail-item">
                      <strong>IPFS Hash:</strong>
                      <code>{selectedCredential.credential.ipfsHash}</code>
                    </div>
                    <div className="detail-item">
                      <strong>Blockchain Hash:</strong>
                      <code>{selectedCredential.credential.blockchainHash}</code>
                    </div>
                    <div className="detail-item">
                      <strong>Schema ID:</strong>
                      <code>{selectedCredential.decryptedData.schemaId}</code>
                    </div>
                  </div>
                </>
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

export default MyCredentials;