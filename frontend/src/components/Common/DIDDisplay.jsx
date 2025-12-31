import React, { useState } from 'react';

const DIDDisplay = ({ did, userName, role }) => {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(did);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const generateQRCode = (text) => {
    const size = 200;
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = generateQRCode(did);
    link.download = `DID-QRCode-${userName || 'user'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Your Decentralized Identity</h3>
        <span style={styles.roleBadge}>{role}</span>
      </div>

      <div style={styles.didContainer}>
        <label style={styles.label}>DID (Decentralized Identifier)</label>
        <div style={styles.didRow}>
          <code style={styles.didCode}>{did}</code>
          
          <button
            onClick={copyToClipboard}
            style={{...styles.button, ...(copied ? styles.buttonSuccess : styles.buttonPrimary)}}
            title="Copy DID"
          >
            {copied ? '✓ Copied!' : '📋 Copy'}
          </button>

          <button
            onClick={() => setShowQR(!showQR)}
            style={{...styles.button, ...styles.buttonSecondary}}
            title="Show QR Code"
          >
            📱 QR
          </button>
        </div>
      </div>

      <div style={styles.infoBox}>
        <p style={styles.infoText}>
          <strong>💡 Tip:</strong> Share this DID with others to receive credentials or verify your identity.
        </p>
      </div>

      {showQR && (
        <div style={styles.modalOverlay} onClick={() => setShowQR(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowQR(false)} style={styles.closeButton}>✕</button>

            <h4 style={styles.modalTitle}>Your DID QR Code</h4>

            <div style={styles.qrContainer}>
              <img
                src={generateQRCode(did)}
                alt="DID QR Code"
                style={styles.qrImage}
              />
            </div>

            <p style={styles.modalText}>Scan this QR code to quickly share your DID</p>

            <div style={styles.modalButtons}>
              <button onClick={downloadQR} style={{...styles.button, ...styles.buttonSuccess, flex: 1}}>
                Download QR
              </button>
              <button onClick={copyToClipboard} style={{...styles.button, ...styles.buttonPrimary, flex: 1}}>
                Copy DID
              </button>
            </div>
          </div>
        </div>
      )}

      {copied && (
        <div style={styles.toast}>
          ✓ DID copied to clipboard!
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    padding: '24px',
    marginBottom: '20px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0
  },
  roleBadge: {
    padding: '4px 12px',
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: '500',
    textTransform: 'uppercase'
  },
  didContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px'
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#4b5563',
    marginBottom: '8px'
  },
  didRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center'
  },
  didCode: {
    flex: 1,
    backgroundColor: 'white',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    padding: '8px 12px',
    fontSize: '13px',
    fontFamily: 'monospace',
    color: '#1f2937',
    wordBreak: 'break-all'
  },
  button: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  buttonPrimary: {
    backgroundColor: '#3b82f6',
    color: 'white'
  },
  buttonSecondary: {
    backgroundColor: '#8b5cf6',
    color: 'white'
  },
  buttonSuccess: {
    backgroundColor: '#10b981',
    color: 'white'
  },
  infoBox: {
    backgroundColor: '#eff6ff',
    borderLeft: '4px solid #3b82f6',
    padding: '12px',
    borderRadius: '4px'
  },
  infoText: {
    fontSize: '14px',
    color: '#1e40af',
    margin: 0
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '16px'
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '8px',
    maxWidth: '450px',
    width: '100%',
    padding: '24px',
    position: 'relative'
  },
  closeButton: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#9ca3af'
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '16px',
    textAlign: 'center'
  },
  qrContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '16px'
  },
  qrImage: {
    width: '256px',
    height: '256px',
    border: '4px solid #e5e7eb',
    borderRadius: '8px'
  },
  modalText: {
    fontSize: '14px',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: '16px'
  },
  modalButtons: {
    display: 'flex',
    gap: '12px'
  },
  toast: {
    position: 'fixed',
    bottom: '32px',
    right: '32px',
    backgroundColor: '#10b981',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    zIndex: 1001
  }
};

export default DIDDisplay;