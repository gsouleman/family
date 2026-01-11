// Asset Types
// Asset Types
export type AssetCategory = 'property' | 'investment' | 'vehicle' | 'cash' | 'business' | 'other';
export type AssetStatus = 'active' | 'sold' | 'pending';

export interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  value: number;
  purchaseDate: string;
  description: string;
  image: string;
  status: AssetStatus;
  isForSale: boolean;
  location?: string;
  documents?: string[];
}

// Ledger Types
export type LedgerType = 'INCOME' | 'EXPENSE' | 'CREDITOR' | 'DEBTOR';
export type LedgerCategory = 'SALARY' | 'BUSINESS' | 'RENTAL' | 'DIVIDEND' | 'OTHER_INCOME' | 'UTILITIES' | 'MAINTENANCE' | 'TAX' | 'DEBT' | 'PERSONAL' | 'OTHER_EXPENSE' | 'LOAN' | 'MORTGAGE';

export interface LedgerEntry {
  id: string;
  title: string;
  amount: number;
  type: LedgerType;
  category: LedgerCategory;
  date: string;
  description?: string;
  createdAt: string;
}

// Family/Heir Types
export type RelationType = HeirRelation;
export type HeirRelation =
  | 'spouse_wife'
  | 'spouse_husband'
  | 'son'
  | 'daughter'
  | 'father'
  | 'mother'
  | 'brother'
  | 'sister'
  | 'grandfather'
  | 'grandmother';

export interface Heir {
  id: string;
  name: string;
  relation: HeirRelation;
  avatar: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
}

// Inheritance Distribution
export interface InheritanceShare {
  heirId: string;
  heirName: string;
  relation: HeirRelation;
  sharePercentage: number;
  shareAmount: number;
  shareFraction: string;
}

export interface Distribution {
  id: string;
  assetId: string;
  assetName: string;
  totalAmount: number;
  saleDate: string;
  shares: InheritanceShare[];
  status: 'pending' | 'distributed' | 'completed';
}

// Transaction Types
export type TransactionType = 'asset_added' | 'asset_sold' | 'distribution_completed' | 'document_uploaded' | 'heir_added' | 'income_added' | 'expense_added';

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  amount?: number;
  date: string;
  relatedAssetId?: string;
  relatedHeirId?: string;
}

// Document Types
export interface Document {
  id: string;
  name: string;
  type: 'will' | 'deed' | 'certificate' | 'contract' | 'other' | 'creditor_certificate' | 'debtor_certificate';
  uploadDate: string;
  fileSize: string;
  relatedAssetId?: string;
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'sale' | 'distribution' | 'document' | 'general' | 'ledger';
}
