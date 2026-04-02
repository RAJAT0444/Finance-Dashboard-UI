// This is the main page of the finance dashboard application.
// It includes state management for transactions, user role, and search functionality.
// The page is structured with a header, search bar, add transaction form (for admins),
// summary cards, charts, transactions list, and insights section.
// The design incorporates Tailwind CSS for styling and includes various animations
// and transitions for a modern look and feel.

"use client";

import { useState, useMemo, useEffect } from "react";
import { transactionsData } from "./data/transactions";
import SummaryCards from "./components/SummaryCards";
import Transactions from "./components/Transactions";
import Insights from "./components/Insights";
import Charts from "./components/Charts";

export default function Home() {
  // ---------- STATE DECLARATIONS ----------
  // Initialize with default data on both server and client to prevent hydration mismatch
  const [transactions, setTransactions] = useState(transactionsData);
  const [role, setRole] = useState("viewer");
  const [search, setSearch] = useState("");
  const [newTransaction, setNewTransaction] = useState({
    amount: "",
    category: "",
    type: "expense",
  });

  // Load saved transactions from localStorage after component mounts (client only)
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

  // ---------- COMPUTED VALUES ----------
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) =>
      t.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [transactions, search]);

  const hasTransactions = transactions.length > 0;

  // ---------- EVENT HANDLERS ----------
  const handleAdd = () => {
    if (!newTransaction.amount || !newTransaction.category) return;

    const newData = {
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      amount: Number(newTransaction.amount),
      category: newTransaction.category,
      type: newTransaction.type,
    };

    setTransactions([newData, ...transactions]);
    setNewTransaction({ amount: "", category: "", type: "expense" });
  };

  const clearSearch = () => setSearch("");

  const handleUpdateTransaction = (updatedTransaction) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === updatedTransaction.id ? updatedTransaction : t))
    );
  };

  const handleDeleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // ---------- JSX RENDER ----------
  return (
    <main className="min-h-screen bg-linear-to-br from-gray-50 via-gray-100 to-gray-200 p-4 md:p-8 transition-all duration-500 animate-fadeIn">
      {/* Background pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-5 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] bg-size-[16px_16px]"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/20 sticky top-4 z-20 transition-all duration-300">
          <div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Finance Dashboard
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Role: <span className="font-semibold capitalize text-gray-800">{role}</span>
            </p>
          </div>
          <div className="relative">
            <select
              className="appearance-none bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-2 pr-8 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:shadow-md"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="viewer">👁️ Viewer</option>
              <option value="admin">⚙️ Admin</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </header>

        {/* Search bar */}
        <div className="relative mb-8 transition-all duration-200 hover:scale-[1.01]">
          <input
            type="text"
            className="w-full p-3 pl-10 pr-10 border border-gray-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700"
            placeholder="Search by category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <svg
            className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {search && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        {/* Add Transaction form (admin only) */}
        {role === "admin" && (
          <div id="add-transaction-form" className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100 transition-all duration-300 hover:shadow-xl animate-slideUp">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">➕</span> Add Transaction
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                className="border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 transition-all duration-200 focus:scale-[1.02]"
                placeholder="Amount"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
              />
              <input
                className="border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 transition-all duration-200 focus:scale-[1.02]"
                placeholder="Category"
                value={newTransaction.category}
                onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
              />
              <select
                className="border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 transition-all duration-200 focus:scale-[1.02]"
                value={newTransaction.type}
                onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
              >
                <option value="expense">💸 Expense</option>
                <option value="income">💰 Income</option>
              </select>
              <button
                onClick={handleAdd}
                className="bg-linear-to-r from-blue-600 to-blue-700 text-white font-medium py-2 rounded-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-md active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add Transaction
              </button>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <section className="mb-8">
          {hasTransactions ? (
            <SummaryCards transactions={transactions} />
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <p className="text-gray-500">No data to display.</p>
            </div>
          )}
        </section>

        {/* Charts */}
        <section className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100 transition-all duration-300 hover:shadow-xl transform hover:scale-[1.01]">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 Analytics</h2>
          {hasTransactions ? (
            <Charts transactions={transactions} />
          ) : (
            <p className="text-gray-500 text-center py-8">No data to visualize.</p>
          )}
        </section>

        {/* Transactions list */}
        <section className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100 transition-all duration-300 hover:shadow-xl transform hover:scale-[1.01]">
          <Transactions
            transactions={filteredTransactions}
            role={role}
            onUpdateTransaction={handleUpdateTransaction}
            onDeleteTransaction={handleDeleteTransaction}
          />
        </section>

        {/* Insights */}
        <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transition-all duration-300 hover:shadow-xl transform hover:scale-[1.01] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-500 to-purple-600"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">💡</span> Insights & Recommendations
          </h2>
          {hasTransactions ? (
            <Insights transactions={transactions} />
          ) : (
            <p className="text-gray-500 text-center py-8">No insights available.</p>
          )}
        </section>
      </div>
    </main>
  );
}