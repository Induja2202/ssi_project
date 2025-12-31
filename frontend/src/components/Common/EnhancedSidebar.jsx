import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  Wallet,
  Share2,
  Search,
  Building2,
  ShieldCheck,
  Activity,
  Settings,
  HelpCircle,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

const SidebarLink = ({ icon: Icon, label, badge, active, onClick, notifications }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${
        active
          ? 'bg-blue-500 text-white shadow-md'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={20} className={active ? 'text-white' : 'text-gray-600 group-hover:text-blue-500'} />
        <span className="font-medium">{label}</span>
      </div>
      
      <div className="flex items-center gap-2">
        {notifications > 0 && (
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
            active ? 'bg-white text-blue-500' : 'bg-red-500 text-white'
          }`}>
            {notifications}
          </span>
        )}
        {badge && (
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
            active ? 'bg-white text-blue-500' : 'bg-blue-100 text-blue-600'
          }`}>
            {badge}
          </span>
        )}
        {!active && (
          <ChevronRight size={16} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>
    </button>
  );
};

const EnhancedSidebar = ({ role, activeTab, onTabChange }) => {
  const [collapsed, setCollapsed] = useState(false);

  // Navigation items based on role
  const getNavigationItems = () => {
    switch(role) {
      case 'holder':
        return [
          {
            icon: LayoutDashboard,
            label: 'Dashboard',
            id: 'dashboard',
            notifications: 0
          },
          {
            icon: Search,
            label: 'Find Issuers',
            id: 'find-issuers',
            badge: 'NEW',
            notifications: 0
          },
          {
            icon: FileText,
            label: 'Request Credential',
            id: 'request-credential',
            notifications: 0
          },
          {
            icon: Wallet,
            label: 'My Credentials',
            id: 'my-credentials',
            badge: '5',
            notifications: 2
          },
          {
            icon: Share2,
            label: 'Share Credential',
            id: 'share-credential',
            notifications: 0
          },
          {
            icon: Activity,
            label: 'Activity Log',
            id: 'activity',
            notifications: 0
          }
        ];

      case 'issuer':
        return [
          {
            icon: LayoutDashboard,
            label: 'Dashboard',
            id: 'dashboard',
            notifications: 0
          },
          {
            icon: AlertCircle,
            label: 'Pending Requests',
            id: 'pending-requests',
            notifications: 3,
            badge: '3'
          },
          {
            icon: FileText,
            label: 'Issue Credential',
            id: 'issue-credential',
            notifications: 0
          },
          {
            icon: Wallet,
            label: 'Issued Credentials',
            id: 'issued-credentials',
            badge: '127',
            notifications: 0
          },
          {
            icon: ShieldCheck,
            label: 'Revoke Credential',
            id: 'revoke',
            notifications: 0
          },
          {
            icon: Activity,
            label: 'Activity Log',
            id: 'activity',
            notifications: 0
          }
        ];

      case 'verifier':
        return [
          {
            icon: LayoutDashboard,
            label: 'Dashboard',
            id: 'dashboard',
            notifications: 0
          },
          {
            icon: ShieldCheck,
            label: 'Verify Credential',
            id: 'verify',
            notifications: 0
          },
          {
            icon: FileText,
            label: 'Verification History',
            id: 'history',
            badge: '45',
            notifications: 0
          },
          {
            icon: Activity,
            label: 'Activity Log',
            id: 'activity',
            notifications: 0
          }
        ];

      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <aside className={`bg-white shadow-lg flex flex-col h-screen sticky top-0 transition-all duration-300 ${
      collapsed ? 'w-20' : 'w-72'
    }`}>
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
            {role === 'holder' ? '👤' : role === 'issuer' ? '🏢' : '✓'}
          </div>
          {!collapsed && (
            <div>
              <h3 className="font-bold text-gray-800 capitalize">{role} Menu</h3>
              <p className="text-xs text-gray-500">Self-Sovereign Identity</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigationItems.map((item) => (
          <SidebarLink
            key={item.id}
            icon={item.icon}
            label={item.label}
            badge={item.badge}
            active={activeTab === item.id}
            onClick={() => onTabChange(item.id)}
            notifications={item.notifications}
          />
        ))}

        {/* Divider */}
        <div className="my-4 border-t border-gray-200"></div>

        {/* Additional Links */}
        <SidebarLink
          icon={Settings}
          label="Settings"
          active={activeTab === 'settings'}
          onClick={() => onTabChange('settings')}
          notifications={0}
        />
        <SidebarLink
          icon={HelpCircle}
          label="Help & Support"
          active={activeTab === 'help'}
          onClick={() => onTabChange('help')}
          notifications={0}
        />
      </nav>

      {/* Feature Highlight - Find Issuers */}
      {role === 'holder' && (
        <div className="m-4 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Search size={16} className="text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-800 text-sm mb-1">
                New Feature!
              </h4>
              <p className="text-xs text-gray-600 mb-2">
                Discover trusted credential issuers in the directory
              </p>
              <button
                onClick={() => onTabChange('find-issuers')}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                Explore Now
                <ChevronRight size={12} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>© 2024 SSI Platform</span>
          {!collapsed && (
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Online
            </span>
          )}
        </div>
      </div>
    </aside>
  );
};

// Demo Component with Tab Content
export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [role] = useState('holder');

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
            <p className="text-gray-600">Welcome to your dashboard overview.</p>
          </div>
        );
      case 'find-issuers':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Find Issuers</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">
                🎉 <strong>New Feature!</strong> Search and discover trusted credential issuers.
              </p>
            </div>
          </div>
        );
      case 'my-credentials':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">My Credentials</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                ⚠️ You have 2 new credential notifications!
              </p>
            </div>
          </div>
        );
      default:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4 capitalize">{activeTab.replace('-', ' ')}</h2>
            <p className="text-gray-600">Content for {activeTab}</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <EnhancedSidebar 
        role={role}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {renderContent()}

          {/* Integration Instructions */}
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-4">🔧 Integration Instructions:</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">1. Replace Sidebar Component:</h4>
                <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
{`// In HolderDashboard.jsx
import EnhancedSidebar from './EnhancedSidebar';

<EnhancedSidebar 
  role="holder"
  activeTab={activeTab}
  onTabChange={setActiveTab}
/>`}
                </pre>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">2. Handle Tab Changes:</h4>
                <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
{`const [activeTab, setActiveTab] = useState('dashboard');

const handleTabChange = (tabId) => {
  setActiveTab(tabId);
  
  // Route to appropriate component
  if (tabId === 'find-issuers') {
    navigate('/issuer-directory');
  } else if (tabId === 'my-credentials') {
    navigate('/my-credentials');
  }
  // ... etc
};`}
                </pre>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <h4 className="font-semibold text-blue-900 mb-2">✨ New Features Added:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• <strong>Find Issuers</strong> - Navigate to issuer directory</li>
                  <li>• <strong>Notification badges</strong> - Show pending actions</li>
                  <li>• <strong>NEW badge</strong> - Highlight new features</li>
                  <li>• <strong>Feature highlight card</strong> - Promote new issuer discovery</li>
                  <li>• <strong>Hover effects</strong> - Better UX feedback</li>
                  <li>• <strong>Role-based navigation</strong> - Different menus per role</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}