"use client";

import { useState } from "react";

/**
 * Transactions Component - Responsive Version
 * Displays a list of financial transactions with category, date, amount, and type.
 * For admin users, includes Edit and Delete buttons and an inline edit form.
 *
 * @param {Array} transactions - List of transaction objects (each with id, category, date, amount, type)
 * @param {string} role - User role ('admin' or 'viewer')
 * @param {Function} onUpdateTransaction - Callback to update a transaction (admin only)
 * @param {Function} onDeleteTransaction - Callback to delete a transaction (admin only)
 */
export default function Transactions({
  transactions = [],
  role,
  onUpdateTransaction,
  onDeleteTransaction,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    amount: "",
    category: "",
    type: "expense",
    date: "",
  });

  const scrollToAddForm = () => {
    const addForm = document.getElementById("add-transaction-form");
    if (addForm) {
      addForm.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const startEdit = (transaction) => {
    setEditingId(transaction.id);
    setEditForm({
      amount: transaction.amount,
      category: transaction.category,
      type: transaction.type,
      date: transaction.date,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ amount: "", category: "", type: "expense", date: "" });
  };

  const saveEdit = () => {
    if (!editForm.amount || !editForm.category) {
      alert("Please fill in amount and category");
      return;
    }
    const updatedTransaction = {
      id: editingId,
      amount: Number(editForm.amount),
      category: editForm.category,
      type: editForm.type,
      date: editForm.date,
    };
    onUpdateTransaction(updatedTransaction);
    cancelEdit();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      onDeleteTransaction(id);
    }
  };

  return (
    <div className="w-full">
      {/* Header section with responsive flex */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <h2 className="text-base sm:text-lg font-semibold text-slate-800">
          Transaction History
        </h2>
        {role === "admin" && (
          <button
            onClick={scrollToAddForm}
            className="bg-linear-to-r from-blue-600 to-indigo-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full sm:w-auto"
          >
            + Add Transaction
          </button>
        )}
      </div>

      {/* Transactions list - responsive spacing */}
      <div className="space-y-3">
        {transactions.length === 0 ? (
          <div className="text-center py-8 sm:py-12 bg-white/50 rounded-xl border border-slate-100">
            <svg
              className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-slate-500 mt-2 text-sm sm:text-base">
              No transactions found
            </p>
          </div>
        ) : (
          transactions.map((t) => (
            <div
              key={t.id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 sm:p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-100 shadow-sm transition-all duration-200 hover:shadow-md group"
            >
              {editingId === t.id ? (
                /* ---------- EDIT MODE (fully responsive) ---------- */
                <div className="w-full space-y-3">
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3">
                    <input
                      type="number"
                      placeholder="Amount"
                      value={editForm.amount}
                      onChange={(e) =>
                        setEditForm({ ...editForm, amount: e.target.value })
                      }
                      className="border border-slate-200 rounded-lg p-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    />
                    <input
                      type="text"
                      placeholder="Category"
                      value={editForm.category}
                      onChange={(e) =>
                        setEditForm({ ...editForm, category: e.target.value })
                      }
                      className="border border-slate-200 rounded-lg p-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    />
                    <select
                      value={editForm.type}
                      onChange={(e) =>
                        setEditForm({ ...editForm, type: e.target.value })
                      }
                      className="border border-slate-200 rounded-lg p-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    >
                      <option value="expense">💸 Expense</option>
                      <option value="income">💰 Income</option>
                    </select>
                    <input
                      type="date"
                      value={editForm.date}
                      onChange={(e) =>
                        setEditForm({ ...editForm, date: e.target.value })
                      }
                      className="border border-slate-200 rounded-lg p-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={saveEdit}
                      className="bg-emerald-600 text-white px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm hover:bg-emerald-700 transition font-medium"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-slate-200 text-slate-700 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm hover:bg-slate-300 transition font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* ---------- VIEW MODE (responsive layout) ---------- */
                <>
                  {/* Left side - category & date */}
                  <div className="flex-1 w-full sm:w-auto mb-2 sm:mb-0">
                    <p className="font-medium text-slate-800 group-hover:text-slate-900 transition-colors text-sm sm:text-base">
                      {t.category}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5 flex items-center gap-1">
                      <svg
                        className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {t.date}
                    </p>
                  </div>

                  {/* Right side - amount, type, and actions */}
                  <div className="flex flex-row sm:flex-col justify-between items-center sm:items-end w-full sm:w-auto gap-2 sm:gap-0">
                    <div className="text-left sm:text-right">
                      <p
                        className={`font-semibold text-sm sm:text-base ${
                          t.type === "income" ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        ₹{t.amount.toLocaleString()}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-500 capitalize mt-0.5">
                        {t.type}
                      </p>
                    </div>

                    {role === "admin" && (
                      <div className="flex gap-3 sm:gap-2 justify-end mt-1 sm:mt-2">
                        <button
                          onClick={() => startEdit(t)}
                          className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium transition px-2 py-1 rounded-md hover:bg-blue-50"
                          aria-label="Edit transaction"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="text-rose-600 hover:text-rose-800 text-xs sm:text-sm font-medium transition px-2 py-1 rounded-md hover:bg-rose-50"
                          aria-label="Delete transaction"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}