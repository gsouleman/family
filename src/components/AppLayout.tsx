import React, { useState, useMemo } from 'react';
import { Asset, Heir, Distribution, Document as AppDocument } from '../types';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useData } from '@/contexts/DataContext';

import Navbar from './Navbar';
import Hero from './Hero';
import AssetGrid from './AssetGrid';
import FamilyTree from './FamilyTree';
import InheritanceCalculator from './InheritanceCalculator';
import DistributionDashboard from './DistributionDashboard';
import DocumentVault from './DocumentVault';
import TransactionHistory from './TransactionHistory';
import Footer from './Footer';
import AssetDetailModal from './AssetDetailModal';
import HeirDetailModal from './HeirDetailModal';
import SaleWorkflow from './SaleWorkflow';
import AddAssetModal from './AddAssetModal';
import SuccessNotification from './SuccessNotification';
import AuthModal from './AuthModal';
import LedgerDashboard from './LedgerDashboard';
import ForcePasswordChangeModal from './ForcePasswordChangeModal';

const AppLayout: React.FC = () => {
  const { user, mustChangePassword } = useAuth();
  const { formatCurrency } = useCurrency();
  const {
    assets,
    heirs,
    transactions,
    documents,
    notifications,
    distributions,
    addAsset,
    addDocument,
    markNotificationRead,
    addDistribution,
    addTransaction,
    updateAsset,
    addNotification
  } = useData();

  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [selectedHeir, setSelectedHeir] = useState<Heir | null>(null);
  const [assetToSell, setAssetToSell] = useState<Asset | null>(null);
  const [showAddAsset, setShowAddAsset] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authPromptMessage, setAuthPromptMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<{ message: string; amount?: number } | null>(null);

  // User request: "If asset is not for sale then it should not be included in the inheritance calculation"
  // We assume "calculation" implies the Total Asset Value used for inheritance projections.
  const activeAssets = useMemo(() => assets.filter(a => a.status === 'active' && a.isForSale), [assets]);
  const totalAssetValue = useMemo(() => activeAssets.reduce((sum, a) => sum + a.value, 0), [activeAssets]);

  const requireAuth = (action: () => void, message: string) => {
    if (user) {
      action();
    } else {
      setAuthPromptMessage(message);
      setShowAuthModal(true);
    }
  };

  const handleSelectAsset = (asset: Asset) => setSelectedAsset(asset);

  const handleSellAsset = (asset: Asset) => {
    requireAuth(() => {
      setSelectedAsset(null);
      setAssetToSell(asset);
    }, 'Sign in to sell assets and distribute inheritance');
  };

  const handleConfirmSale = (asset: Asset, salePrice: number, distribution: Distribution) => {
    updateAsset(asset.id, { status: 'sold' });
    addDistribution(distribution);
    addTransaction({
      id: `tx-${Date.now()}`,
      type: 'asset_sold',
      description: `${asset.name} sold and distributed`,
      amount: salePrice,
      date: new Date().toISOString().split('T')[0],
      relatedAssetId: asset.id,
    });
    addNotification({
      id: `notif-${Date.now()}`,
      title: 'Asset Sold & Distributed',
      message: `${asset.name} has been sold. Inheritance distributed to ${distribution.shares.length} heirs.`,
      date: new Date().toISOString().split('T')[0],
      read: false,
      type: 'distribution',
    });
    setAssetToSell(null);
    setSuccessMessage({ message: `${asset.name} sold successfully!`, amount: salePrice });
  };

  const handleAssetAdded = (assetData: Omit<Asset, 'id'>) => {
    setShowAddAsset(false);
    setSuccessMessage({ message: `${assetData.name} added to portfolio.`, amount: assetData.value });
  };

  const handleUploadDocument = (docData: Omit<AppDocument, 'id'>) => {
    addDocument(docData);
    setSuccessMessage({ message: `Document uploaded successfully.` });
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  if (mustChangePassword) {
    return <ForcePasswordChangeModal />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        notifications={notifications}
        onMarkNotificationRead={markNotificationRead}
        onOpenAuthModal={() => { setAuthPromptMessage(null); setShowAuthModal(true); }}
      />

      <Hero
        totalAssetValue={totalAssetValue}
        totalAssets={activeAssets.length}
        totalHeirs={heirs.length}
        onViewAssets={() => scrollToSection('assets')}
        onCalculate={() => requireAuth(() => scrollToSection('calculator'), 'Sign in to access the inheritance calculator')}
      />

      <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-gray-500 text-sm">Quick Actions:</span>
              <button onClick={() => requireAuth(() => setShowAddAsset(true), 'Sign in to add assets')} className="px-4 py-2 bg-[#1a365d] hover:bg-[#0f2744] text-white text-sm font-medium rounded-lg">Add Asset</button>
              <button onClick={() => requireAuth(() => scrollToSection('calculator'), 'Sign in to calculate')} className="px-4 py-2 bg-[#d4af37] hover:bg-[#c9a432] text-[#1a365d] text-sm font-medium rounded-lg">Calculate Inheritance</button>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm">
              <span className="text-gray-500">Total Portfolio:</span>
              <span className="font-bold text-[#d4af37] text-lg">{formatCurrency(totalAssetValue)}</span>
            </div>
          </div>
        </div>
      </div>

      <AssetGrid assets={assets} onSelectAsset={handleSelectAsset} onSellAsset={handleSellAsset} />
      <DistributionDashboard heirs={heirs} totalAssetValue={totalAssetValue} distributions={distributions} />
      <FamilyTree heirs={heirs} onSelectHeir={setSelectedHeir} />

      {user ? (
        <InheritanceCalculator heirs={heirs} totalAssetValue={totalAssetValue} activeAssets={assets.filter(a => a.status === 'active')} />
      ) : (
        <section id="calculator" className="py-16 bg-gradient-to-br from-[#1a365d] to-[#0f2744]">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Islamic Inheritance Calculator</h2>
            <p className="text-gray-300 mb-8">Sign in to access the Faraid calculator.</p>
            <button onClick={() => setShowAuthModal(true)} className="px-8 py-4 bg-[#d4af37] text-[#1a365d] font-semibold rounded-xl">Sign In to Access</button>
          </div>
        </section>
      )}

      <LedgerDashboard />

      <DocumentVault heirs={heirs} activeAssets={assets.filter(a => a.status === 'active')} />
      <TransactionHistory transactions={transactions} distributions={distributions} />
      <Footer />

      {selectedAsset && <AssetDetailModal asset={selectedAsset} onClose={() => setSelectedAsset(null)} onSell={handleSellAsset} />}
      {selectedHeir && <HeirDetailModal heir={selectedHeir} allHeirs={heirs} totalAssetValue={totalAssetValue} onClose={() => setSelectedHeir(null)} />}
      {assetToSell && <SaleWorkflow asset={assetToSell} heirs={heirs} onClose={() => setAssetToSell(null)} onConfirmSale={handleConfirmSale} />}
      {showAddAsset && <AddAssetModal onClose={() => setShowAddAsset(false)} onSuccess={handleAssetAdded} />}
      <AuthModal isOpen={showAuthModal} onClose={() => { setShowAuthModal(false); setAuthPromptMessage(null); }} />
      {successMessage && <SuccessNotification message={successMessage.message} amount={successMessage.amount} onClose={() => setSuccessMessage(null)} />}
    </div>
  );
};

export default AppLayout;
