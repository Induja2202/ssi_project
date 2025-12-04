import React, { useState, useEffect } from 'react';
import { verifierAPI } from '../../services/api';

const VerificationHistory = ({ user }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await verifierAPI.getHistory();
      setHistory(response.data.data);
    } catch (error) {
      setError('Failed to fetch verification history');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter(item => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  if (!user.did) {
    return (
      <div className="alert alert-warning">
        <h3>⚠️ DID Required</h3>
        <p>Please create a DID before viewing verification history.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Loading history...</div>;
  }

  return (
    <div className="history-container">
      <div className="page-header">
        <h1>📜 Verification History</h1>
        <p>View all your credential verifications</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="filter-bar">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All ({history.length})
        </button>
        <button
          className={filter === 'success' ? 'active' : ''}
          onClick={() => setFilter('success')}
        >
          Successful ({history.filter(h => h.status === 'success').length})
        </button>
        <button
          className={filter === 'failed' ? 'active' : ''}
          onClick={() => setFilter('failed')}
        >
          Failed ({history.filter(h => h.status === 'failed').length})
        </button>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="empty-state">
          <h3>No verification history</h3>
          <p>
            {filter === 'all'
              ? "You haven't verified any credentials yet."
              : `No ${filter} verifications found.`}
          </p>
        </div>
      ) : (
        <div className="history-list">
          {filteredHistory.map((item, index) => (
            <div key={index} className="history-item">
              <div className="history-header">
                <div className="history-status">
                  <span className={`status-icon ${item.status}`}>
                    {item.status === 'success' ? '✓' : '✗'}
                  </span>
                  <span className={`status-text ${item.status}`}>
                    {item.status === 'success' ? 'Verified' : 'Failed'}
                  </span>
                </div>
                <div className="history-time">
                  {new Date(item.timestamp).toLocaleString()}
                </div>
              </div>

              <div className="history-details">
                <div className="detail-row">
                  <strong>Activity:</strong>
                  <span>{item.activityType.replace(/_/g, ' ').toUpperCase()}</span>
                </div>
                {item.credentialId && (
                  <div className="detail-row">
                    <strong>Credential ID:</strong>
                    <code>{item.credentialId}</code>
                  </div>
                )}
                {item.relatedUserDID && (
                  <div className="detail-row">
                    <strong>Holder DID:</strong>
                    <code>{item.relatedUserDID.substring(0, 40)}...</code>
                  </div>
                )}
                {item.errorMessage && (
                  <div className="detail-row error">
                    <strong>Error:</strong>
                    <span>{item.errorMessage}</span>
                  </div>
                )}
              </div>

              {item.metadata && Object.keys(item.metadata).length > 0 && (
                <div className="history-metadata">
                  <strong>Additional Info:</strong>
                  <div className="metadata-grid">
                    {Object.entries(item.metadata).map(([key, value]) => (
                      <div key={key}>
                        <strong>{key}:</strong> {JSON.stringify(value)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VerificationHistory;