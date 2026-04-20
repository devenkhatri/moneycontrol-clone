"use client";

import { useState, useEffect } from "react";
import { ASSET_CLASSES, type AssetClassType } from "@/lib/types";

interface PortfolioSummary {
  totalValue: number;
  totalInvested: number;
  totalProfitLoss: number;
  totalProfitLossPercent: number;
  dayChange: number;
  dayChangePercent: number;
  holdingsCount: number;
}

interface Holding {
  id: number;
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  profitLoss?: number;
  profitLossPercent?: number;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAddHolding, setShowAddHolding] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAddSip, setShowAddSip] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  const summary: PortfolioSummary = {
    totalValue: 0,
    totalInvested: 0,
    totalProfitLoss: 0,
    totalProfitLossPercent: 0,
    dayChange: 0,
    dayChangePercent: 0,
    holdingsCount: 0,
  };

  const holdings: Holding[] = [];
  const assetClasses = ASSET_CLASSES;

  const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "holdings", label: "Holdings" },
    { id: "transactions", label: "Transactions" },
    { id: "sip", label: "SIPs" },
    { id: "watchlist", label: "Watchlist" },
    { id: "dividends", label: "Dividends" },
  ];

  return (
    <main className="min-h-screen bg-neutral-900 text-white">
      <header className="border-b border-neutral-800 p-4 sticky top-0 bg-neutral-900 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span>💼</span> Portfolio
          </h1>
          <nav className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-lg text-sm transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {dbError && (
          <div className="bg-yellow-900/50 border border-yellow-700 rounded-lg p-4 text-yellow-200 text-sm">
            {dbError}
          </div>
        )}

        {activeTab === "dashboard" && (
          <>
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-neutral-800 rounded-lg p-4">
                <p className="text-neutral-400 text-sm">Total Value</p>
                <p className="text-2xl font-bold">{formatCurrency(summary.totalValue)}</p>
              </div>
              <div className="bg-neutral-800 rounded-lg p-4">
                <p className="text-neutral-400 text-sm">Total Invested</p>
                <p className="text-2xl font-bold">{formatCurrency(summary.totalInvested)}</p>
              </div>
              <div className="bg-neutral-800 rounded-lg p-4">
                <p className="text-neutral-400 text-sm">Profit/Loss</p>
                <p className={`text-2xl font-bold ${summary.totalProfitLoss >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {summary.totalProfitLoss >= 0 ? "+" : "-"}{formatCurrency(Math.abs(summary.totalProfitLoss))}
                </p>
              </div>
              <div className="bg-neutral-800 rounded-lg p-4">
                <p className="text-neutral-400 text-sm">Return</p>
                <p className={`text-2xl font-bold ${summary.totalProfitLossPercent >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {summary.totalProfitLossPercent >= 0 ? "+" : ""}{summary.totalProfitLossPercent.toFixed(2)}%
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">Asset Classes</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {assetClasses.map((ac) => (
                  <button
                    key={ac.type}
                    onClick={() => setActiveTab("holdings")}
                    className="bg-neutral-800 hover:bg-neutral-700 rounded-lg p-4 text-left transition"
                  >
                    <span className="text-2xl">{ac.icon}</span>
                    <p className="text-sm mt-2 truncate">{ac.name}</p>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Quick Actions</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => setShowAddHolding(true)}
                  className="bg-neutral-800 hover:bg-neutral-700 rounded-lg p-4 text-left transition"
                >
                  <span className="text-xl">➕</span>
                  <p className="text-sm mt-2">Add Holding</p>
                </button>
                <button
                  onClick={() => setShowAddTransaction(true)}
                  className="bg-neutral-800 hover:bg-neutral-700 rounded-lg p-4 text-left transition"
                >
                  <span className="text-xl">💳</span>
                  <p className="text-sm mt-2">Add Transaction</p>
                </button>
                <button
                  onClick={() => setShowAddSip(true)}
                  className="bg-neutral-800 hover:bg-neutral-700 rounded-lg p-4 text-left transition"
                >
                  <span className="text-xl">📅</span>
                  <p className="text-sm mt-2">Add SIP</p>
                </button>
                <button
                  onClick={() => setActiveTab("watchlist")}
                  className="bg-neutral-800 hover:bg-neutral-700 rounded-lg p-4 text-left transition"
                >
                  <span className="text-xl">👁️</span>
                  <p className="text-sm mt-2">Watchlist</p>
                </button>
              </div>
            </section>
          </>
        )}

        {activeTab === "holdings" && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Holdings</h2>
              <button
                onClick={() => setShowAddHolding(true)}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm transition"
              >
                + Add Holding
              </button>
            </div>
            <div className="bg-neutral-800 rounded-lg p-8 text-center">
              <p className="text-neutral-400 mb-4">No holdings yet. Start tracking your investments!</p>
              <button
                onClick={() => setShowAddHolding(true)}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
              >
                + Add First Holding
              </button>
            </div>
          </section>
        )}

        {activeTab === "transactions" && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Transactions</h2>
              <button
                onClick={() => setShowAddTransaction(true)}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm transition"
              >
                + Add Transaction
              </button>
            </div>
            <div className="bg-neutral-800 rounded-lg p-8 text-center">
              <p className="text-neutral-400">No transactions yet.</p>
            </div>
          </section>
        )}

        {activeTab === "sip" && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">SIPs</h2>
              <button
                onClick={() => setShowAddSip(true)}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm transition"
              >
                + Add SIP
              </button>
            </div>
            <div className="bg-neutral-800 rounded-lg p-8 text-center">
              <p className="text-neutral-400">No active SIPs.</p>
            </div>
          </section>
        )}

        {activeTab === "watchlist" && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Watchlist</h2>
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm transition">
                + Create Watchlist
              </button>
            </div>
            <div className="bg-neutral-800 rounded-lg p-8 text-center">
              <p className="text-neutral-400">No watchlists yet.</p>
            </div>
          </section>
        )}

        {activeTab === "dividends" && (
          <section>
            <h2 className="text-lg font-semibold mb-3">Dividends</h2>
            <div className="bg-neutral-800 rounded-lg p-8 text-center">
              <p className="text-neutral-400">No dividends recorded.</p>
            </div>
          </section>
        )}
      </div>

      {showAddHolding && (
        <AddHoldingModal onClose={() => setShowAddHolding(false)} />
      )}

      {showAddTransaction && (
        <AddTransactionModal onClose={() => setShowAddTransaction(false)} />
      )}

      {showAddSip && (
        <AddSipModal onClose={() => setShowAddSip(false)} />
      )}
    </main>
  );
}

function AddHoldingModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    symbol: "",
    name: "",
    assetClass: "stock" as AssetClassType,
    quantity: "",
    avgPrice: "",
    currentPrice: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Add holding:", formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-800 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Add Holding</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Asset Class</label>
            <select
              value={formData.assetClass}
              onChange={(e) => setFormData({ ...formData, assetClass: e.target.value as AssetClassType })}
              className="w-full bg-neutral-700 rounded-lg p-2 text-white"
            >
              {ASSET_CLASSES.map((ac) => (
                <option key={ac.type} value={ac.type}>{ac.icon} {ac.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Symbol</label>
            <input
              type="text"
              value={formData.symbol}
              onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
              className="w-full bg-neutral-700 rounded-lg p-2 text-white"
              placeholder="e.g., RELIANCE"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-neutral-700 rounded-lg p-2 text-white"
              placeholder="e.g., Reliance Industries Ltd"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-neutral-400 mb-1">Quantity</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full bg-neutral-700 rounded-lg p-2 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-neutral-400 mb-1">Avg Price (₹)</label>
              <input
                type="number"
                value={formData.avgPrice}
                onChange={(e) => setFormData({ ...formData, avgPrice: e.target.value })}
                className="w-full bg-neutral-700 rounded-lg p-2 text-white"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Current Price (₹)</label>
            <input
              type="number"
              value={formData.currentPrice}
              onChange={(e) => setFormData({ ...formData, currentPrice: e.target.value })}
              className="w-full bg-neutral-700 rounded-lg p-2 text-white"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-neutral-700 hover:bg-neutral-600 py-2 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg transition"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddTransactionModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    type: "buy",
    symbol: "",
    name: "",
    quantity: "",
    price: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Add transaction:", formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-800 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Add Transaction</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full bg-neutral-700 rounded-lg p-2 text-white"
            >
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
              <option value="dividend">Dividend</option>
              <option value="bonus">Bonus</option>
              <option value="split">Split</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Symbol</label>
            <input
              type="text"
              value={formData.symbol}
              onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
              className="w-full bg-neutral-700 rounded-lg p-2 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-neutral-700 rounded-lg p-2 text-white"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-neutral-400 mb-1">Quantity</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full bg-neutral-700 rounded-lg p-2 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-neutral-400 mb-1">Price (₹)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-neutral-700 rounded-lg p-2 text-white"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full bg-neutral-700 rounded-lg p-2 text-white"
              required
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-neutral-700 hover:bg-neutral-600 py-2 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg transition"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddSipModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    symbol: "",
    name: "",
    amount: "",
    frequency: "monthly",
    startDate: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Add SIP:", formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-800 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Add SIP</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Fund Symbol</label>
            <input
              type="text"
              value={formData.symbol}
              onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
              className="w-full bg-neutral-700 rounded-lg p-2 text-white"
              placeholder="e.g., SIP001"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Fund Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-neutral-700 rounded-lg p-2 text-white"
              placeholder="e.g., HDFC Top 100 Fund"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-neutral-400 mb-1">Amount (₹)</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full bg-neutral-700 rounded-lg p-2 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-neutral-400 mb-1">Frequency</label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                className="w-full bg-neutral-700 rounded-lg p-2 text-white"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Start Date</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full bg-neutral-700 rounded-lg p-2 text-white"
              required
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-neutral-700 hover:bg-neutral-600 py-2 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg transition"
            >
              Add SIP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}