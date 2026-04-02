// // SummaryCards.jsx
// export default function SummaryCards({ transactions = [] }) {
//   const income = transactions
//     .filter((t) => t.type === "income")
//     .reduce((acc, t) => acc + t.amount, 0);

//   const expense = transactions
//     .filter((t) => t.type === "expense")
//     .reduce((acc, t) => acc + t.amount, 0);

//   const balance = income - expense;

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//       <div className="bg-white p-4 rounded-xl shadow">
//         <p className="text-gray-500">Balance</p>
//         <h2 className="text-xl font-semibold">₹{balance}</h2>
//       </div>

//       <div className="bg-white p-4 rounded-xl shadow">
//         <p className="text-gray-500">Income</p>
//         <h2 className="text-xl font-semibold text-green-600">
//           ₹{income}
//         </h2>
//       </div>

//       <div className="bg-white p-4 rounded-xl shadow">
//         <p className="text-gray-500">Expense</p>
//         <h2 className="text-xl font-semibold text-red-500">
//           ₹{expense}
//         </h2>
//       </div>
//     </div>
//   );
// }










"use client";

import { useMemo } from "react";

export default function SummaryCards({ transactions = [] }) {
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

  // Format numbers with thousand separators
  const formatCurrency = (value) => `₹${value.toLocaleString()}`;

  const cards = [
    {
      title: "Balance",
      value: balance,
      color: "from-blue-500 to-blue-600",
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Income",
      value: income,
      color: "from-green-500 to-green-600",
      icon: (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      title: "Expense",
      value: expense,
      color: "from-red-500 to-red-600",
      icon: (
        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slideUp">
      {cards.map((card, idx) => (
        <div
          key={card.title}
          className={`bg-gradient-to-br ${card.color} rounded-2xl shadow-lg p-5 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`}
          style={{ animationDelay: `${idx * 100}ms` }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/80 text-sm font-medium uppercase tracking-wider">
                {card.title}
              </p>
              <p className="text-white text-2xl font-bold mt-2">
                {formatCurrency(card.value)}
              </p>
            </div>
            <div className="bg-white/20 rounded-full p-2 backdrop-blur-sm">
              {card.icon}
            </div>
          </div>
          <div className="mt-4 text-white/70 text-xs">
            {card.title === "Balance" && (
              <span>Available funds</span>
            )}
            {card.title === "Income" && (
              <span>Total received</span>
            )}
            {card.title === "Expense" && (
              <span>Total spent</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}