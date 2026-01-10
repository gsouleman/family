import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Country {
  code: string;
  name: string;
  currency: string;
  currencySymbol: string;
  locale: string;
  flag: string;
}

export const countries: Country[] = [
  // Central African CFA franc countries
  { code: 'CM', name: 'Cameroon', currency: 'XAF', currencySymbol: 'FCFA', locale: 'fr-CM', flag: '🇨🇲' },
  { code: 'CF', name: 'Central African Republic', currency: 'XAF', currencySymbol: 'FCFA', locale: 'fr-CF', flag: '🇨🇫' },
  { code: 'TD', name: 'Chad', currency: 'XAF', currencySymbol: 'FCFA', locale: 'fr-TD', flag: '🇹🇩' },
  { code: 'CG', name: 'Republic of the Congo', currency: 'XAF', currencySymbol: 'FCFA', locale: 'fr-CG', flag: '🇨🇬' },
  { code: 'GQ', name: 'Equatorial Guinea', currency: 'XAF', currencySymbol: 'FCFA', locale: 'es-GQ', flag: '🇬🇶' },
  { code: 'GA', name: 'Gabon', currency: 'XAF', currencySymbol: 'FCFA', locale: 'fr-GA', flag: '🇬🇦' },
  
  // West African CFA franc countries
  { code: 'BJ', name: 'Benin', currency: 'XOF', currencySymbol: 'FCFA', locale: 'fr-BJ', flag: '🇧🇯' },
  { code: 'BF', name: 'Burkina Faso', currency: 'XOF', currencySymbol: 'FCFA', locale: 'fr-BF', flag: '🇧🇫' },
  { code: 'CI', name: "Côte d'Ivoire", currency: 'XOF', currencySymbol: 'FCFA', locale: 'fr-CI', flag: '🇨🇮' },
  { code: 'GW', name: 'Guinea-Bissau', currency: 'XOF', currencySymbol: 'FCFA', locale: 'pt-GW', flag: '🇬🇼' },
  { code: 'ML', name: 'Mali', currency: 'XOF', currencySymbol: 'FCFA', locale: 'fr-ML', flag: '🇲🇱' },
  { code: 'NE', name: 'Niger', currency: 'XOF', currencySymbol: 'FCFA', locale: 'fr-NE', flag: '🇳🇪' },
  { code: 'SN', name: 'Senegal', currency: 'XOF', currencySymbol: 'FCFA', locale: 'fr-SN', flag: '🇸🇳' },
  { code: 'TG', name: 'Togo', currency: 'XOF', currencySymbol: 'FCFA', locale: 'fr-TG', flag: '🇹🇬' },
  
  // Other African countries
  { code: 'NG', name: 'Nigeria', currency: 'NGN', currencySymbol: '₦', locale: 'en-NG', flag: '🇳🇬' },
  { code: 'GH', name: 'Ghana', currency: 'GHS', currencySymbol: 'GH₵', locale: 'en-GH', flag: '🇬🇭' },
  { code: 'KE', name: 'Kenya', currency: 'KES', currencySymbol: 'KSh', locale: 'en-KE', flag: '🇰🇪' },
  { code: 'ZA', name: 'South Africa', currency: 'ZAR', currencySymbol: 'R', locale: 'en-ZA', flag: '🇿🇦' },
  { code: 'EG', name: 'Egypt', currency: 'EGP', currencySymbol: 'E£', locale: 'ar-EG', flag: '🇪🇬' },
  { code: 'MA', name: 'Morocco', currency: 'MAD', currencySymbol: 'DH', locale: 'ar-MA', flag: '🇲🇦' },
  { code: 'TN', name: 'Tunisia', currency: 'TND', currencySymbol: 'DT', locale: 'ar-TN', flag: '🇹🇳' },
  { code: 'DZ', name: 'Algeria', currency: 'DZD', currencySymbol: 'DA', locale: 'ar-DZ', flag: '🇩🇿' },
  
  // Middle East
  { code: 'AE', name: 'United Arab Emirates', currency: 'AED', currencySymbol: 'AED', locale: 'ar-AE', flag: '🇦🇪' },
  { code: 'SA', name: 'Saudi Arabia', currency: 'SAR', currencySymbol: 'SAR', locale: 'ar-SA', flag: '🇸🇦' },
  { code: 'QA', name: 'Qatar', currency: 'QAR', currencySymbol: 'QR', locale: 'ar-QA', flag: '🇶🇦' },
  { code: 'KW', name: 'Kuwait', currency: 'KWD', currencySymbol: 'KD', locale: 'ar-KW', flag: '🇰🇼' },
  { code: 'BH', name: 'Bahrain', currency: 'BHD', currencySymbol: 'BD', locale: 'ar-BH', flag: '🇧🇭' },
  { code: 'OM', name: 'Oman', currency: 'OMR', currencySymbol: 'OMR', locale: 'ar-OM', flag: '🇴🇲' },
  { code: 'JO', name: 'Jordan', currency: 'JOD', currencySymbol: 'JD', locale: 'ar-JO', flag: '🇯🇴' },
  { code: 'TR', name: 'Turkey', currency: 'TRY', currencySymbol: '₺', locale: 'tr-TR', flag: '🇹🇷' },
  
  // Asia
  { code: 'MY', name: 'Malaysia', currency: 'MYR', currencySymbol: 'RM', locale: 'ms-MY', flag: '🇲🇾' },
  { code: 'ID', name: 'Indonesia', currency: 'IDR', currencySymbol: 'Rp', locale: 'id-ID', flag: '🇮🇩' },
  { code: 'PK', name: 'Pakistan', currency: 'PKR', currencySymbol: 'Rs', locale: 'en-PK', flag: '🇵🇰' },
  { code: 'BD', name: 'Bangladesh', currency: 'BDT', currencySymbol: '৳', locale: 'bn-BD', flag: '🇧🇩' },
  { code: 'IN', name: 'India', currency: 'INR', currencySymbol: '₹', locale: 'en-IN', flag: '🇮🇳' },
  
  // Europe & Americas
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', currencySymbol: '£', locale: 'en-GB', flag: '🇬🇧' },
  { code: 'FR', name: 'France', currency: 'EUR', currencySymbol: '€', locale: 'fr-FR', flag: '🇫🇷' },
  { code: 'DE', name: 'Germany', currency: 'EUR', currencySymbol: '€', locale: 'de-DE', flag: '🇩🇪' },
  { code: 'US', name: 'United States', currency: 'USD', currencySymbol: '$', locale: 'en-US', flag: '🇺🇸' },
  { code: 'CA', name: 'Canada', currency: 'CAD', currencySymbol: 'CA$', locale: 'en-CA', flag: '🇨🇦' },
];

interface CurrencyContextType {
  country: Country;
  setCountry: (country: Country) => void;
  formatCurrency: (amount: number) => string;
  formatCurrencyCompact: (amount: number) => string;
}

const defaultCountry = countries.find(c => c.code === 'CM')!; // Cameroon as default (XAF)

const CurrencyContext = createContext<CurrencyContextType>({
  country: defaultCountry,
  setCountry: () => {},
  formatCurrency: () => '',
  formatCurrencyCompact: () => '',
});

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [country, setCountryState] = useState<Country>(() => {
    // Try to load from localStorage
    const saved = localStorage.getItem('selectedCountry');
    if (saved) {
      const parsed = JSON.parse(saved);
      const found = countries.find(c => c.code === parsed.code);
      if (found) return found;
    }
    return defaultCountry;
  });

  useEffect(() => {
    localStorage.setItem('selectedCountry', JSON.stringify(country));
  }, [country]);

  const setCountry = (newCountry: Country) => {
    setCountryState(newCountry);
  };

  const formatCurrency = (amount: number): string => {
    // For XAF and XOF, use custom formatting since Intl doesn't always handle them well
    if (country.currency === 'XAF' || country.currency === 'XOF') {
      const formatted = new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
      return `${formatted} FCFA`;
    }

    try {
      return new Intl.NumberFormat(country.locale, {
        style: 'currency',
        currency: country.currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    } catch {
      // Fallback formatting
      const formatted = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
      return `${country.currencySymbol} ${formatted}`;
    }
  };

  const formatCurrencyCompact = (amount: number): string => {
    const symbol = country.currency === 'XAF' || country.currency === 'XOF' ? 'FCFA' : country.currencySymbol;
    
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)}B ${symbol}`;
    } else if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M ${symbol}`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K ${symbol}`;
    }
    return formatCurrency(amount);
  };

  return (
    <CurrencyContext.Provider value={{ country, setCountry, formatCurrency, formatCurrencyCompact }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyContext;
