import React from 'react';
import { Transaction, Distribution } from '../types';
import { formatCurrency } from '../utils/inheritance';

interface TransactionHistoryProps {
  transactions: Transaction[];
  distributions: Distribution[];
}

import PrintButton from './PrintButton';

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions, distributions }) => {
  // Combine and sort all events by date
  const allEvents = [
    ...transactions.map(t => ({ ...t, eventType: 'transaction' as const })),
    ...distributions.map(d => ({
      id: d.id,
      type: 'distribution_completed' as const,
      description: `${d.assetName} sold and distributed`,
      amount: d.totalAmount,
      date: d.saleDate,
      eventType: 'distribution' as const,
      distribution: d,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'asset_added':
        return (
          <div className="p-2 bg-green-100 rounded-full">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        );
      case 'asset_sold':
      case 'distribution_completed':
        return (
          <div className="p-2 bg-[#d4af37]/20 rounded-full">
            <svg className="w-5 h-5 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'document_uploaded':
        return (
          <div className="p-2 bg-blue-100 rounded-full">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        );
      case 'heir_added':
        return (
          <div className="p-2 bg-purple-100 rounded-full">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="p-2 bg-gray-100 rounded-full">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <section id="history" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 relative">
          <div className="absolute right-0 top-0 hidden md:block">
            <PrintButton title="Print History" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
            Transaction History
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Complete timeline of all asset additions, sales, distributions, and document uploads.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            {/* Events */}
            <div className="space-y-6">
              {allEvents.map((event, index) => (
                <div key={event.id} className="relative flex gap-6">
                  {/* Icon */}
                  <div className="relative z-10 bg-white">
                    {getEventIcon(event.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-gray-900">{event.description}</p>
                        <p className="text-sm text-gray-500 mt-1">{formatDate(event.date)}</p>
                      </div>
                      {event.amount && (
                        <span className={`text-lg font-bold ${event.type === 'asset_sold' || event.type === 'distribution_completed'
                            ? 'text-[#d4af37]'
                            : 'text-green-600'
                          }`}>
                          {formatCurrency(event.amount)}
                        </span>
                      )}
                    </div>

                    {/* Distribution Details */}
                    {event.eventType === 'distribution' && event.distribution && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm font-medium text-gray-700 mb-3">Distribution Breakdown:</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {event.distribution.shares.slice(0, 6).map((share) => (
                            <div key={share.heirId} className="bg-gray-50 rounded-lg p-2 text-sm">
                              <p className="font-medium text-gray-900 truncate">{share.heirName}</p>
                              <p className="text-[#d4af37] font-semibold">{formatCurrency(share.shareAmount)}</p>
                            </div>
                          ))}
                        </div>
                        {event.distribution.shares.length > 6 && (
                          <p className="text-sm text-gray-500 mt-2">
                            +{event.distribution.shares.length - 6} more heirs
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {allEvents.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions yet</h3>
                <p className="text-gray-500">Transaction history will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransactionHistory;
