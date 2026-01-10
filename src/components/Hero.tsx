import React from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';

interface HeroProps {
  totalAssetValue: number;
  totalAssets: number;
  totalHeirs: number;
  onViewAssets: () => void;
  onCalculate: () => void;
}

const Hero: React.FC<HeroProps> = ({
  totalAssetValue,
  totalAssets,
  totalHeirs,
  onViewAssets,
  onCalculate,
}) => {
  const { formatCurrency, country } = useCurrency();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1a365d] via-[#1e4976] to-[#0f2744] text-white">
      {/* Geometric Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="islamic-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M30 0L60 30L30 60L0 30Z" fill="none" stroke="#d4af37" strokeWidth="1"/>
              <circle cx="30" cy="30" r="10" fill="none" stroke="#d4af37" strokeWidth="0.5"/>
              <path d="M30 20L40 30L30 40L20 30Z" fill="none" stroke="#d4af37" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamic-pattern)"/>
        </svg>
      </div>

      {/* Gold Accent Lines */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#d4af37]/20 rounded-full border border-[#d4af37]/30">
              <svg className="w-5 h-5 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-sm font-medium text-[#d4af37]">Shariah-Compliant Inheritance</span>
            </div>

            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
              Preserve Your
              <span className="block text-[#d4af37]">Family Legacy</span>
            </h1>

            <p className="text-lg lg:text-xl text-gray-300 max-w-xl">
              Manage your family assets with wisdom and ensure fair Islamic inheritance distribution 
              according to Shariah principles. Honor your legacy, protect your loved ones.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={onViewAssets}
                className="px-8 py-4 bg-[#d4af37] hover:bg-[#c9a432] text-[#1a365d] font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#d4af37]/30 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                View Assets
              </button>
              <button
                onClick={onCalculate}
                className="px-8 py-4 bg-transparent border-2 border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10 font-semibold rounded-lg transition-all duration-300 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Calculate Inheritance
              </button>
            </div>
          </div>

          {/* Right Content - Stats Cards */}
          <div className="grid grid-cols-2 gap-4 lg:gap-6">
            {/* Total Portfolio Value */}
            <div className="col-span-2 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-[#d4af37]/50 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#d4af37]/20 rounded-xl">
                  <svg className="w-8 h-8 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Portfolio Value</p>
                  <p className="text-2xl lg:text-3xl font-bold text-[#d4af37]">{formatCurrency(totalAssetValue)}</p>
                  <p className="text-xs text-gray-400 mt-1">{country.flag} {country.name}</p>
                </div>
              </div>
            </div>

            {/* Total Assets */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 hover:border-[#d4af37]/50 transition-all duration-300">
              <div className="flex flex-col gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg w-fit">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Assets</p>
                  <p className="text-2xl font-bold">{totalAssets}</p>
                </div>
              </div>
            </div>

            {/* Total Heirs */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 hover:border-[#d4af37]/50 transition-all duration-300">
              <div className="flex flex-col gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg w-fit">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Family Heirs</p>
                  <p className="text-2xl font-bold">{totalHeirs}</p>
                </div>
              </div>
            </div>

            {/* Quick Action */}
            <div className="col-span-2 bg-gradient-to-r from-[#d4af37]/20 to-[#d4af37]/10 backdrop-blur-sm rounded-2xl p-5 border border-[#d4af37]/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#d4af37]/30 rounded-lg">
                    <svg className="w-6 h-6 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">Faraid Calculator</p>
                    <p className="text-white font-medium">Islamic Inheritance Ready</p>
                  </div>
                </div>
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
