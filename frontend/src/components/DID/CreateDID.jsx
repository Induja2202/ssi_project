import React, { useState } from 'react';
import { didAPI } from '../../services/api';

const CreateDID = ({ user, onDIDCreated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCreateDID = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await didAPI.create();
      setSuccess('DID created successfully!');
      onDIDCreated(response.data.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create DID');
    } finally {
      setLoading(false);
    }
  };

  if (user.did) {
    return (
      <div className="did-info-card">
        <h3>✅ Your DID is Active</h3>
        <div className="did-details">
          <div className="did-field">
            <label>DID:</label>
            <code>{user.did}</code>
          </div>
          {user.verkey && (
            <div className="did-field">
              <label>Verification Key:</label>
              <code>{user.verkey}</code>
            </div>
          )}
          {user.walletId && (
            <div className="did-field">
              <label>Wallet ID:</label>
              <code>{user.walletId}</code>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="create-did-card">
      <h3>🆔 Create Your Decentralized Identifier (DID)</h3>
      <p>You need to create a DID before you can use the platform.</p>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <button
        onClick={handleCreateDID}
        className="btn-primary"
        disabled={loading}
      >
        {loading ? 'Creating DID...' : 'Create DID'}
      </button>

      <div className="did-info">
        <h4>What is a DID?</h4>
        <p>
          A Decentralized Identifier (DID) is a globally unique identifier that
          enables verifiable, decentralized digital identity. Your DID will be
          registered on the blockchain and associated with your account.
        </p>
      </div>
    </div>
  );
};

export default CreateDID;