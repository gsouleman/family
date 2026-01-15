import React, { useState } from 'react';
import { Asset, Heir, InheritanceShare, Distribution } from '../types';
import { calculateIslamicInheritance, formatPercentage, getRelationLabel } from '../utils/inheritance';
import { getRelationColor } from '../data/family';
import { useCurrency } from '@/contexts/CurrencyContext';

interface SaleWorkflowProps {
  asset: Asset;
  heirs: Heir[];
  onClose: () => void;
  onConfirmSale: (asset: Asset, salePrice: number, distribution: Distribution) => void;
}

const SaleWorkflow: React.FC<SaleWorkflowProps> = ({ asset, heirs, onClose, onConfirmSale }) => {
  const { formatCurrency } = useCurrency();
  const [step, setStep] = useState(1);

  const [salePrice, setSalePrice] = useState(asset.value.toString());
  const [isProcessing, setIsProcessing] = useState(false);

  const price = parseFloat(salePrice) || 0;
  const shares = calculateIslamicInheritance(heirs, price);

  const handleConfirmSale = () => {
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      const distribution: Distribution = {
        id: `dist-${Date.now()}`,
        assetId: asset.id,
        assetName: asset.name,
        totalAmount: price,
        saleDate: new Date().toISOString().split('T')[0],
        shares: shares,
        status: 'completed',
      };
      
      onConfirmSale(asset, price, distribution);
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/90 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Asset Sale & Distribution</h2>
              <p className="text-gray-300 mt-1">Sell asset and distribute proceeds according to Islamic inheritance</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-4 mt-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-all ${
                  step >= s ? 'bg-[#d4af37] text-primary' : 'bg-white/20 text-white'
                }`}>
                  {step > s ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : s}
                </div>
                <span className={`text-sm ${step >= s ? 'text-white' : 'text-gray-400'}`}>
                  {s === 1 ? 'Set Price' : s === 2 ? 'Review Distribution' : 'Confirm'}
                </span>
                {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-[#d4af37]' : 'bg-white/20'}`}></div>}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Step 1: Set Sale Price */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Asset Info */}
              <div className="flex gap-6 p-4 bg-gray-50 rounded-xl">
                <img
                  src={asset.image}
                  alt={asset.name}
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{asset.name}</h3>
                  <p className="text-gray-500 mt-1">{asset.description}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-sm text-gray-500">Current Value:</span>
                    <span className="text-lg font-bold text-primary">{formatCurrency(asset.value)}</span>
                  </div>
                </div>
              </div>

              {/* Sale Price Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sale Price
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">$</span>
                  <input
                    type="number"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    className="w-full pl-10 pr-4 py-4 border border-gray-200 rounded-xl text-2xl font-bold focus:ring-2 focus:ring-[#d4af37] focus:border-transparent outline-none"
                    placeholder="Enter sale price"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Enter the final sale price for inheritance distribution calculation
                </p>
              </div>

              {/* Quick Price Options */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSalePrice(asset.value.toString())}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                >
                  Current Value
                </button>
                <button
                  onClick={() => setSalePrice((asset.value * 1.1).toString())}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                >
                  +10%
                </button>
                <button
                  onClick={() => setSalePrice((asset.value * 0.9).toString())}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                >
                  -10%
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Review Distribution */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center p-4 bg-[#d4af37]/10 rounded-xl border border-[#d4af37]/30">
                <p className="text-sm text-gray-600">Total Amount to Distribute</p>
                <p className="text-3xl font-bold text-primary">{formatCurrency(price)}</p>
              </div>

              {/* Distribution List */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Inheritance Distribution (Faraid)</h4>
                {shares.map((share) => (
                  <div
                    key={share.heirId}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                        {share.heirName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{share.heirName}</p>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getRelationColor(share.relation)}`}>
                            {getRelationLabel(share.relation)}
                          </span>
                          <span className="text-xs text-gray-500">({share.shareFraction})</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">{formatCurrency(share.shareAmount)}</p>
                      <p className="text-sm text-gray-500">{formatPercentage(share.sharePercentage)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Distribution Bar */}
              <div className="p-4 bg-white border border-gray-200 rounded-xl">
                <p className="text-sm text-gray-600 mb-3">Distribution Visualization</p>
                <div className="h-6 bg-gray-100 rounded-full overflow-hidden flex">
                  {shares.map((share, index) => {
                    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-amber-500', 'bg-green-500', 'bg-indigo-500'];
                    return (
                      <div
                        key={share.heirId}
                        className={`${colors[index % colors.length]} transition-all duration-500 flex items-center justify-center text-white text-xs font-medium`}
                        style={{ width: `${share.sharePercentage}%` }}
                      >
                        {share.sharePercentage > 10 && `${share.sharePercentage.toFixed(0)}%`}
                      </div>
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-3 mt-3">
                  {shares.map((share, index) => {
                    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-amber-500', 'bg-green-500', 'bg-indigo-500'];
                    return (
                      <div key={share.heirId} className="flex items-center gap-2 text-sm">
                        <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}></div>
                        <span className="text-gray-600">{share.heirName}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="space-y-6">
              {isProcessing ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Processing Sale</h3>
                  <p className="text-gray-500">Calculating distributions and updating records...</p>
                </div>
              ) : (
                <>
                  <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
                    <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Complete Sale</h3>
                    <p className="text-gray-600">
                      Please review the details below and confirm the sale
                    </p>
                  </div>

                  {/* Summary */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">Asset</p>
                      <p className="font-semibold text-gray-900">{asset.name}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">Sale Price</p>
                      <p className="font-semibold text-[#d4af37]">{formatCurrency(price)}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">Heirs Receiving</p>
                      <p className="font-semibold text-gray-900">{shares.length} family members</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">Distribution Method</p>
                      <p className="font-semibold text-gray-900">Islamic Inheritance (Faraid)</p>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div>
                        <p className="font-medium text-amber-800">Important Notice</p>
                        <p className="text-sm text-amber-700 mt-1">
                          This action will mark the asset as sold and record the inheritance distribution.
                          All heirs will be notified of their respective shares.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-between">
          <button
            onClick={step === 1 ? onClose : () => setStep(step - 1)}
            disabled={isProcessing}
            className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors disabled:opacity-50"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={price <= 0}
              className="px-8 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleConfirmSale}
              disabled={isProcessing}
              className="px-8 py-3 bg-[#d4af37] hover:bg-[#c9a432] text-primary font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Confirm Sale & Distribute
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SaleWorkflow;
