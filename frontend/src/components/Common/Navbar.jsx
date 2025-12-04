import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      onLogout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h2>🔐 SSI Identity Platform</h2>
        </div>
        
        <div className="navbar-info">
          <div className="user-info">
            <span className="user-role">{user.role.toUpperCase()}</span>
            <span className="user-name">{user.username}</span>
            {user.did && (
              <span className="user-did" title={user.did}>
                DID: {user.did.substring(0, 20)}...
              </span>
            )}
          </div>
          
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;