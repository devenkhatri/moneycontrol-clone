import { db } from "@/db";
import { 
  assetClasses, 
  holdings, 
  transactions, 
  dividends, 
  sips, 
  sipInstallments,
  watchlists,
  watchlistItems,
  accounts,
  portfolioHistory 
} from "@/db/schema";
import { eq, desc, asc, gte, sql } from "drizzle-orm";
import type { AssetClass, Holding, Transaction, Dividend, SIP, Watchlist, Account, PortfolioSummary, PortfolioHistoryEntry, AssetClassType } from "@/lib/types";

export async function getAssetClasses(): Promise<AssetClass[]> {
  return db.select().from(assetClasses).orderBy(asc(assetClasses.name)) as Promise<AssetClass[]>;
}

export async function createAssetClass(data: { name: string; type: AssetClassType; icon?: string }): Promise<AssetClass> {
  const [result] = await db.insert(assetClasses).values(data).returning();
  return result as AssetClass;
}

export async function getHoldings(): Promise<Holding[]> {
  const results = await db.select().from(holdings).orderBy(desc(holdings.createdAt));
  return results.map(h => ({
    ...h,
    profitLoss: h.currentPrice ? (h.currentPrice - h.avgPrice) * h.quantity : undefined,
    profitLossPercent: h.currentPrice && h.avgPrice ? ((h.currentPrice - h.avgPrice) / h.avgPrice) * 100 : undefined,
  })) as Holding[];
}

export async function getHoldingById(id: number): Promise<Holding | null> {
  const [result] = await db.select().from(holdings).where(eq(holdings.id, id));
  return (result || null) as Holding | null;
}

export async function createHolding(data: Partial<Holding>): Promise<Holding> {
  const [result] = await db.insert(holdings).values({
    assetClassId: data.assetClassId!,
    symbol: data.symbol!,
    name: data.name!,
    quantity: data.quantity ?? 0,
    avgPrice: data.avgPrice ?? 0,
    currentPrice: data.currentPrice,
  }).returning();
  return result as Holding;
}

export async function updateHolding(id: number, data: Partial<Holding>): Promise<Holding> {
  const [result] = await db.update(holdings).set(data).where(eq(holdings.id, id)).returning();
  return result as Holding;
}

export async function deleteHolding(id: number): Promise<void> {
  await db.delete(holdings).where(eq(holdings.id, id));
}

export async function getTransactions(holdingId?: number): Promise<Transaction[]> {
  let query = db.select().from(transactions).orderBy(desc(transactions.date));
  if (holdingId) {
    return query.where(eq(transactions.holdingId, holdingId)) as Promise<Transaction[]>;
  }
  return query as Promise<Transaction[]>;
}

export async function createTransaction(data: Partial<Transaction>): Promise<Transaction> {
  const [result] = await db.insert(transactions).values({
    holdingId: data.holdingId,
    assetClassId: data.assetClassId!,
    type: data.type!,
    symbol: data.symbol!,
    name: data.name!,
    quantity: data.quantity!,
    price: data.price!,
    totalAmount: data.totalAmount!,
    date: data.date!,
    notes: data.notes,
  }).returning();
  return result as Transaction;
}

export async function deleteTransaction(id: number): Promise<void> {
  await db.delete(transactions).where(eq(transactions.id, id));
}

export async function getDividends(holdingId?: number): Promise<Dividend[]> {
  let query = db.select().from(dividends).orderBy(desc(dividends.exDate));
  if (holdingId) {
    return query.where(eq(dividends.holdingId, holdingId)) as Promise<Dividend[]>;
  }
  return query as Promise<Dividend[]>;
}

export async function createDividend(data: Partial<Dividend>): Promise<Dividend> {
  const [result] = await db.insert(dividends).values({
    holdingId: data.holdingId,
    assetClassId: data.assetClassId!,
    symbol: data.symbol!,
    name: data.name!,
    amount: data.amount!,
    perShare: data.perShare,
    exDate: data.exDate!,
    paymentDate: data.paymentDate,
    reinvested: data.reinvested ?? false,
  }).returning();
  return result as Dividend;
}

export async function getSips(status?: "active" | "paused" | "completed"): Promise<SIP[]> {
  let query = db.select().from(sips).orderBy(asc(sips.nextInstallmentDate));
  if (status) {
    return query.where(eq(sips.status, status)) as Promise<SIP[]>;
  }
  return query as Promise<SIP[]>;
}

export async function createSip(data: Partial<SIP>): Promise<SIP> {
  const [result] = await db.insert(sips).values({
    holdingId: data.holdingId,
    assetClassId: data.assetClassId!,
    symbol: data.symbol!,
    name: data.name!,
    amount: data.amount!,
    frequency: data.frequency!,
    startDate: data.startDate!,
    endDate: data.endDate,
    lastInstallmentDate: data.lastInstallmentDate,
    nextInstallmentDate: data.nextInstallmentDate,
    status: data.status ?? "active",
  }).returning();
  return result as SIP;
}

export async function updateSip(id: number, data: Partial<SIP>): Promise<SIP> {
  const [result] = await db.update(sips).set(data).where(eq(sips.id, id)).returning();
  return result as SIP;
}

export async function deleteSip(id: number): Promise<void> {
  await db.delete(sips).where(eq(sips.id, id));
}

export async function getSipInstallments(sipId: number) {
  return db.select().from(sipInstallments).where(eq(sipInstallments.sipId, sipId)).orderBy(desc(sipInstallments.date));
}

export async function getWatchlists(): Promise<Watchlist[]> {
  const lists = await db.select().from(watchlists).orderBy(desc(watchlists.createdAt));
  const result: any[] = [];
  for (const list of lists) {
    const items = await db.select().from(watchlistItems).where(eq(watchlistItems.watchlistId, list.id));
    result.push({ ...list, items });
  }
  return result as Watchlist[];
}

export async function createWatchlist(name: string): Promise<Watchlist> {
  const [result] = await db.insert(watchlists).values({ name }).returning();
  return result as Watchlist;
}

export async function addToWatchlist(watchlistId: number, data: { assetClassId: number; symbol: string; name: string }) {
  const [result] = await db.insert(watchlistItems).values({ watchlistId, ...data }).returning();
  return result;
}

export async function removeFromWatchlist(id: number): Promise<void> {
  await db.delete(watchlistItems).where(eq(watchlistItems.id, id));
}

export async function deleteWatchlist(id: number): Promise<void> {
  await db.delete(watchlistItems).where(eq(watchlistItems.watchlistId, id));
  await db.delete(watchlists).where(eq(watchlists.id, id));
}

export async function getAccounts(): Promise<Account[]> {
  return db.select().from(accounts).orderBy(desc(accounts.createdAt)) as Promise<Account[]>;
}

export async function createAccount(data: { name: string; type: string; institution?: string }): Promise<Account> {
  const [result] = await db.insert(accounts).values(data).returning();
  return result as Account;
}

export async function getPortfolioSummary(): Promise<PortfolioSummary> {
  const allHoldings = await db.select().from(holdings);
  
  let totalValue = 0;
  let totalInvested = 0;
  let holdingsCount = 0;
  
  for (const h of allHoldings) {
    const currentPrice = h.currentPrice || h.avgPrice;
    totalValue += currentPrice * h.quantity;
    totalInvested += h.avgPrice * h.quantity;
    holdingsCount++;
  }
  
  const totalProfitLoss = totalValue - totalInvested;
  const totalProfitLossPercent = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayHistory = await db.select()
    .from(portfolioHistory)
    .where(gte(portfolioHistory.date, today))
    .orderBy(desc(portfolioHistory.date))
    .limit(1);
  
  const dayChange = todayHistory[0]?.dayChange || 0;
  const dayChangePercent = todayHistory[0]?.dayChangePercent || 0;
  
  return {
    totalValue,
    totalInvested,
    totalProfitLoss,
    totalProfitLossPercent,
    dayChange,
    dayChangePercent,
    holdingsCount,
  };
}

export async function getPortfolioHistory(days: number = 30): Promise<PortfolioHistoryEntry[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);
  
  return db.select()
    .from(portfolioHistory)
    .where(gte(portfolioHistory.date, startDate))
    .orderBy(asc(portfolioHistory.date)) as Promise<PortfolioHistoryEntry[]>;
}

export async function addPortfolioSnapshot(totalValue: number, dayChange: number, dayChangePercent: number): Promise<void> {
  await db.insert(portfolioHistory).values({
    date: new Date(),
    totalValue,
    dayChange,
    dayChangePercent,
  });
}

export async function initializeDefaultAssetClasses(): Promise<void> {
  const existing = await db.select().from(assetClasses);
  if (existing.length === 0) {
    const defaults = [
      { name: "Stocks", type: "stock" as AssetClassType, icon: "📈" },
      { name: "Mutual Funds", type: "mutual_fund" as AssetClassType, icon: "📊" },
      { name: "Gold", type: "gold" as AssetClassType, icon: "🥇" },
      { name: "Silver", type: "silver" as AssetClassType, icon: "🥈" },
      { name: "ULIPs", type: "ulip" as AssetClassType, icon: "🛡️" },
      { name: "Bank Deposits", type: "bank_deposit" as AssetClassType, icon: "🏦" },
      { name: "Recurring Deposits", type: "recurring_deposit" as AssetClassType, icon: "💰" },
      { name: "PPF", type: "ppf" as AssetClassType, icon: "🏛️" },
      { name: "NSC", type: "nsc" as AssetClassType, icon: "📜" },
      { name: "KVP", type: "kvp" as AssetClassType, icon: "📋" },
      { name: "Corporate Deposits", type: "corporate_deposit" as AssetClassType, icon: "🏢" },
      { name: "Property", type: "property" as AssetClassType, icon: "🏠" },
      { name: "Loans", type: "loan" as AssetClassType, icon: "💳" },
    ];
    await db.insert(assetClasses).values(defaults);
  }
}