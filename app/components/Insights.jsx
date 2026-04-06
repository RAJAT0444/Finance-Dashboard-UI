"use client";

import { useMemo, useEffect, useState } from "react";

export default function Insights({ transactions = [] }) {
  const [animate, setAnimate] = useState(false);

  // Trigger animation when transactions change
  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 500);
    return () => clearTimeout(timer);
  }, [transactions]);

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

  // Calculate income per category (optional, for insights)
  const incomeMap = useMemo(() => {
    const map = {};
    transactions.forEach((t) => {
      if (t.type === "income") {
        map[t.category] = (map[t.category] || 0) + t.amount;
      }
    });
    return map;
  }, [transactions]);

  const sortedExpenses = useMemo(
    () => Object.entries(categoryMap).sort((a, b) => b[1] - a[1]),
    [categoryMap]
  );

  const totalExpense = useMemo(
    () => sortedExpenses.reduce((acc, [, amount]) => acc + amount, 0),
    [sortedExpenses]
  );

  const totalIncome = useMemo(() => {
    return transactions
      .filter(t => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  const highest = sortedExpenses[0];
  const highestPercent = highest ? ((highest[1] / totalExpense) * 100).toFixed(1) : 0;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome * 100).toFixed(1) : 0;
  const isSavingsPositive = (totalIncome - totalExpense) > 0;

  // Get dynamic recommendation based on spending
  const getRecommendation = () => {
    if (sortedExpenses.length === 0) return "Add expenses to get personalized insights";
    if (highestPercent > 40) return `Consider reducing spending on ${highest[0]} (${highestPercent}% of total)`;
    if (savingsRate < 10 && savingsRate > 0) return "Try to increase savings to at least 20% of income";
    if (savingsRate < 0) return "You're spending more than you earn. Review your expenses";
    return "Great job! Keep tracking your finances regularly";
  };

  if (sortedExpenses.length === 0 && totalIncome === 0) {
    return (
      <div className="text-center py-12 bg-white/50 backdrop-blur-sm rounded-xl border border-dashed border-slate-200">
        <div className="text-5xl mb-3">📊</div>
        <p className="text-slate-500 text-sm sm:text-base">No data available. Add transactions to see insights.</p>
      </div>
    );
  }

  // Format currency in Indian style
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className={`space-y-4 sm:space-y-5 animate-fadeIn ${animate ? 'animate-pulse-once' : ''}`}>
      {/* Top spending category - premium card */}
      {sortedExpenses.length > 0 && (
        <div className="group relative overflow-hidden bg-linear-to-br from-white/90 to-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="absolute inset-0 bg-linear-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="flex justify-between items-start gap-3">
              <div>
                <p className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wider">
                  🔥 Top Spending Category
                </p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 mt-1">
                  {highest[0]}
                </p>
              </div>
              <div className="bg-linear-to-br from-blue-500 to-indigo-600 rounded-full p-2 shadow-md">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-slate-600 font-medium">{formatCurrency(highest[1])}</span>
                <span className="text-slate-500">{highestPercent}% of total expenses</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-linear-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${highestPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Two-column stats for income/expense and savings rate */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {/* Total Expenses Card */}
        <div className="group relative overflow-hidden bg-linear-to-br from-white/90 to-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="bg-linear-to-br from-rose-500 to-pink-600 rounded-full p-2 shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Total Expenses</p>
              <p className="text-xl sm:text-2xl font-bold text-slate-800">{formatCurrency(totalExpense)}</p>
            </div>
          </div>
        </div>

        {/* Total Income Card */}
        <div className="group relative overflow-hidden bg-linear-to-br from-white/90 to-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="bg-linear-to-br from-emerald-500 to-teal-600 rounded-full p-2 shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Total Income</p>
              <p className="text-xl sm:text-2xl font-bold text-slate-800">{formatCurrency(totalIncome)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Savings Rate Card (if income exists) */}
      {totalIncome > 0 && (
        <div className="group relative overflow-hidden bg-linear-to-br from-white/90 to-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-start gap-3">
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wider">
                📈 Savings Rate
              </p>
              <p className={`text-2xl sm:text-3xl font-bold mt-1 ${isSavingsPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                {savingsRate}%
              </p>
            </div>
            <div className={`rounded-full p-2 shadow-md ${isSavingsPositive ? 'bg-emerald-100' : 'bg-rose-100'}`}>
              {isSavingsPositive ? (
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
              )}
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-700 ease-out ${isSavingsPositive ? 'bg-linear-to-r from-emerald-500 to-teal-500' : 'bg-linear-to-r from-rose-500 to-pink-500'}`}
                style={{ width: `${Math.min(100, Math.max(0, savingsRate))}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {isSavingsPositive 
                ? `You're saving ${savingsRate}% of your income. Keep going!` 
                : `You're spending ${Math.abs(savingsRate)}% more than you earn. Time to cut back.`}
            </p>
          </div>
        </div>
      )}

      {/* Other Categories (if many) */}
      {sortedExpenses.length > 1 && (
        <div className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-white/50 shadow-lg">
          <p className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <span>📋</span> Other Spending Categories
          </p>
          <div className="space-y-3">
            {sortedExpenses.slice(1, 5).map(([category, amount]) => (
              <div key={category} className="flex justify-between items-center py-1 border-b border-slate-100 last:border-0">
                <span className="text-slate-600 text-sm sm:text-base">{category}</span>
                <span className="font-semibold text-slate-800 text-sm sm:text-base">{formatCurrency(amount)}</span>
              </div>
            ))}
            {sortedExpenses.length > 5 && (
              <p className="text-xs text-slate-400 text-right pt-1">
                + {sortedExpenses.length - 5} more categories
              </p>
            )}
          </div>
        </div>
      )}

      {/* Smart Recommendation */}
      <div className="bg-linear-to-r from-blue-50/50 to-indigo-50/50 backdrop-blur-sm rounded-xl p-4 border border-blue-100 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="text-xl">💡</div>
          <div>
            <p className="text-sm font-semibold text-slate-700">Smart Insight</p>
            <p className="text-sm text-slate-600 mt-0.5">{getRecommendation()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}