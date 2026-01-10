import React, { createContext, useContext, useState, useEffect } from 'react';
import { Asset, Heir, Transaction, Document, Notification, Distribution } from '../types';
import { api } from '../lib/api';
import { initialTransactions, initialDocuments, initialNotifications, initialDistributions } from '../data/family';

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
    const [assets, setAssets] = useState<Asset[]>([]);
    const [heirs, setHeirs] = useState<Heir[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
    const [documents, setDocuments] = useState<Document[]>(initialDocuments);
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
    const [distributions, setDistributions] = useState<Distribution[]>(initialDistributions);

    // Initial Fetch
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [fetchedAssets, fetchedHeirs] = await Promise.all([
                    api.getAssets(),
                    api.getHeirs()
                ]);
                setAssets(fetchedAssets);
                setHeirs(fetchedHeirs);
            } catch (error) {
                console.error('Failed to fetch initial data:', error);
                // Fallback to mock data or partial data could go here, 
                // but for now we let it remain empty or show error toast
            }
        };
        fetchData();
    }, []);

    // Asset Actions
    const addAsset = async (assetData: Omit<Asset, 'id'>) => {
        try {
            const newAsset = await api.createAsset(assetData);
            setAssets(prev => [newAsset, ...prev]);

            addTransaction({
                id: `tx-${Date.now()}`,
                type: 'asset_added',
                description: `${newAsset.name} added to portfolio`,
                amount: newAsset.value,
                date: new Date().toISOString().split('T')[0],
                relatedAssetId: newAsset.id
            });
        } catch (error) {
            console.error('Failed to add asset:', error);
        }
    };

    const updateAsset = async (id: string, updates: Partial<Asset>) => {
        try {
            const updatedAsset = await api.updateAsset(id, updates);
            setAssets(prev => prev.map(asset => asset.id === id ? updatedAsset : asset));
        } catch (error) {
            console.error('Failed to update asset:', error);
        }
    };

    const deleteAsset = async (id: string) => {
        try {
            await api.deleteAsset(id);
            setAssets(prev => prev.filter(asset => asset.id !== id));
        } catch (error) {
            console.error('Failed to delete asset:', error);
        }
    };

    // Heir Actions
    const addHeir = async (heirData: Omit<Heir, 'id'>) => {
        try {
            const newHeir = await api.createHeir(heirData);
            setHeirs(prev => [newHeir, ...prev]);

            addTransaction({
                id: `tx-heir-${Date.now()}`,
                type: 'heir_added',
                description: `${newHeir.name} added as heir`,
                date: new Date().toISOString().split('T')[0],
                relatedHeirId: newHeir.id
            });
        } catch (error) {
            console.error('Failed to add heir:', error);
        }
    };

    const updateHeir = async (id: string, updates: Partial<Heir>) => {
        try {
            const updatedHeir = await api.updateHeir(id, updates);
            setHeirs(prev => prev.map(heir => heir.id === id ? updatedHeir : heir));
        } catch (error) {
            console.error('Failed to update heir:', error);
        }
    };

    const deleteHeir = async (id: string) => {
        try {
            await api.deleteHeir(id);
            setHeirs(prev => prev.filter(heir => heir.id !== id));
        } catch (error) {
            console.error('Failed to delete heir:', error);
        }
    };

    // Document Actions (Still Mocked for now)
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
