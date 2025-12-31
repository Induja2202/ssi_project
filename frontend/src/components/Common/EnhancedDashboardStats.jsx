import React from 'react';
import { 
  Wallet, 
  CheckCircle, 
  Clock, 
  XCircle,
  TrendingUp,
  Award,
  FileText,
  Users
} from 'lucide-react';

const StatsCard = ({ icon: Icon, title, value, color, trend, subtitle, bgGradient }) => {
  return (
    <div className={`relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${bgGradient}`}>
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 opacity-10">
        <Icon size={120} strokeWidth={0.5} />
      </div>

      <div className="relative p-6">
        {/* Icon Container */}
        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full ${color} bg-opacity-20 mb-4`}>
          <Icon size={28} className={`${color.replace('bg-', 'text-')}`} />
        </div>

        {/* Value */}
        <div className="flex items-baseline gap-2 mb-2">
          <h3 className="text-4xl font-bold text-gray-800">{value}</h3>
          {trend && (
            <span className={`text-sm font-medium ${trend.positive ? 'text-green-600' : 'text-red-600'} flex items-center gap-1`}>
              <TrendingUp size={14} className={trend.positive ? '' : 'rotate-180'} />
              {trend.value}
            </span>
          )}
        </div>

        {/* Title */}
        <p className="text-gray-600 font-medium mb-1">{title}</p>
        
        {/* Subtitle */}
        {subtitle && (
          <p className="text-sm text-gray-500">{subtitle}</p>
        )}

        {/* Progress Bar (Optional) */}
        {trend && trend.progress !== undefined && (
          <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full ${color} transition-all duration-500`}
              style={{ width: `${trend.progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const EnhancedDashboardStats = ({ stats, role }) => {
  // Different stats based on role
  const getStatsConfig = () => {
    switch(role) {
      case 'holder':
        return [
          {
            icon: Wallet,
            title: 'Total Credentials',
            value: stats.total || 0,
            color: 'bg-blue-500',
            bgGradient: 'bg-gradient-to-br from-blue-50 to-blue-100',
            subtitle: 'In your wallet',
            trend: stats.total > 0 ? { positive: true, value: '+2 this week', progress: 75 } : null
          },
          {
            icon: CheckCircle,
            title: 'Verified',
            value: stats.issued || 0,
            color: 'bg-green-500',
            bgGradient: 'bg-gradient-to-br from-green-50 to-green-100',
            subtitle: 'Successfully issued',
            trend: stats.issued > 0 ? { positive: true, value: '+1 today', progress: 90 } : null
          },
          {
            icon: Clock,
            title: 'Pending',
            value: stats.pending || 0,
            color: 'bg-yellow-500',
            bgGradient: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
            subtitle: 'Awaiting approval',
            trend: null
          },
          {
            icon: XCircle,
            title: 'Revoked',
            value: stats.revoked || 0,
            color: 'bg-red-500',
            bgGradient: 'bg-gradient-to-br from-red-50 to-red-100',
            subtitle: 'No longer valid',
            trend: stats.revoked > 0 ? { positive: false, value: 'Action needed', progress: 25 } : null
          }
        ];

      case 'issuer':
        return [
          {
            icon: Award,
            title: 'Issued',
            value: stats.issued || 0,
            color: 'bg-purple-500',
            bgGradient: 'bg-gradient-to-br from-purple-50 to-purple-100',
            subtitle: 'Credentials issued',
            trend: { positive: true, value: '+15 this month', progress: 85 }
          },
          {
            icon: Clock,
            title: 'Pending Requests',
            value: stats.pending || 0,
            color: 'bg-orange-500',
            bgGradient: 'bg-gradient-to-br from-orange-50 to-orange-100',
            subtitle: 'Awaiting review',
            trend: null
          },
          {
            icon: Users,
            title: 'Active Holders',
            value: stats.holders || 0,
            color: 'bg-blue-500',
            bgGradient: 'bg-gradient-to-br from-blue-50 to-blue-100',
            subtitle: 'Connected users',
            trend: { positive: true, value: '+3 new', progress: 60 }
          },
          {
            icon: XCircle,
            title: 'Revoked',
            value: stats.revoked || 0,
            color: 'bg-red-500',
            bgGradient: 'bg-gradient-to-br from-red-50 to-red-100',
            subtitle: 'Invalidated credentials',
            trend: null
          }
        ];

      case 'verifier':
        return [
          {
            icon: FileText,
            title: 'Verified',
            value: stats.verified || 0,
            color: 'bg-green-500',
            bgGradient: 'bg-gradient-to-br from-green-50 to-green-100',
            subtitle: 'Successfully verified',
            trend: { positive: true, value: '+8 today', progress: 95 }
          },
          {
            icon: Clock,
            title: 'Pending',
            value: stats.pending || 0,
            color: 'bg-yellow-500',
            bgGradient: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
            subtitle: 'In verification queue',
            trend: null
          },
          {
            icon: XCircle,
            title: 'Failed',
            value: stats.failed || 0,
            color: 'bg-red-500',
            bgGradient: 'bg-gradient-to-br from-red-50 to-red-100',
            subtitle: 'Verification failed',
            trend: stats.failed > 0 ? { positive: false, value: 'Review needed', progress: 30 } : null
          },
          {
            icon: TrendingUp,
            title: 'Success Rate',
            value: `${stats.successRate || 0}%`,
            color: 'bg-blue-500',
            bgGradient: 'bg-gradient-to-br from-blue-50 to-blue-100',
            subtitle: 'Verification accuracy',
            trend: { positive: true, value: '+5% vs last week', progress: stats.successRate || 0 }
          }
        ];

      default:
        return [];
    }
  };

  const statsConfig = getStatsConfig();

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsConfig.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Stats Summary */}
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="text-indigo-600" size={24} />
            Activity Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">This Week</span>
              <span className="font-bold text-gray-800">
                {(stats.total || 0) + (stats.pending || 0)} actions
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Success Rate</span>
              <span className="font-bold text-green-600">
                {stats.total > 0 ? Math.round((stats.issued / stats.total) * 100) : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Last Activity</span>
              <span className="font-bold text-gray-800">2 hours ago</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Clock className="text-purple-600" size={24} />
            Recent Activity
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Credential Verified</p>
                <p className="text-xs text-gray-600">5 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">New Request Submitted</p>
                <p className="text-xs text-gray-600">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Credential Pending</p>
                <p className="text-xs text-gray-600">3 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo
export default function App() {
  const holderStats = {
    total: 5,
    issued: 4,
    pending: 1,
    revoked: 0
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-600">
            Monitor your credential activity and performance
          </p>
        </div>

        <EnhancedDashboardStats stats={holderStats} role="holder" />

        {/* Integration Instructions */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">Integration Instructions:</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">
{`// In HolderDashboard.jsx
import EnhancedDashboardStats from './EnhancedDashboardStats';

const stats = {
  total: credentials.length,
  issued: credentials.filter(c => c.status === 'issued').length,
  pending: credentials.filter(c => c.status === 'pending').length,
  revoked: credentials.filter(c => c.status === 'revoked').length
};

<EnhancedDashboardStats stats={stats} role="holder" />`}
          </pre>
        </div>
      </div>
    </div>
  );
}