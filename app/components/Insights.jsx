
"use client";

import { useMemo } from "react";

export default function Insights({ transactions = [] }) {
  // Calculate expense per category
  const categoryMap = useMemo(() => {
    const map = {};
    transactions.forEach((t) => {
      if (t.type === "expense") {
        map[t.category] = (map[t.category] || 0) + t.amount;
      }
    });
    return map;
  }, [transactions]);

  const sorted = useMemo(
    () => Object.entries(categoryMap).sort((a, b) => b[1] - a[1]),
    [categoryMap]
  );

  const totalExpense = useMemo(
    () => sorted.reduce((acc, [, amount]) => acc + amount, 0),
    [sorted]
  );

  const highest = sorted[0];
  const highestPercent = highest ? ((highest[1] / totalExpense) * 100).toFixed(1) : 0;

  if (sorted.length === 0) {
    return (
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
        <p className="text-gray-500 mt-2">No expense data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Top spending category */}
      <div className="bg-linear-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-100">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Top Spending Category
            </p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{highest[0]}</p>
          </div>
          <div className="bg-blue-100 rounded-full p-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">₹{highest[1].toLocaleString()}</span>
            <span className="text-gray-500">{highestPercent}% of total</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${highestPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Total expenses */}
      <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="bg-red-100 rounded-full p-2">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Expenses</p>
            <p className="text-xl font-semibold text-gray-800">₹{totalExpense.toLocaleString()}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">All time</p>
        </div>
      </div>

      {/* Other categories (optional) */}
      {sorted.length > 1 && (
        <div className="p-4 bg-white rounded-xl border border-gray-100">
          <p className="text-sm font-medium text-gray-700 mb-3">Other spending</p>
          <div className="space-y-3">
            {sorted.slice(1, 4).map(([category, amount]) => (
              <div key={category} className="flex justify-between items-center">
                <span className="text-gray-600">{category}</span>
                <span className="font-medium text-gray-800">₹{amount.toLocaleString()}</span>
              </div>
            ))}
            {sorted.length > 4 && (
              <p className="text-xs text-gray-400 text-right">+ {sorted.length - 4} more</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}