"use client";

import { useMemo, useEffect, useState } from "react";

export default function SummaryCards({ transactions = [] }) {
  const [animate, setAnimate] = useState(false);

  // Trigger animation when transactions change
  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 500);
    return () => clearTimeout(timer);
  }, [transactions]);

  // Memoize calculations for performance
  const { income, expense, balance } = useMemo(() => {
    const inc = transactions
      .filter((t) => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);
    const exp = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0);
    return { income: inc, expense: exp, balance: inc - exp };
  }, [transactions]);

  // Format numbers with Indian number system (lakhs, crores)
  const formatCurrency = (value) => {
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return formatter.format(value);
  };

  // Determine balance styling
  const isNegative = balance < 0;
  const balanceColor = isNegative 
    ? "from-rose-500 to-rose-600" 
    : "from-blue-500 to-indigo-600";
  const balanceIcon = isNegative ? "🔴" : "💰";

  const cards = [
    {
      title: "Balance",
      value: balance,
      color: balanceColor,
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      subText: `${balanceIcon} Available funds`,
      trend: null,
    },
    {
      title: "Income",
      value: income,
      color: "from-emerald-500 to-teal-600",
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      subText: "📈 Total received",
      trend: income > 0 ? "+" : "",
    },
    {
      title: "Expense",
      value: expense,
      color: "from-rose-500 to-pink-600",
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
        </svg>
      ),
      subText: "📉 Total spent",
      trend: expense > 0 ? "-" : "",
    },
  ];

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 animate-slideUp">
      {cards.map((card, idx) => (
        <div
          key={card.title}
          className={`
            group relative overflow-hidden
            bg-linear-to-br ${card.color}
            rounded-xl sm:rounded-2xl
            shadow-lg hover:shadow-2xl
            p-4 sm:p-5
            transition-all duration-300
            hover:scale-[1.02] active:scale-[0.98]
            ${animate ? 'animate-pulse-once' : ''}
          `}
          style={{ animationDelay: `${idx * 100}ms` }}
        >
          {/* Animated gradient overlay on hover */}
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          
          {/* Subtle border glow */}
          <div className="absolute inset-0 rounded-xl sm:rounded-2xl ring-1 ring-white/20 ring-inset pointer-events-none" />

          <div className="relative z-10">
            <div className="flex justify-between items-start gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-white/80 text-xs sm:text-sm font-medium uppercase tracking-wider">
                  {card.title}
                </p>
                <p className="text-white text-xl sm:text-2xl md:text-3xl font-bold mt-1 sm:mt-2 truncate">
                  {formatCurrency(card.value)}
                </p>
              </div>
              <div className="bg-white/20 rounded-full p-1.5 sm:p-2 backdrop-blur-sm shrink-0 transition-transform group-hover:scale-110 duration-200">
                {card.icon}
              </div>
            </div>

            <div className="mt-2 sm:mt-3 flex justify-between items-center">
              <p className="text-white/70 text-xs sm:text-sm">
                {card.subText}
              </p>
              {card.trend !== null && card.value !== 0 && (
                <span className="text-white/60 text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                  {card.trend}{formatCurrency(Math.abs(card.value))}
                </span>
              )}
            </div>

            {/* Mini progress bar for visual effect (only if transactions exist) */}
            {transactions.length > 0 && card.title !== "Balance" && (
              <div className="mt-3 h-1 w-full bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white/50 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${Math.min(100, (card.value / Math.max(income, expense, 1)) * 100)}%` 
                  }}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}