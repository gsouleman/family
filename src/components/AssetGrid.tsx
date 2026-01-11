import React, { useState, useMemo } from 'react';
import { Asset, AssetCategory } from '../types';
import AssetCard from './AssetCard';
import { useCurrency } from '@/contexts/CurrencyContext';

interface AssetGridProps {
  assets: Asset[];
  onSelectAsset: (asset: Asset) => void;
  onSellAsset: (asset: Asset) => void;
}

const categories: { value: AssetCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Assets' },
  { value: 'property', label: 'Properties' },
  { value: 'investment', label: 'Investments' },
  { value: 'vehicle', label: 'Vehicles' },
  { value: 'business', label: 'Business' },
  { value: 'cash', label: 'Cash' },
  { value: 'other', label: 'Others' },
];

const sortOptions = [
  { value: 'value-desc', label: 'Highest Value' },
  { value: 'value-asc', label: 'Lowest Value' },
  { value: 'date-desc', label: 'Newest First' },
  { value: 'date-asc', label: 'Oldest First' },
  { value: 'name-asc', label: 'Name A-Z' },
];

import PrintButton from './PrintButton';

const AssetGrid: React.FC<AssetGridProps> = ({ assets = [], onSelectAsset, onSellAsset }) => {
  const { formatCurrency } = useCurrency();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState('value-desc');
  const [showActiveOnly, setShowActiveOnly] = useState(true);

  const filteredAndSortedAssets = useMemo(() => {
    if (!assets) return [];
    let filtered = assets;

    // Filter by status
    if (showActiveOnly) {
      filtered = filtered.filter(a => a.status === 'active');
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a =>
        a.name.toLowerCase().includes(query) ||
        a.description.toLowerCase().includes(query) ||
        a.location?.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(a => a.category === selectedCategory);
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'value-desc':
          return b.value - a.value;
        case 'value-asc':
          return a.value - b.value;
        case 'date-desc':
          return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime();
        case 'date-asc':
          return new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime();
        case 'name-asc':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return sorted;
  }, [assets, searchQuery, selectedCategory, sortBy, showActiveOnly]);

  const totalFilteredValue = (filteredAndSortedAssets || []).reduce((sum, a) => sum + a.value, 0);

  return (
    <section id="assets" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 relative">
          <div className="absolute right-0 top-0 hidden md:block">
            <PrintButton title="Print Assets" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1a365d] mb-4">
            Family Asset Portfolio
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Comprehensive view of all family assets. Filter, search, and manage your wealth with ease.
          </p>
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md w-full">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d4af37] focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as AssetCategory | 'all')}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d4af37] focus:border-transparent outline-none bg-white cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d4af37] focus:border-transparent outline-none bg-white cursor-pointer"
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              {/* Active Only Toggle */}
              <label className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={showActiveOnly}
                  onChange={(e) => setShowActiveOnly(e.target.checked)}
                  className="w-4 h-4 text-[#d4af37] border-gray-300 rounded focus:ring-[#d4af37]"
                />
                <span className="text-sm text-gray-600">Active Only</span>
              </label>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
            <p className="text-gray-600">
              Showing <span className="font-semibold text-[#1a365d]">{filteredAndSortedAssets.length}</span> assets
            </p>
            <p className="text-gray-600">
              Total Value: <span className="font-bold text-[#d4af37] text-lg">{formatCurrency(totalFilteredValue)}</span>
            </p>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat.value
                ? 'bg-[#1a365d] text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Asset Grid */}
        {filteredAndSortedAssets.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedAssets.map(asset => (
              <AssetCard
                key={asset.id}
                asset={asset}
                onSelect={onSelectAsset}
                onSell={onSellAsset}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No assets found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AssetGrid;
