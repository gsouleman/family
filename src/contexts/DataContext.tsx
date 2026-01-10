import React, { createContext, useContext, useState, useEffect } from 'react';
import { Asset, Heir, Transaction, Document, Notification, Distribution } from '../types';
import { initialAssets } from '../data/assets';
import { initialHeirs, initialTransactions, initialDocuments, initialNotifications, initialDistributions } from '../data/family';

interface DataContextType {
    assets: Asset[];
    heirs: Heir[];
    transactions: Transaction[];
    documents: Document[];
    notifications: Notification[];
    distributions: Distribution[];

    // Asset Actions
    addAsset: (asset: Omit<Asset, 'id'>) => void;
    updateAsset: (id: string, updates: Partial<Asset>) => void;
    deleteAsset: (id: string) => void;

    // Heir Actions
    addHeir: (heir: Omit<Heir, 'id'>) => void;
    updateHeir: (id: string, updates: Partial<Heir>) => void;
    deleteHeir: (id: string) => void;

    // Document Actions
    addDocument: (doc: Omit<Document, 'id'>) => void;
    deleteDocument: (id: string) => void;

    // Transaction Actions
    addTransaction: (tx: Transaction) => void;

    // Distribution Actions
    addDistribution: (dist: Distribution) => void;

    // Notification Actions
    addNotification: (notif: Notification) => void;
    markNotificationRead: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [assets, setAssets] = useState<Asset[]>(initialAssets);
    const [heirs, setHeirs] = useState<Heir[]>(initialHeirs);
    const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
    const [documents, setDocuments] = useState<Document[]>(initialDocuments);
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
    const [distributions, setDistributions] = useState<Distribution[]>(initialDistributions);

    // Asset Actions
    const addAsset = (assetData: Omit<Asset, 'id'>) => {
        const newAsset: Asset = { ...assetData, id: `asset-${Date.now()}` };
        setAssets(prev => [...prev, newAsset]);
        addTransaction({
            id: `tx-${Date.now()}`,
            type: 'asset_added',
            description: `${newAsset.name} added to portfolio`,
            amount: newAsset.value,
            date: new Date().toISOString().split('T')[0],
            relatedAssetId: newAsset.id
        });
    };

    const updateAsset = (id: string, updates: Partial<Asset>) => {
        setAssets(prev => prev.map(asset => asset.id === id ? { ...asset, ...updates } : asset));
    };

    const deleteAsset = (id: string) => {
        setAssets(prev => prev.filter(asset => asset.id !== id));
    };

    // Heir Actions
    const addHeir = (heirData: Omit<Heir, 'id'>) => {
        const newHeir: Heir = { ...heirData, id: `heir-${Date.now()}` };
        setHeirs(prev => [...prev, newHeir]);
        addTransaction({
            id: `tx-heir-${Date.now()}`,
            type: 'heir_added',
            description: `${newHeir.name} added as heir`,
            date: new Date().toISOString().split('T')[0],
            relatedHeirId: newHeir.id
        });
    };

    const updateHeir = (id: string, updates: Partial<Heir>) => {
        setHeirs(prev => prev.map(heir => heir.id === id ? { ...heir, ...updates } : heir));
    };

    const deleteHeir = (id: string) => {
        setHeirs(prev => prev.filter(heir => heir.id !== id));
    };

    // Document Actions
    const addDocument = (docData: Omit<Document, 'id'>) => {
        const newDoc: Document = { ...docData, id: `doc-${Date.now()}` };
        setDocuments(prev => [...prev, newDoc]);
        addTransaction({
            id: `tx-doc-${Date.now()}`,
            type: 'document_uploaded',
            description: `${newDoc.name} uploaded`,
            date: new Date().toISOString().split('T')[0],
            relatedAssetId: newDoc.relatedAssetId
        });
    };

    const deleteDocument = (id: string) => {
        setDocuments(prev => prev.filter(doc => doc.id !== id));
    };

    // Other Actions
    const addTransaction = (tx: Transaction) => {
        setTransactions(prev => [tx, ...prev]);
    };

    const addDistribution = (dist: Distribution) => {
        setDistributions(prev => [...prev, dist]);
    };

    const addNotification = (notif: Notification) => {
        setNotifications(prev => [notif, ...prev]);
    };

    const markNotificationRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    return (
        <DataContext.Provider
            value={{
                assets,
                heirs,
                transactions,
                documents,
                notifications,
                distributions,
                addAsset,
                updateAsset,
                deleteAsset,
                addHeir,
                updateHeir,
                deleteHeir,
                addDocument,
                deleteDocument,
                addTransaction,
                addDistribution,
                addNotification,
                markNotificationRead
            }}
        >
            {children}
        </DataContext.Provider>
    );
};
