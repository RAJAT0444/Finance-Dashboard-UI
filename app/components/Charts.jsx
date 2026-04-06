"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Area,
  AreaChart,
  CartesianGrid,
} from "recharts";

// Modern color palette for pie chart
const PIE_COLORS = [
  "#3b82f6", // blue
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f97316", // orange
  "#6366f1", // indigo
  "#84cc16", // lime
];

// Custom tooltip formatter for Indian currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-2 sm:p-3 border border-slate-100">
        <p className="text-xs sm:text-sm font-medium text-slate-700">{label}</p>
        <p className="text-sm sm:text-base font-bold text-slate-800">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export default function Charts({ transactions = [] }) {
  // Prepare line chart data (sorted by date)
  const lineData = useMemo(() => {
    const grouped = {};
    transactions.forEach((t) => {
      const date = t.date;
      if (!grouped[date]) {
        grouped[date] = { date, amount: 0 };
      }
      if (t.type === 'income') {
        grouped[date].amount += t.amount;
      } else {
        grouped[date].amount -= t.amount; // net flow: positive income, negative expense
      }
    });
    return Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [transactions]);

  // Prepare area chart data for income vs expense (stacked)
  const areaData = useMemo(() => {
    const grouped = {};
    transactions.forEach((t) => {
      const date = t.date;
      if (!grouped[date]) {
        grouped[date] = { date, income: 0, expense: 0 };
      }
      if (t.type === 'income') {
        grouped[date].income += t.amount;
      } else {
        grouped[date].expense += t.amount;
      }
    });
    return Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [transactions]);

  // Prepare pie chart data (expense categories)
  const pieData = useMemo(() => {
    const categoryMap = {};
    transactions.forEach((t) => {
      if (t.type === "expense") {
        categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
      }
    });
    return Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const hasIncome = transactions.some(t => t.type === 'income');
  const hasExpense = transactions.some(t => t.type === 'expense');
  const hasTransactions = transactions.length > 0;

  if (!hasTransactions) {
    return (
      <div className="text-center py-12 bg-white/50 backdrop-blur-sm rounded-xl border border-dashed border-slate-200">
        <div className="text-5xl mb-3">📊</div>
        <p className="text-slate-500 text-sm sm:text-base">No transaction data. Add some to see charts.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Net Cash Flow (Line/Area Chart) */}
      <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/50 shadow-sm">
        <h3 className="text-sm sm:text-base font-semibold text-slate-700 mb-2 sm:mb-3 flex items-center gap-2">
          <span>📈</span> Net Cash Flow Over Time
        </h3>
        <div className="w-full h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 10, fill: '#64748b' }}
                tickLine={false}
                angle={-30}
                textAnchor="end"
                height={50}
              />
              <YAxis 
                tick={{ fontSize: 10, fill: '#64748b' }}
                tickLine={false}
                tickFormatter={(value) => `₹${value.toLocaleString('en-IN')}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '12px' }}
                iconType="circle"
              />
              {hasIncome && (
                <Area 
                  type="monotone" 
                  dataKey="income" 
                  name="Income"
                  stroke="#10b981" 
                  strokeWidth={2}
                  fill="url(#incomeGradient)"
                />
              )}
              {hasExpense && (
                <Area 
                  type="monotone" 
                  dataKey="expense" 
                  name="Expense"
                  stroke="#ef4444" 
                  strokeWidth={2}
                  fill="url(#expenseGradient)"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-slate-400 text-center mt-2">Income (green) vs Expense (red) over time</p>
      </div>

      {/* Two-column layout for pie and summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Distribution Pie Chart */}
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/50 shadow-sm">
          <h3 className="text-sm sm:text-base font-semibold text-slate-700 mb-2 sm:mb-3 flex items-center gap-2">
            <span>🥧</span> Expense Distribution
          </h3>
          {pieData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 text-sm">No expense data to display</p>
            </div>
          ) : (
            <>
              <div className="w-full h-64 sm:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      labelLine={false}
                    >
                      {pieData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                          stroke="white"
                          strokeWidth={1}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {pieData.slice(0, 5).map((entry, idx) => (
                  <div key={entry.name} className="flex items-center gap-1 text-xs">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                    />
                    <span className="text-slate-600">{entry.name}</span>
                  </div>
                ))}
                {pieData.length > 5 && (
                  <span className="text-xs text-slate-400">+{pieData.length - 5} more</span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Quick Stats Summary */}
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/50 shadow-sm">
          <h3 className="text-sm sm:text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <span>📊</span> Quick Statistics
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 bg-slate-50/50 rounded-lg">
              <span className="text-sm text-slate-600">Total Transactions</span>
              <span className="font-bold text-slate-800">{transactions.length}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-emerald-50/50 rounded-lg">
              <span className="text-sm text-slate-600">Total Income</span>
              <span className="font-bold text-emerald-600">
                {formatCurrency(transactions.filter(t => t.type === 'income').reduce((a,b) => a + b.amount, 0))}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-rose-50/50 rounded-lg">
              <span className="text-sm text-slate-600">Total Expense</span>
              <span className="font-bold text-rose-600">
                {formatCurrency(transactions.filter(t => t.type === 'expense').reduce((a,b) => a + b.amount, 0))}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-blue-50/50 rounded-lg">
              <span className="text-sm text-slate-600">Average Transaction</span>
              <span className="font-bold text-blue-600">
                {formatCurrency(transactions.reduce((a,b) => a + b.amount, 0) / transactions.length)}
              </span>
            </div>
            {pieData.length > 0 && (
              <div className="flex justify-between items-center p-2 bg-purple-50/50 rounded-lg">
                <span className="text-sm text-slate-600">Top Category</span>
                <span className="font-bold text-purple-600">
                  {pieData[0].name} ({formatCurrency(pieData[0].value)})
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}