import React, { useState } from 'react';
import { credentialAPI } from '../../services/api';

const RequestCredential = ({ user, onStatsUpdate }) => {
  const [formData, setFormData] = useState({
    issuerDID: '',
    credentialType: 'IdentityCredential',
    attributes: {
      name: '',
      age: '',
      email: '',
      address: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const credentialTypes = [
    'IdentityCredential',
    'EducationCredential',
    'EmploymentCredential',
    'HealthCredential',
    'LicenseCredential'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('attr_')) {
      const attrName = name.replace('attr_', '');
      setFormData({
        ...formData,
        attributes: {
          ...formData.attributes,
          [attrName]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Filter out empty attributes
    const filteredAttributes = Object.fromEntries(
      Object.entries(formData.attributes).filter(([_, value]) => value.trim() !== '')
    );

    if (Object.keys(filteredAttributes).length === 0) {
      setError('Please provide at least one attribute');
      setLoading(false);
      return;
    }

    try {
      await credentialAPI.request({
        issuerDID: formData.issuerDID,
        credentialType: formData.credentialType,
        attributes: filteredAttributes
      });

      setSuccess('Credential request submitted successfully!');
      setFormData({
        issuerDID: '',
        credentialType: 'IdentityCredential',
        attributes: { name: '', age: '', email: '', address: '' }
      });
      
      if (onStatsUpdate) onStatsUpdate();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to request credential');
    } finally {
      setLoading(false);
    }
  };

  if (!user.did) {
    return (
      <div className="alert alert-warning">
        <h3>⚠️ DID Required</h3>
        <p>Please create a DID before requesting credentials.</p>
      </div>
    );
  }

  return (
    <div className="request-container">
      <div className="page-header">
        <h1>📝 Request Credential</h1>
        <p>Request a verifiable credential from an issuer</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className="request-form">
        <div className="form-section">
          <h3>Issuer Information</h3>
          
          <div className="form-group">
            <label htmlFor="issuerDID">Issuer DID *</label>
            <input
              type="text"
              id="issuerDID"
              name="issuerDID"
              value={formData.issuerDID}
              onChange={handleChange}
              placeholder="Enter the issuer's DID"
              required
            />
            <small>The DID of the organization or person who will issue the credential</small>
          </div>

          <div className="form-group">
            <label htmlFor="credentialType">Credential Type *</label>
            <select
              id="credentialType"
              name="credentialType"
              value={formData.credentialType}
              onChange={handleChange}
              required
            >
              {credentialTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-section">
          <h3>Credential Attributes</h3>
          <p>Provide the information you want to include in the credential</p>

          <div className="form-group">
            <label htmlFor="attr_name">Name</label>
            <input
              type="text"
              id="attr_name"
              name="attr_name"
              value={formData.attributes.name}
              onChange={handleChange}
              placeholder="Your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="attr_age">Age</label>
            <input
              type="number"
              id="attr_age"
              name="attr_age"
              value={formData.attributes.age}
              onChange={handleChange}
              placeholder="Your age"
            />
          </div>

          <div className="form-group">
            <label htmlFor="attr_email">Email</label>
            <input
              type="email"
              id="attr_email"
              name="attr_email"
              value={formData.attributes.email}
              onChange={handleChange}
              placeholder="Your email address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="attr_address">Address</label>
            <input
              type="text"
              id="attr_address"
              name="attr_address"
              value={formData.attributes.address}
              onChange={handleChange}
              placeholder="Your address"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Submitting...' : '📤 Submit Request'}
          </button>
        </div>
      </form>

      <div className="info-box">
        <h4>ℹ️ How it works</h4>
        <ol>
          <li>Enter the issuer's DID (you can get this from the issuer)</li>
          <li>Select the type of credential you need</li>
          <li>Fill in the attributes you want to include</li>
          <li>Submit the request and wait for the issuer to approve</li>
          <li>Once issued, the credential will appear in "My Credentials"</li>
        </ol>
      </div>
    </div>
  );
};

export default RequestCredential;