export type AssetClassType = 
  | "stock" 
  | "mutual_fund" 
  | "gold" 
  | "silver" 
  | "ulip" 
  | "bank_deposit" 
  | "recurring_deposit" 
  | "ppf" 
  | "nsc" 
  | "kvp" 
  | "corporate_deposit" 
  | "property" 
  | "loan";

export interface AssetClass {
  id: number;
  name: string;
  type: AssetClassType;
  icon?: string;
}

export interface Holding {
  id: number;
  assetClassId: number;
  assetClass?: AssetClass;
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice?: number;
  lastUpdated?: Date;
  createdAt?: Date;
  profitLoss?: number;
  profitLossPercent?: number;
}

export interface Transaction {
  id: number;
  holdingId?: number;
  assetClassId: number;
  assetClass?: AssetClass;
  type: "buy" | "sell" | "dividend" | "bonus" | "split" | "sip";
  symbol: string;
  name: string;
  quantity: number;
  price: number;
  totalAmount: number;
  date: Date;
  notes?: string;
  createdAt?: Date;
}

export interface Dividend {
  id: number;
  holdingId?: number;
  assetClassId: number;
  assetClass?: AssetClass;
  symbol: string;
  name: string;
  amount: number;
  perShare?: number;
  exDate: Date;
  paymentDate?: Date;
  reinvested: boolean;
  createdAt?: Date;
}

export interface SIP {
  id: number;
  holdingId?: number;
  assetClassId: number;
  assetClass?: AssetClass;
  symbol: string;
  name: string;
  amount: number;
  frequency: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
  startDate: Date;
  endDate?: Date;
  lastInstallmentDate?: Date;
  nextInstallmentDate?: Date;
  status: "active" | "paused" | "completed";
  createdAt?: Date;
}

export interface Watchlist {
  id: number;
  name: string;
  items?: WatchlistItem[];
  createdAt?: Date;
}

export interface WatchlistItem {
  id: number;
  watchlistId: number;
  assetClassId: number;
  assetClass?: AssetClass;
  symbol: string;
  name: string;
  addedAt?: Date;
}

export interface Account {
  id: number;
  name: string;
  type: string;
  institution?: string;
  createdAt?: Date;
}

export interface PortfolioSummary {
  totalValue: number;
  totalInvested: number;
  totalProfitLoss: number;
  totalProfitLossPercent: number;
  dayChange: number;
  dayChangePercent: number;
  holdingsCount: number;
}

export interface PortfolioHistoryEntry {
  id: number;
  date: Date;
  totalValue: number;
  dayChange?: number;
  dayChangePercent?: number;
}

export const ASSET_CLASSES: { type: AssetClassType; name: string; icon: string }[] = [
  { type: "stock", name: "Stocks", icon: "📈" },
  { type: "mutual_fund", name: "Mutual Funds", icon: "📊" },
  { type: "gold", name: "Gold", icon: "🥇" },
  { type: "silver", name: "Silver", icon: "🥈" },
  { type: "ulip", name: "ULIPs", icon: "🛡️" },
  { type: "bank_deposit", name: "Bank Deposits", icon: "🏦" },
  { type: "recurring_deposit", name: "Recurring Deposits", icon: "💰" },
  { type: "ppf", name: "PPF", icon: "🏛️" },
  { type: "nsc", name: "NSC", icon: "📜" },
  { type: "kvp", name: "KVP", icon: "📋" },
  { type: "corporate_deposit", name: "Corporate Deposits", icon: "🏢" },
  { type: "property", name: "Property", icon: "🏠" },
  { type: "loan", name: "Loans", icon: "💳" },
];