"use client";

import { useState, useMemo, useEffect } from "react";
import { transactionsData } from "./data/transactions";
import SummaryCards from "./components/SummaryCards";
import Transactions from "./components/Transactions";
import Insights from "./components/Insights";
import Charts from "./components/Charts";

export default function Home() {
  // ---------- STATE DECLARATIONS ----------
  const [transactions, setTransactions] = useState(transactionsData);
  const [role, setRole] = useState("admin"); // Default to admin for better demo UX
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all"); // 'all', 'income', 'expense'
  const [newTransaction, setNewTransaction] = useState({
    amount: "",
    category: "",
    type: "expense",
    date: new Date().toISOString().split("T")[0],
  });
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // Load saved transactions from localStorage after component mounts
  useEffect(() => {
    const saved = localStorage.getItem("transactions");
    if (saved) {
      setTransactions(JSON.parse(saved));
    }
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  // Auto-dismiss toast after 3 seconds
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // ---------- COMPUTED VALUES ----------
  // Sort all transactions by date (newest first) for consistent display
  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions]);

  // Filter transactions for the list view based on search and type filter
  const filteredTransactions = useMemo(() => {
    return sortedTransactions.filter((t) => {
      const matchesSearch = t.category.toLowerCase().includes(search.toLowerCase());
      const matchesType = filterType === "all" ? true : t.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [sortedTransactions, search, filterType]);

  const hasTransactions = transactions.length > 0;
  const activeFilterCount = filterType !== "all" ? 1 : 0;
  const isSearchActive = search.length > 0;

  // ---------- EVENT HANDLERS ----------
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const handleAdd = () => {
    if (!newTransaction.amount || !newTransaction.category) {
      showToast("Please fill in amount and category", "error");
      return;
    }
    const amountNum = Number(newTransaction.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      showToast("Please enter a valid positive amount", "error");
      return;
    }

    const newData = {
      id: Date.now(),
      date: newTransaction.date,
      amount: amountNum,
      category: newTransaction.category,
      type: newTransaction.type,
    };

    setTransactions([newData, ...transactions]);
    setNewTransaction({
      amount: "",
      category: "",
      type: "expense",
      date: new Date().toISOString().split("T")[0],
    });
    showToast(`Transaction added: ${newTransaction.category} (₹${amountNum})`, "success");
  };

  const clearSearch = () => setSearch("");
  const clearFilters = () => {
    setSearch("");
    setFilterType("all");
    showToast("All filters cleared", "info");
  };

  const handleUpdateTransaction = (updatedTransaction) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === updatedTransaction.id ? updatedTransaction : t))
    );
    showToast("Transaction updated successfully", "success");
  };

  const handleDeleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    showToast("Transaction deleted", "info");
  };

  const resetToSampleData = () => {
    if (confirm("Reset all transactions to sample data? Your current data will be lost.")) {
      setTransactions(transactionsData);
      showToast("Reset to sample data", "success");
    }
  };

  // ---------- JSX RENDER ----------
  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-4 md:p-8 transition-all duration-500">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Toast Notification */}
        {toast.show && (
          <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-slideDown">
            <div className={`px-6 py-3 rounded-xl shadow-lg backdrop-blur-md text-white font-medium flex items-center gap-2 ${
              toast.type === "success" ? "bg-green-500/90" : toast.type === "error" ? "bg-red-500/90" : "bg-blue-500/90"
            }`}>
              {toast.type === "success" && <span>✅</span>}
              {toast.type === "error" && <span>⚠️</span>}
              {toast.type === "info" && <span>ℹ️</span>}
              {toast.message}
            </div>
          </div>
        )}

        {/* Header with glassmorphism */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white/40 backdrop-blur-xl rounded-2xl p-5 shadow-lg border border-white/50 sticky top-4 z-20 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
              <span className="text-white text-xl">💰</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                FinanceFlow
              </h1>
              <p className="text-sm text-slate-600 mt-0.5">
                Role: <span className="font-semibold capitalize text-slate-800">{role}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={resetToSampleData}
              className="text-xs bg-white/60 hover:bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl border border-slate-200 text-slate-600 transition-all hover:shadow-md flex items-center gap-1"
              title="Reset to sample data"
            >
              🔄 Reset Demo
            </button>
            <div className="relative">
              <select
                className="appearance-none bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl px-5 py-2 pr-9 text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:shadow-md cursor-pointer font-medium"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="viewer">👁️ Viewer Mode</option>
                <option value="admin">⚙️ Admin Mode</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
              </div>
            </div>
          </div>
        </header>

        {/* Search and Filter Bar */}
        <div className="mb-8 space-y-3">
          <div className="relative transition-all duration-200 hover:scale-[1.01]">
            <input
              type="text"
              className="w-full p-3.5 pl-11 pr-11 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-sm shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-700"
              placeholder="Search by category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg className="absolute left-3.5 top-4 h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {search && (
              <button onClick={clearSearch} className="absolute right-3.5 top-4 text-slate-400 hover:text-slate-600 transition-colors">
                ✕
              </button>
            )}
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-slate-500 font-medium">Filter by type:</span>
            <button
              onClick={() => setFilterType("all")}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                filterType === "all"
                  ? "bg-blue-600 text-white shadow-md scale-105"
                  : "bg-white/70 text-slate-600 hover:bg-white hover:shadow"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType("income")}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                filterType === "income"
                  ? "bg-emerald-600 text-white shadow-md scale-105"
                  : "bg-white/70 text-slate-600 hover:bg-white hover:shadow"
              }`}
            >
              💰 Income
            </button>
            <button
              onClick={() => setFilterType("expense")}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                filterType === "expense"
                  ? "bg-rose-600 text-white shadow-md scale-105"
                  : "bg-white/70 text-slate-600 hover:bg-white hover:shadow"
              }`}
            >
              💸 Expense
            </button>
            {(isSearchActive || activeFilterCount > 0) && (
              <button
                onClick={clearFilters}
                className="px-3 py-1.5 rounded-full text-sm font-medium bg-slate-200/70 text-slate-700 hover:bg-slate-300 transition-all flex items-center gap-1"
              >
                Clear filters ✕
              </button>
            )}
            {filteredTransactions.length !== sortedTransactions.length && (
              <span className="text-xs text-slate-500 bg-white/50 px-2 py-1 rounded-full">
                Showing {filteredTransactions.length} of {sortedTransactions.length}
              </span>
            )}
          </div>
        </div>

        {/* Add Transaction Form (Admin Only) with Modern Design */}
        {role === "admin" && (
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-8 border border-white/50 transition-all duration-300 hover:shadow-2xl animate-slideUp">
            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">➕</span> Add New Transaction
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <input
                type="number"
                className="border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 transition-all duration-200 focus:scale-[1.02] bg-white/90"
                placeholder="Amount (₹)"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
              />
              <input
                className="border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 transition-all duration-200 focus:scale-[1.02] bg-white/90"
                placeholder="Category (e.g., Food, Rent)"
                value={newTransaction.category}
                onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
              />
              <input
                type="date"
                className="border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 transition-all duration-200 focus:scale-[1.02] bg-white/90"
                value={newTransaction.date}
                onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
              />
              <select
                className="border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 transition-all duration-200 focus:scale-[1.02] bg-white/90"
                value={newTransaction.type}
                onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
              >
                <option value="expense">💸 Expense</option>
                <option value="income">💰 Income</option>
              </select>
              <button
                onClick={handleAdd}
                className="bg-linear-to-r from-blue-600 to-indigo-600 text-white font-medium py-2.5 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                + Add Transaction
              </button>
            </div>
          </div>
        )}

        {/* Summary Cards Section */}
        <section className="mb-8">
          {hasTransactions ? (
            <SummaryCards transactions={sortedTransactions} />
          ) : (
            <div className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-2xl shadow-sm border border-dashed border-slate-300">
              <div className="text-5xl mb-3">📭</div>
              <p className="text-slate-500">No transactions yet. Add your first one!</p>
            </div>
          )}
        </section>

        {/* Charts Section */}
        <section className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 mb-8 border border-white/50 transition-all duration-300 hover:shadow-xl transform hover:scale-[1.01]">
          <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">📊</span> Financial Analytics
          </h2>
          {hasTransactions ? (
            <Charts transactions={sortedTransactions} />
          ) : (
            <p className="text-slate-500 text-center py-12">Add transactions to see charts and trends.</p>
          )}
        </section>

        {/* Transactions List */}
        <section className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 mb-8 border border-white/50 transition-all duration-300 hover:shadow-xl transform hover:scale-[1.01]">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <span className="text-2xl">📋</span> Transaction History
            </h2>
            {filteredTransactions.length === 0 && (search || filterType !== "all") && (
              <span className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                No matching transactions
              </span>
            )}
          </div>
          <Transactions
            transactions={filteredTransactions}
            role={role}
            onUpdateTransaction={handleUpdateTransaction}
            onDeleteTransaction={handleDeleteTransaction}
          />
        </section>

        {/* Insights Section with Gradient Border */}
        <section className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/50 transition-all duration-300 hover:shadow-xl transform hover:scale-[1.01] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
          <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">💡</span> Smart Insights
          </h2>
          {hasTransactions ? (
            <Insights transactions={sortedTransactions} />
          ) : (
            <p className="text-slate-500 text-center py-10">Add transactions to get personalized insights.</p>
          )}
        </section>
      </div>
    </main>
  );
}
