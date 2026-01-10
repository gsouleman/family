import React, { useState } from 'react';
import { Asset, AssetCategory } from '../types';
import { useCurrency } from '@/contexts/CurrencyContext';
import { getCategoryColor } from '../data/assets';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

interface AssetDetailModalProps {
  asset: Asset;
  onClose: () => void;
  onSell: (asset: Asset) => void;
}

const categories: { value: AssetCategory; label: string }[] = [
  { value: 'property', label: 'Property' },
  { value: 'investment', label: 'Investment' },
  { value: 'vehicle', label: 'Vehicle' },
  { value: 'jewelry', label: 'Jewelry' },
  { value: 'business', label: 'Business' },
  { value: 'cash', label: 'Cash' },
];

const AssetDetailModal: React.FC<AssetDetailModalProps> = ({ asset, onClose, onSell }) => {
  const { user } = useAuth();
  const { formatCurrency } = useCurrency();
  const { updateAsset, deleteAsset } = useData();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: asset.name,
    value: asset.value.toString(),
    category: asset.category,
    description: asset.description,
    location: asset.location || '',
    purchaseDate: asset.purchaseDate,
    isForSale: asset.isForSale !== undefined ? asset.isForSale : true,
  });

  const categoryLabel = asset.category.charAt(0).toUpperCase() + asset.category.slice(1);

  const handleUpdate = () => {
    updateAsset(asset.id, {
      name: formData.name,
      value: parseFloat(formData.value) || 0,
      category: formData.category,
      description: formData.description,
      location: formData.location || undefined,
      purchaseDate: formData.purchaseDate,
      isForSale: formData.isForSale,
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this asset?')) {
      deleteAsset(asset.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Image Header */}
        <div className="relative h-64 shrink-0">
          <img
            src={asset.image}
            alt={asset.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Status & Category */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${asset.status === 'active'
              ? 'bg-green-500 text-white'
              : asset.status === 'sold'
                ? 'bg-red-500 text-white'
                : 'bg-yellow-500 text-white'
              }`}>
              {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(asset.category)}`}>
              {categoryLabel}
            </span>
          </div>

          {/* Title & Value */}
          <div className="absolute bottom-4 left-4 right-4">
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 text-white placeholder-white/50 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                />
                <input
                  type="number"
                  value={formData.value}
                  onChange={e => setFormData({ ...formData, value: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 text-[#d4af37] placeholder-white/50 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] font-bold"
                />
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-white mb-1">{asset.name}</h2>
                <p className="text-2xl font-bold text-[#d4af37]">{formatCurrency(asset.value)}</p>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Description */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</h3>
            {isEditing ? (
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                rows={3}
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">{asset.description}</p>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm">Location</span>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                />
              ) : (
                <p className="font-semibold text-gray-900">{asset.location || 'N/A'}</p>
              )}
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">Purchase Date</span>
              </div>
              {isEditing ? (
                <input
                  type="date"
                  value={formData.purchaseDate}
                  onChange={e => setFormData({ ...formData, purchaseDate: e.target.value })}
                  className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                />
              ) : (
                <p className="font-semibold text-gray-900">
                  {new Date(asset.purchaseDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              )}
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span className="text-sm">Category</span>
              </div>
              {isEditing ? (
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value as AssetCategory })}
                  className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              ) : (
                <p className="font-semibold text-gray-900">{categoryLabel}</p>
              )}
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm">Documents</span>
              </div>
              <p className="font-semibold text-gray-900">{asset.documents?.length || 0} files</p>
            </div>

            {/* Is For Sale Status */}
            <div className="p-4 bg-gray-50 rounded-xl col-span-2">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">Inheritance Status</span>
              </div>
              {isEditing ? (
                <div className="flex items-center gap-3 mt-2">
                  <input
                    type="checkbox"
                    id="editIsForSale"
                    checked={formData.isForSale}
                    onChange={(e) => setFormData({ ...formData, isForSale: e.target.checked })}
                    className="w-5 h-5 text-[#d4af37] border-gray-300 rounded focus:ring-[#d4af37]"
                  />
                  <label htmlFor="editIsForSale" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                    Asset is for sale (Include in Inheritance)
                  </label>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${asset.isForSale ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                  <p className="font-semibold text-gray-900">
                    {asset.isForSale ? 'Included in Inheritance (For Sale)' : 'Excluded from Inheritance (Not For Sale)'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Inheritance Preview */}
          <div className="p-4 bg-gradient-to-r from-[#1a365d]/5 to-[#d4af37]/5 rounded-xl border border-[#d4af37]/20">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold text-[#1a365d]">Inheritance Note</span>
            </div>
            <p className="text-sm text-gray-600">
              When this asset is sold, the proceeds will be automatically distributed among eligible heirs
              according to Islamic inheritance (Faraid) rules.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex flex-wrap gap-3">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 px-6 py-3 text-gray-600 hover:bg-gray-200 rounded-xl transition-colors font-medium border border-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="flex-1 px-6 py-3 bg-[#1a365d] text-white rounded-xl hover:bg-[#0f2744] transition-colors font-semibold"
              >
                Save Changes
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-6 py-3 text-gray-600 hover:bg-gray-200 rounded-xl transition-colors font-medium"
              >
                Close
              </button>
              {user && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    Delete
                  </button>
                </>
              )}
              {asset.status === 'active' && (
                <button
                  onClick={() => onSell(asset)}
                  className="flex-1 px-6 py-3 bg-[#d4af37] hover:bg-[#c9a432] text-[#1a365d] rounded-xl transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {user ? 'Sell Asset' : 'Sign In to Manager'}
                  {!user && (
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssetDetailModal;
