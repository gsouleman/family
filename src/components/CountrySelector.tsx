import React, { useState, useRef, useEffect } from 'react';
import { useCurrency, countries, Country } from '@/contexts/CurrencyContext';

interface CountrySelectorProps {
  variant?: 'navbar' | 'full';
}

const CountrySelector: React.FC<CountrySelectorProps> = ({ variant = 'navbar' }) => {
  const { country, setCountry } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCountries = countries.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.currency.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group countries by region
  const groupedCountries = {
    'Central Africa (XAF)': filteredCountries.filter(c => c.currency === 'XAF'),
    'West Africa (XOF)': filteredCountries.filter(c => c.currency === 'XOF'),
    'Other African Countries': filteredCountries.filter(c => 
      ['NGN', 'GHS', 'KES', 'ZAR', 'EGP', 'MAD', 'TND', 'DZD'].includes(c.currency)
    ),
    'Middle East': filteredCountries.filter(c => 
      ['AED', 'SAR', 'QAR', 'KWD', 'BHD', 'OMR', 'JOD', 'TRY'].includes(c.currency)
    ),
    'Asia': filteredCountries.filter(c => 
      ['MYR', 'IDR', 'PKR', 'BDT', 'INR'].includes(c.currency)
    ),
    'Europe & Americas': filteredCountries.filter(c => 
      ['GBP', 'EUR', 'USD', 'CAD'].includes(c.currency)
    ),
  };

  const handleSelectCountry = (selectedCountry: Country) => {
    setCountry(selectedCountry);
    setIsOpen(false);
    setSearchQuery('');
  };

  if (variant === 'navbar') {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#1a365d] hover:bg-gray-100 rounded-lg transition-colors"
        >
          <span className="text-lg">{country.flag}</span>
          <span className="hidden sm:inline">{country.currency}</span>
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
            {/* Search */}
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search country or currency..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50 focus:border-[#d4af37]"
                />
              </div>
            </div>

            {/* Country List */}
            <div className="max-h-80 overflow-y-auto">
              {Object.entries(groupedCountries).map(([region, regionCountries]) => {
                if (regionCountries.length === 0) return null;
                return (
                  <div key={region}>
                    <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider sticky top-0">
                      {region}
                    </div>
                    {regionCountries.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => handleSelectCountry(c)}
                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-[#d4af37]/10 transition-colors ${
                          country.code === c.code ? 'bg-[#d4af37]/20' : ''
                        }`}
                      >
                        <span className="text-xl">{c.flag}</span>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium text-gray-900">{c.name}</p>
                          <p className="text-xs text-gray-500">{c.currency} - {c.currencySymbol}</p>
                        </div>
                        {country.code === c.code && (
                          <svg className="w-5 h-5 text-[#d4af37]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>

            {/* Current Selection */}
            <div className="p-3 border-t border-gray-100 bg-gray-50">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Current: <strong>{country.name}</strong> ({country.currency})</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full variant for settings page or modal
  return (
    <div className="w-full" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Country / Currency
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-[#d4af37] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{country.flag}</span>
          <div className="text-left">
            <p className="font-medium text-gray-900">{country.name}</p>
            <p className="text-sm text-gray-500">{country.currency} - {country.currencySymbol}</p>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search country or currency..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50 focus:border-[#d4af37]"
              />
            </div>
          </div>

          {/* Country List */}
          <div className="max-h-64 overflow-y-auto">
            {Object.entries(groupedCountries).map(([region, regionCountries]) => {
              if (regionCountries.length === 0) return null;
              return (
                <div key={region}>
                  <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider sticky top-0">
                    {region}
                  </div>
                  {regionCountries.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => handleSelectCountry(c)}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-[#d4af37]/10 transition-colors ${
                        country.code === c.code ? 'bg-[#d4af37]/20' : ''
                      }`}
                    >
                      <span className="text-xl">{c.flag}</span>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-gray-900">{c.name}</p>
                        <p className="text-xs text-gray-500">{c.currency} - {c.currencySymbol}</p>
                      </div>
                      {country.code === c.code && (
                        <svg className="w-5 h-5 text-[#d4af37]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySelector;
