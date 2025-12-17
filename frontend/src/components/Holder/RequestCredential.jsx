import React, { useState } from 'react';
import { credentialAPI } from '../../services/api';

const RequestCredential = ({ user, onStatsUpdate }) => {
  const [formData, setFormData] = useState({
    issuerDID: '',
    credentialType: 'IdentityCredential'
  });
  
  // Dynamic attributes state
  const [attributes, setAttributes] = useState([
    { name: 'name', value: '' },
    { name: 'email', value: '' }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const credentialTypes = [
    'IdentityCredential',
    'EducationCredential',
    'EmploymentCredential',
    'HealthCredential',
    'LicenseCredential',
    'MembershipCredential',
    'CertificationCredential'
  ];

  // Common attribute suggestions
  const commonAttributes = [
    'name', 'email', 'phone', 'address', 'dateOfBirth',
    'age', 'gender', 'nationality', 'country',
    'degree', 'university', 'graduationYear', 'gpa', 'major',
    'company', 'position', 'employeeId', 'department',
    'licenseNumber', 'issueDate', 'expiryDate',
    'bloodType', 'allergies', 'medicalId',
    'membershipId', 'memberSince', 'membershipLevel'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Add new attribute field
  const addAttribute = () => {
    setAttributes([...attributes, { name: '', value: '' }]);
  };

  // Remove attribute field
  const removeAttribute = (index) => {
    if (attributes.length > 1) {
      const newAttributes = attributes.filter((_, i) => i !== index);
      setAttributes(newAttributes);
    }
  };

  // Update attribute name
  const updateAttributeName = (index, name) => {
    const newAttributes = [...attributes];
    newAttributes[index].name = name;
    setAttributes(newAttributes);
  };

  // Update attribute value
  const updateAttributeValue = (index, value) => {
    const newAttributes = [...attributes];
    newAttributes[index].value = value;
    setAttributes(newAttributes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Convert attributes array to object, filter out empty ones
    const attributesObject = {};
    let hasValidAttributes = false;

    attributes.forEach(attr => {
      if (attr.name.trim() !== '' && attr.value.trim() !== '') {
        attributesObject[attr.name.trim()] = attr.value.trim();
        hasValidAttributes = true;
      }
    });

    if (!hasValidAttributes) {
      setError('Please provide at least one attribute with both name and value');
      setLoading(false);
      return;
    }

    if (!formData.issuerDID.trim()) {
      setError('Please provide the issuer DID');
      setLoading(false);
      return;
    }

    try {
      await credentialAPI.request({
        issuerDID: formData.issuerDID,
        credentialType: formData.credentialType,
        attributes: attributesObject
      });

      setSuccess('Credential request submitted successfully!');
      
      // Reset form
      setFormData({
        issuerDID: '',
        credentialType: 'IdentityCredential'
      });
      setAttributes([
        { name: 'name', value: '' },
        { name: 'email', value: '' }
      ]);
      
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
        <p>Request a verifiable credential from an issuer with custom attributes</p>
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
              placeholder="Enter the issuer's DID (e.g., did:sov:sim...)"
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3>Credential Attributes</h3>
              <p>Add custom attributes for your credential</p>
            </div>
            <button
              type="button"
              onClick={addAttribute}
              className="btn-secondary"
              style={{ padding: '8px 16px' }}
            >
              ➕ Add Attribute
            </button>
          </div>

          <div className="attributes-builder">
            {attributes.map((attr, index) => (
              <div key={index} className="attribute-row-builder">
                <div className="attribute-input-group">
                  <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label>Attribute Name</label>
                    <input
                      type="text"
                      value={attr.name}
                      onChange={(e) => updateAttributeName(index, e.target.value)}
                      placeholder="e.g., name, degree, employeeId"
                      list={`suggestions-${index}`}
                      required
                    />
                    <datalist id={`suggestions-${index}`}>
                      {commonAttributes.map(suggestion => (
                        <option key={suggestion} value={suggestion} />
                      ))}
                    </datalist>
                  </div>

                  <div className="form-group" style={{ flex: 2, marginBottom: 0 }}>
                    <label>Attribute Value</label>
                    <input
                      type="text"
                      value={attr.value}
                      onChange={(e) => updateAttributeValue(index, e.target.value)}
                      placeholder="Enter value"
                      required
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeAttribute(index)}
                    className="btn-remove"
                    disabled={attributes.length === 1}
                    title="Remove attribute"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="info-box" style={{ marginTop: '20px' }}>
            <h4>💡 Attribute Suggestions by Type</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px', marginTop: '12px' }}>
              <div>
                <strong>🆔 Identity:</strong>
                <small style={{ display: 'block', color: '#6b7280' }}>
                  name, email, phone, address, dateOfBirth, age, gender
                </small>
              </div>
              <div>
                <strong>🎓 Education:</strong>
                <small style={{ display: 'block', color: '#6b7280' }}>
                  degree, university, graduationYear, gpa, major, studentId
                </small>
              </div>
              <div>
                <strong>💼 Employment:</strong>
                <small style={{ display: 'block', color: '#6b7280' }}>
                  company, position, employeeId, department, startDate
                </small>
              </div>
              <div>
                <strong>📜 License:</strong>
                <small style={{ display: 'block', color: '#6b7280' }}>
                  licenseNumber, issueDate, expiryDate, category, authority
                </small>
              </div>
            </div>
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
          <li>Enter the issuer's DID (you can get this from the issuer/organization)</li>
          <li>Select the type of credential you need</li>
          <li>Add custom attributes with names and values</li>
          <li>You can add as many attributes as needed using "Add Attribute" button</li>
          <li>Remove unwanted attributes using the 🗑️ button</li>
          <li>Submit the request and wait for the issuer to approve</li>
          <li>Once issued, the credential will appear in "My Credentials"</li>
        </ol>
      </div>
    </div>
  );
};

export default RequestCredential;
