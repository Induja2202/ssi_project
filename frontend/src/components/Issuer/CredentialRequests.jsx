import React, { useState, useEffect } from 'react';
import { issuerAPI } from '../../services/api';

const CredentialRequests = ({ user, onStatsUpdate }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await issuerAPI.getRequests();
      setRequests(response.data.data);
    } catch (error) {
      setError('Failed to fetch credential requests');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleIssue = async (credentialId) => {
    if (!window.confirm('Are you sure you want to issue this credential?')) {
      return;
    }

    setProcessingId(credentialId);
    setError('');

    try {
      await issuerAPI.issueCredential(credentialId);
      alert('Credential issued successfully!');
      fetchRequests();
      onStatsUpdate();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to issue credential');
    } finally {
      setProcessingId(null);
    }
  };

  if (!user.did) {
    return (
      <div className="alert alert-warning">
        <h3>⚠️ DID Required</h3>
        <p>Please create a DID before managing credential requests.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Loading requests...</div>;
  }

  return (
    <div className="requests-container">
      <div className="page-header">
        <h1>📥 Credential Requests</h1>
        <p>Review and issue credentials to holders</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {requests.length === 0 ? (
        <div className="empty-state">
          <h3>No pending requests</h3>
          <p>You don't have any credential requests at the moment.</p>
        </div>
      ) : (
        <div className="requests-list">
          {requests.map((request) => (
            <div key={request.credentialId} className="request-card">
              <div className="request-header">
                <h3>{request.credentialType}</h3>
                <span className="badge badge-pending">{request.status}</span>
              </div>

              <div className="request-details">
                <div className="detail-row">
                  <strong>Credential ID:</strong>
                  <code>{request.credentialId}</code>
                </div>
                <div className="detail-row">
                  <strong>Holder DID:</strong>
                  <code>{request.holderDID}</code>
                </div>
                <div className="detail-row">
                  <strong>Requested At:</strong>
                  <span>{new Date(request.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <div className="request-attributes">
                <h4>Requested Attributes:</h4>
                <div className="attributes-grid">
                  {Object.entries(request.attributes).map(([key, value]) => (
                    <div key={key} className="attribute-item">
                      <strong>{key}:</strong> {value}
                    </div>
                  ))}
                </div>
              </div>

              <div className="request-actions">
                <button
                  onClick={() => handleIssue(request.credentialId)}
                  className="btn-primary"
                  disabled={processingId === request.credentialId}
                >
                  {processingId === request.credentialId
                    ? 'Issuing...'
                    : '✅ Issue Credential'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CredentialRequests;