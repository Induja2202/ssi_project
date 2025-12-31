import React, { useState } from 'react';
import { Copy, Check, QrCode, X, LogOut, ChevronDown } from 'lucide-react';

const EnhancedHeader = ({ user, onLogout }) => {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showDIDMenu, setShowDIDMenu] = useState(false);

  const copyDID = async () => {
    try {
      await navigator.clipboard.writeText(user.did);
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
    link.href = generateQRCode(user.did);
    link.download = `DID-${user.name}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      holder: 'bg-purple-500',
      issuer: 'bg-blue-500',
      verifier: 'bg-green-500'
    };
    return colors[role.toLowerCase()] || 'bg-gray-500';
  };

  return (
    <>
      <header className="bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Logo & Platform Name */}
            <div className="flex items-center gap-3">
              <div className="text-3xl">🔒</div>
              <h1 className="text-2xl font-bold">SSI Identity Platform</h1>
            </div>

            {/* Right: User Info, DID, Logout */}
            <div className="flex items-center gap-4">
              {/* DID Section with Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowDIDMenu(!showDIDMenu)}
                  className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-all"
                >
                  <div className="text-left">
                    <div className="text-xs text-gray-400">Your DID</div>
                    <div className="text-sm font-mono">
                      {user.did.substring(0, 20)}...
                    </div>
                  </div>
                  <ChevronDown size={16} className={`transition-transform ${showDIDMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* DID Dropdown Menu */}
                {showDIDMenu && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 text-gray-800">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-gray-700">
                          Your Decentralized ID
                        </span>
                        <button
                          onClick={() => setShowDIDMenu(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X size={18} />
                        </button>
                      </div>

                      {/* Full DID */}
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <code className="text-xs font-mono text-gray-800 break-all block">
                          {user.did}
                        </code>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            copyDID();
                            setShowDIDMenu(false);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-all"
                        >
                          {copied ? <Check size={16} /> : <Copy size={16} />}
                          <span className="text-sm font-medium">
                            {copied ? 'Copied!' : 'Copy'}
                          </span>
                        </button>

                        <button
                          onClick={() => {
                            setShowQR(true);
                            setShowDIDMenu(false);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 transition-all"
                        >
                          <QrCode size={16} />
                          <span className="text-sm font-medium">QR Code</span>
                        </button>
                      </div>

                      {/* Info */}
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-600">
                          💡 Share this DID to receive credentials or verify your identity
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex items-center gap-3 border-l border-gray-700 pl-4">
                <div className="text-right">
                  <div className="font-semibold">{user.name}</div>
                  <div className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor(user.role)} inline-block`}>
                    {user.role.toUpperCase()}
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-medium transition-all"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowQR(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>

            <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">
              Your DID QR Code
            </h3>
            <p className="text-sm text-gray-600 text-center mb-4">
              {user.name} • {user.role}
            </p>

            <div className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-lg border-4 border-gray-200 mb-4">
                <img
                  src={generateQRCode(user.did)}
                  alt="DID QR Code"
                  className="w-64 h-64"
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-3 mb-4 w-full">
                <code className="text-xs font-mono text-gray-800 break-all block text-center">
                  {user.did}
                </code>
              </div>

              <div className="flex gap-3 w-full">
                <button
                  onClick={downloadQR}
                  className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all"
                >
                  Download QR
                </button>
                <button
                  onClick={copyDID}
                  className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all"
                >
                  Copy DID
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Copy Success Toast */}
      {copied && (
        <div className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-bounce">
          <Check size={20} />
          <span className="font-medium">DID copied to clipboard!</span>
        </div>
      )}
    </>
  );
};

// Demo Component
export default function App() {
  const sampleUser = {
    name: 'Carly',
    role: 'holder',
    did: 'did:sov:sim5Sf57549c8X2mN3pQxRdTyVgHfYzWnA29KmN3pQxRdTyVg'
  };

  const handleLogout = () => {
    alert('Logging out...');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <EnhancedHeader user={sampleUser} onLogout={handleLogout} />
      
      {/* Demo Dashboard Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4">Enhanced Header Features</h2>
          <ul className="space-y-2 text-gray-700">
            <li>✅ <strong>Click DID section</strong> - Shows dropdown with full DID</li>
            <li>✅ <strong>Copy button</strong> - One-click copy with confirmation</li>
            <li>✅ <strong>QR Code button</strong> - Opens modal with scannable QR</li>
            <li>✅ <strong>Download QR</strong> - Save QR code as image</li>
            <li>✅ <strong>Responsive design</strong> - Works on all screen sizes</li>
            <li>✅ <strong>Role-based colors</strong> - Different badges for each role</li>
          </ul>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <h3 className="font-semibold text-blue-900 mb-2">Integration Instructions:</h3>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Copy this component to your project</li>
              <li>2. Replace existing header in HolderDashboard.jsx</li>
              <li>3. Pass user object and logout handler as props</li>
              <li>4. Apply same pattern to Issuer and Verifier dashboards</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}