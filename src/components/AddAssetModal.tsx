import React, { useState } from 'react';
import { Asset, AssetCategory } from '../types';

import { useData } from '@/contexts/DataContext';
import { api } from '@/lib/api';

interface AddAssetModalProps {
  onClose: () => void;
  onSuccess?: (asset: Omit<Asset, 'id'>) => void;
}

const categories: { value: AssetCategory; label: string }[] = [
  { value: 'property', label: 'Property' },
  { value: 'investment', label: 'Investment' },
  { value: 'vehicle', label: 'Vehicle' },
  { value: 'business', label: 'Business' },
  { value: 'cash', label: 'Cash' },
  { value: 'other', label: 'Others' },
];

const defaultImages: Record<AssetCategory, string> = {
  property: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
  investment: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
  vehicle: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80',
  business: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
  cash: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80',
  other: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
};

const AddAssetModal: React.FC<AddAssetModalProps> = ({ onClose, onSuccess }) => {
  const { addAsset } = useData();
  const [formData, setFormData] = useState({
    name: '',
    category: 'property' as AssetCategory,
    value: '',
    description: '',
    location: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    isForSale: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.name && formData.value) {
      setIsSubmitting(true);
      try {
        const newAsset = {
          name: formData.name,
          category: formData.category,
          value: parseFloat(formData.value) || 0,
          description: formData.description,
          location: formData.location || undefined,
          purchaseDate: formData.purchaseDate,
          image: defaultImages[formData.category],
          status: 'active' as const,
          isForSale: formData.isForSale,
        };

        await addAsset(newAsset);
        if (onSuccess) {
          onSuccess(newAsset);
        }
        onClose();
      } catch (error: any) {
        console.error('Error adding asset:', error);
        alert(`Failed to add asset: ${error.message || 'Unknown error'}\nTarget API: ${api.getBaseUrl()}`);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-primary to-primary/90">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Add New Asset</h2>
              <p className="text-gray-300 text-sm mt-1">Register a new family asset</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-5">
            {/* Asset Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Asset Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d4af37] focus:border-transparent outline-none"
                placeholder="e.g., Family Villa"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.value })}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${formData.category === cat.value
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Value */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Value <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d4af37] focus:border-transparent outline-none"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d4af37] focus:border-transparent outline-none resize-none"
                rows={3}
                placeholder="Brief description of the asset..."
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location (Optional)
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d4af37] focus:border-transparent outline-none"
              />
            </div>

            {/* Purchase Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purchase Date
              </label>
              <input
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d4af37] focus:border-transparent outline-none"
              />
            </div>

            {/* Is For Sale Checkbox */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <input
                type="checkbox"
                id="isForSale"
                checked={formData.isForSale}
                onChange={(e) => setFormData({ ...formData, isForSale: e.target.checked })}
                className="w-5 h-5 text-[#d4af37] border-gray-300 rounded focus:ring-[#d4af37]"
              />
              <label htmlFor="isForSale" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                Asset is for sale (include in inheritance calculation)
              </label>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 text-gray-600 hover:bg-gray-200 rounded-xl transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!formData.name || !formData.value || isSubmitting}
            className="flex-1 px-6 py-3 bg-[#d4af37] hover:bg-[#c9a432] text-primary rounded-xl transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </span>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Asset
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAssetModal;
