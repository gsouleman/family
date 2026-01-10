import React from 'react';
import { Asset } from '../types';
import { useCurrency } from '@/contexts/CurrencyContext';
import { getCategoryColor } from '../data/assets';
import { useAuth } from '@/contexts/AuthContext';

interface AssetCardProps {
  asset: Asset;
  onSelect: (asset: Asset) => void;
  onSell: (asset: Asset) => void;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset, onSelect, onSell }) => {
  const { user } = useAuth();
  const { formatCurrency } = useCurrency();
  const categoryLabel = asset.category.charAt(0).toUpperCase() + asset.category.slice(1);

  return (
    <div 
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#d4af37]/30 cursor-pointer"
      onClick={() => onSelect(asset)}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={asset.image}
          alt={asset.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            asset.status === 'active' 
              ? 'bg-green-500 text-white' 
              : asset.status === 'sold'
              ? 'bg-red-500 text-white'
              : 'bg-yellow-500 text-white'
          }`}>
            {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
          </span>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(asset.category)}`}>
            {categoryLabel}
          </span>
        </div>

        {/* Value Overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-white text-xl font-bold drop-shadow-lg">
            {formatCurrency(asset.value)}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-[#1a365d] transition-colors">
          {asset.name}
        </h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
          {asset.description}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
          {asset.location && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{asset.location}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{new Date(asset.purchaseDate).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(asset);
            }}
            className="flex-1 px-4 py-2 bg-[#1a365d] hover:bg-[#0f2744] text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Details
          </button>
          {asset.status === 'active' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSell(asset);
              }}
              className="px-4 py-2 bg-[#d4af37] hover:bg-[#c9a432] text-[#1a365d] text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Sell
              {!user && (
                <svg className="w-3 h-3 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssetCard;
