"use client";

import { useState } from "react";

/**
 * Transactions Component
 * Displays a list of financial transactions with category, date, amount, and type.
 * For admin users, includes Edit and Delete buttons and an inline edit form.
 *
 * @param {Array} transactions - List of transaction objects (each with id, category, date, amount, type)
 * @param {string} role - User role ('admin' or 'viewer')
 * @param {Function} onUpdateTransaction - Callback to update a transaction (admin only)
 * @param {Function} onDeleteTransaction - Callback to delete a transaction (admin only)
 * @param {Function} onAddTransaction - Optional callback to scroll to add form (already exists)
 */
export default function Transactions({
  transactions = [],
  role,
  onUpdateTransaction,
  onDeleteTransaction,
}) {
  // State to track which transaction is being edited (null if none)
  const [editingId, setEditingId] = useState(null);
  // Form data for the transaction being edited
  const [editForm, setEditForm] = useState({
    amount: "",
    category: "",
    type: "expense",
    date: "",
  });

  /**
   * scrollToAddForm - Smoothly scrolls to the "Add Transaction" form
   */
  const scrollToAddForm = () => {
    const addForm = document.getElementById("add-transaction-form");
    if (addForm) {
      addForm.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  /**
   * Start editing a transaction: populate the edit form and set editingId
   * @param {Object} transaction - The transaction to edit
   */
  const startEdit = (transaction) => {
    setEditingId(transaction.id);
    setEditForm({
      amount: transaction.amount,
      category: transaction.category,
      type: transaction.type,
      date: transaction.date,
    });
  };

  /**
   * Cancel editing: clear editingId and reset edit form
   */
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ amount: "", category: "", type: "expense", date: "" });
  };

  /**
   * Save the edited transaction and call the parent update handler
   */
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

  /**
   * Delete a transaction after confirmation
   * @param {number} id - Transaction ID to delete
   */
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      onDeleteTransaction(id);
    }
  };

  return (
    <div className="w-full">
      {/* Header section: Title and optional admin button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Transactions</h2>
        {/* Only show the "Add Transaction" button if user has admin privileges */}
        {role === "admin" && (
          <button
            onClick={scrollToAddForm}
            className="bg-linear-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            + Add Transaction
          </button>
        )}
      </div>

      {/* Transactions list */}
      <div className="space-y-3">
        {transactions.length === 0 ? (
          /* Empty state */
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
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
            <p className="text-gray-500 mt-2">No transactions found</p>
          </div>
        ) : (
          transactions.map((t) => (
            <div
              key={t.id}
              className="flex justify-between items-start p-4 bg-white rounded-xl border border-gray-100 shadow-sm transition-all duration-200 hover:shadow-md group"
            >
              {editingId === t.id ? (
                /* --------------------- EDIT MODE --------------------- */
                <div className="w-full space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="number"
                      placeholder="Amount"
                      value={editForm.amount}
                      onChange={(e) =>
                        setEditForm({ ...editForm, amount: e.target.value })
                      }
                      className="border border-gray-200 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Category"
                      value={editForm.category}
                      onChange={(e) =>
                        setEditForm({ ...editForm, category: e.target.value })
                      }
                      className="border border-gray-200 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={editForm.type}
                      onChange={(e) =>
                        setEditForm({ ...editForm, type: e.target.value })
                      }
                      className="border border-gray-200 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="border border-gray-200 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={saveEdit}
                      className="bg-green-600 text-white px-4 py-1 rounded-lg text-sm hover:bg-green-700 transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-300 text-gray-700 px-4 py-1 rounded-lg text-sm hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* --------------------- VIEW MODE --------------------- */
                <>
                  {/* Left side: category, date, calendar icon */}
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 group-hover:text-gray-900 transition-colors">
                      {t.category}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">
                      <svg
                        className="w-3.5 h-3.5"
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

                  {/* Right side: amount, type, and admin actions */}
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        t.type === "income" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      ₹{t.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 capitalize mt-0.5">
                      {t.type}
                    </p>

                    {/* Admin actions: Edit & Delete buttons */}
                    {role === "admin" && (
                      <div className="flex gap-2 justify-end mt-2">
                        <button
                          onClick={() => startEdit(t)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium transition"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="text-red-600 hover:text-red-800 text-xs font-medium transition"
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