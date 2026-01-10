import React from 'react';
import { Heir, Distribution } from '../types';
import { calculateIslamicInheritance, formatCurrency, formatPercentage, getRelationLabel } from '../utils/inheritance';
import { getRelationColor } from '../data/family';
import { useAuth } from '@/contexts/AuthContext';

interface DistributionDashboardProps {
  heirs: Heir[];
  totalAssetValue: number;
  distributions: Distribution[];
}

const DistributionDashboard: React.FC<DistributionDashboardProps> = ({
  heirs,
  totalAssetValue,
  distributions,
}) => {
  const { user } = useAuth();
  const projectedShares = calculateIslamicInheritance(heirs, totalAssetValue);
  
  // Calculate total distributed to each heir
  const distributedByHeir = distributions.reduce((acc, dist) => {
    dist.shares.forEach(share => {
      acc[share.heirId] = (acc[share.heirId] || 0) + share.shareAmount;
    });
    return acc;
  }, {} as Record<string, number>);

  const totalDistributed = Object.values(distributedByHeir).reduce((sum, val) => sum + val, 0);

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1a365d] mb-4">
            Distribution Dashboard
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real-time view of projected inheritance shares and completed distributions.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#1a365d]/10 rounded-xl">
                <svg className="w-6 h-6 text-[#1a365d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Portfolio</p>
                <p className="text-2xl font-bold text-[#1a365d]">{formatCurrency(totalAssetValue)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#d4af37]/10 rounded-xl">
                <svg className="w-6 h-6 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Distributed</p>
                <p className="text-2xl font-bold text-[#d4af37]">{formatCurrency(totalDistributed)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Heirs</p>
                <p className="text-2xl font-bold text-green-600">{heirs.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed Sales</p>
                <p className="text-2xl font-bold text-purple-600">{distributions.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Heir Distribution Cards - Show different content based on auth */}
        {user ? (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Projected Shares */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-[#1a365d] to-[#0f2744]">
                <h3 className="text-xl font-bold text-white">Projected Inheritance</h3>
                <p className="text-gray-300 text-sm mt-1">Based on current portfolio value</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {projectedShares.map((share, index) => {
                    const heir = heirs.find(h => h.id === share.heirId);
                    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-amber-500', 'bg-green-500', 'bg-indigo-500'];
                    
                    return (
                      <div key={share.heirId} className="flex items-center gap-4">
                        <img
                          src={heir?.avatar}
                          alt={share.heirName}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900 truncate">{share.heirName}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${getRelationColor(share.relation)}`}>
                                {getRelationLabel(share.relation)}
                              </span>
                            </div>
                            <span className="font-bold text-[#1a365d]">{formatCurrency(share.shareAmount)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${colors[index % colors.length]} transition-all duration-500`}
                                style={{ width: `${share.sharePercentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-500 w-16 text-right">
                              {formatPercentage(share.sharePercentage)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Received Distributions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-[#d4af37] to-[#c9a432]">
                <h3 className="text-xl font-bold text-[#1a365d]">Received Distributions</h3>
                <p className="text-[#1a365d]/70 text-sm mt-1">Amounts already distributed from sales</p>
              </div>
              <div className="p-6">
                {Object.keys(distributedByHeir).length > 0 ? (
                  <div className="space-y-4">
                    {heirs.map((heir) => {
                      const received = distributedByHeir[heir.id] || 0;
                      if (received === 0) return null;
                      
                      const projectedShare = projectedShares.find(s => s.heirId === heir.id);
                      const percentage = projectedShare ? (received / projectedShare.shareAmount) * 100 : 0;
                      
                      return (
                        <div key={heir.id} className="flex items-center gap-4">
                          <img
                            src={heir.avatar}
                            alt={heir.name}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-[#d4af37]/30"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-gray-900 truncate">{heir.name}</span>
                              <span className="font-bold text-[#d4af37]">{formatCurrency(received)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-[#d4af37] transition-all duration-500"
                                  style={{ width: `${Math.min(percentage, 100)}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-500 w-24 text-right">
                                {percentage.toFixed(1)}% received
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-500">No distributions yet</p>
                    <p className="text-sm text-gray-400 mt-1">Sell an asset to distribute inheritance</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Locked state for unauthenticated users */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Detailed Distribution Data</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                Sign in to view detailed inheritance projections, individual heir shares, 
                and distribution history.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                  <svg className="w-5 h-5 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-gray-600">Individual heir shares</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                  <svg className="w-5 h-5 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-gray-600">Distribution progress</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                  <svg className="w-5 h-5 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-gray-600">Faraid calculations</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Distributions - Only show when authenticated */}
        {user && distributions.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-[#1a365d]">Recent Distributions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Asset</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Sale Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Heirs</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {distributions.map((dist) => (
                    <tr key={dist.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">{dist.assetName}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(dist.saleDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-[#d4af37]">{formatCurrency(dist.totalAmount)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex -space-x-2">
                          {dist.shares.slice(0, 4).map((share) => {
                            const heir = heirs.find(h => h.id === share.heirId);
                            return (
                              <img
                                key={share.heirId}
                                src={heir?.avatar}
                                alt={share.heirName}
                                className="w-8 h-8 rounded-full border-2 border-white object-cover"
                                title={share.heirName}
                              />
                            );
                          })}
                          {dist.shares.length > 4 && (
                            <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                              +{dist.shares.length - 4}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          dist.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : dist.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {dist.status.charAt(0).toUpperCase() + dist.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DistributionDashboard;
