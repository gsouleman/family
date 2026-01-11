import React, { useState, useMemo } from 'react';
import { Heir, InheritanceShare } from '../types';
import { calculateIslamicInheritance, formatPercentage, getRelationLabel } from '../utils/inheritance';
import { getRelationColor } from '../data/family';
import { useCurrency } from '@/contexts/CurrencyContext';

import PrintButton from './PrintButton';
import WillGenerator from './WillGenerator';
import { Asset } from '../types';

interface InheritanceCalculatorProps {
  heirs: Heir[];
  totalAssetValue: number;
  activeAssets: Asset[];
}

const InheritanceCalculator: React.FC<InheritanceCalculatorProps> = ({ heirs = [], totalAssetValue = 0, activeAssets = [] }) => {
  const { formatCurrency, country } = useCurrency();
  const [customAmount, setCustomAmount] = useState<string>(totalAssetValue.toString());
  const [showBreakdown, setShowBreakdown] = useState(true);

  const amount = parseFloat(customAmount) || 0;
  const shares = useMemo(() => calculateIslamicInheritance(heirs || [], amount), [heirs, amount]);

  const totalDistributed = (shares || []).reduce((sum, s) => sum + s.shareAmount, 0);
  const distributionPercentage = amount > 0 ? (totalDistributed / amount) * 100 : 0;

  // Group shares by relation type for visualization
  const sharesByType = shares.reduce((acc, share) => {
    const type = share.relation;
    if (!acc[type]) acc[type] = [];
    acc[type].push(share);
    return acc;
  }, {} as Record<string, InheritanceShare[]>);

  return (
    <section id="calculator" className="py-16 bg-gradient-to-br from-[#1a365d] via-[#1e4976] to-[#0f2744]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 relative">
          <div className="absolute right-0 top-0 flex gap-2">
            <PrintButton title="Print Calculation" />
            <WillGenerator heirs={heirs} activeAssets={activeAssets} />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#d4af37]/20 rounded-full border border-[#d4af37]/30 mb-6">
            <svg className="w-5 h-5 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium text-[#d4af37]">Faraid Calculator</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Islamic Inheritance Calculator
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Calculate inheritance distribution according to Shariah principles. Enter an amount to see how it would be distributed among heirs.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">Estate Value</h3>

              <div className="relative mb-4">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{country.currencySymbol}</span>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full pl-16 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white text-xl font-bold focus:ring-2 focus:ring-[#d4af37] focus:border-transparent outline-none"
                  placeholder="Enter amount"
                />
              </div>

              <div className="mb-4 px-3 py-2 bg-white/5 rounded-lg flex items-center gap-2">
                <span className="text-lg">{country.flag}</span>
                <span className="text-sm text-gray-300">{country.name} ({country.currency})</span>
              </div>

              <button
                onClick={() => setCustomAmount(totalAssetValue.toString())}
                className="w-full px-4 py-3 bg-[#d4af37]/20 hover:bg-[#d4af37]/30 text-[#d4af37] rounded-xl transition-colors text-sm font-medium border border-[#d4af37]/30"
              >
                Use Total Portfolio Value ({formatCurrency(totalAssetValue)})
              </button>

              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-300">Show Breakdown</span>
                  <button
                    onClick={() => setShowBreakdown(!showBreakdown)}
                    className={`w-12 h-6 rounded-full transition-colors ${showBreakdown ? 'bg-[#d4af37]' : 'bg-gray-600'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${showBreakdown ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total Heirs</span>
                    <span className="text-white font-medium">{heirs.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Distribution</span>
                    <span className="text-[#d4af37] font-medium">{formatPercentage(distributionPercentage)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Reference */}
            <div className="mt-6 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h4 className="text-sm font-semibold text-[#d4af37] mb-4">Quick Reference</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Wife (with children)</span>
                  <span className="text-white">1/8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Wife (no children)</span>
                  <span className="text-white">1/4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Father</span>
                  <span className="text-white">1/6</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Mother</span>
                  <span className="text-white">1/6</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Son : Daughter</span>
                  <span className="text-white">2 : 1</span>
                </div>
              </div>
            </div>
          </div>

          {/* Distribution Visualization */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#1a365d]">Distribution Breakdown</h3>
                <span className="text-xl font-bold text-[#d4af37]">{formatCurrency(amount)}</span>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full flex">
                    {shares.map((share, index) => {
                      const colors = [
                        'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-amber-500',
                        'bg-green-500', 'bg-indigo-500', 'bg-red-500', 'bg-teal-500'
                      ];
                      return (
                        <div
                          key={share.heirId}
                          className={`${colors[index % colors.length]} transition-all duration-500`}
                          style={{ width: `${share.sharePercentage}%` }}
                          title={`${share.heirName}: ${formatPercentage(share.sharePercentage)}`}
                        ></div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Shares List */}
              {showBreakdown && (
                <div className="space-y-4">
                  {shares.map((share, index) => {
                    const colors = [
                      'border-l-blue-500', 'border-l-purple-500', 'border-l-pink-500', 'border-l-amber-500',
                      'border-l-green-500', 'border-l-indigo-500', 'border-l-red-500', 'border-l-teal-500'
                    ];
                    const bgColors = [
                      'bg-blue-50', 'bg-purple-50', 'bg-pink-50', 'bg-amber-50',
                      'bg-green-50', 'bg-indigo-50', 'bg-red-50', 'bg-teal-50'
                    ];

                    return (
                      <div
                        key={share.heirId}
                        className={`${bgColors[index % bgColors.length]} ${colors[index % colors.length]} border-l-4 rounded-lg p-4 transition-all hover:shadow-md`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                              <span className="text-lg font-bold text-gray-600">
                                {share.heirName.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{share.heirName}</h4>
                              <div className="flex items-center gap-2">
                                <span className={`text-xs px-2 py-0.5 rounded-full ${getRelationColor(share.relation)}`}>
                                  {getRelationLabel(share.relation)}
                                </span>
                                <span className="text-xs text-gray-500">
                                  Share: {share.shareFraction}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-[#1a365d]">{formatCurrency(share.shareAmount)}</p>
                            <p className="text-sm text-gray-500">{formatPercentage(share.sharePercentage)}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Summary */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Distributed</p>
                    <p className="text-xl font-bold text-[#1a365d]">{formatCurrency(totalDistributed)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 text-sm">Remaining</p>
                    <p className="text-xl font-bold text-gray-400">{formatCurrency(amount - totalDistributed)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pie Chart Visualization */}
            <div className="mt-6 bg-white rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-[#1a365d] mb-4">Visual Distribution</h3>
              <div className="flex flex-wrap gap-4 justify-center">
                {Object.entries(sharesByType).map(([type, typeShares]) => {
                  const totalTypeShare = typeShares.reduce((sum, s) => sum + s.sharePercentage, 0);
                  return (
                    <div key={type} className="text-center">
                      <div className="relative w-24 h-24 mx-auto mb-2">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="8"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            fill="none"
                            stroke="#d4af37"
                            strokeWidth="8"
                            strokeDasharray={`${totalTypeShare * 2.51} 251`}
                            className="transition-all duration-500"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-bold text-[#1a365d]">
                            {totalTypeShare.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${getRelationColor(type)}`}>
                        {getRelationLabel(type as any)}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">
                        {typeShares.length} heir{typeShares.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InheritanceCalculator;
