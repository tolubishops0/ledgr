import { Category, Transaction } from "@ledgr/types";
import { Card, CardHeader, CardContent, EmptyState } from "@ledgr/ui";
import {
  calculateSpent,
  formatCurrency,
  getMonthName,
  getMonthlyTotals,
} from "@ledgr/utils";
import { motion } from "framer-motion";
import React from "react";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  LineChart,
  Line,
  Pie,
  PieChart,
  BarChart,
  Sector,
} from "recharts";

export function IncomeVsExpensesChart({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const raw = getMonthlyTotals(transactions, 6);
  const data = raw.map((d) => ({
    month: d.month,
    Income: d.income,
    Expenses: d.expense,
  }));
  return (
    <Card>
      <CardHeader>
        <span className="text-sm font-semibold text-gray-900 dark:text-zinc-50">
          Income vs Expenses
        </span>
        <span className="text-xs text-gray-400 dark:text-zinc-500">
          Last 6 months
        </span>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} barCategoryGap="30%">
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value) => formatCurrency(Number(value) || 0)}
            />{" "}
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Income" fill="#16a34a" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function SpendingTrendChart({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const raw = getMonthlyTotals(transactions, 6);
  const data = raw?.map((d) => ({ month: d.month, Expenses: d.expense }));

  return (
    <Card>
      <CardHeader>
        <span className="text-sm font-semibold text-gray-900 dark:text-zinc-50">
          Spending Trend
        </span>
        <span className="text-xs text-gray-400 dark:text-zinc-500">
          Last 6 months
        </span>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value) => formatCurrency(Number(value) || 0)}
            />{" "}
            <Line
              type="monotone"
              dataKey="Expenses"
              stroke="#16a34a"
              strokeWidth={2.5}
              dot={{ fill: "#16a34a", r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function CategoryBreakdownChart({
  transactions,
  categories,
  month,
}: {
  month: string;
  categories: Category[];
  transactions: Transaction[];
}) {
  const spendingCats = categories.filter((c) => c.name !== "Salary");
  const data = spendingCats
    .map((cat) => ({
      ...cat,
      amount: calculateSpent(transactions, cat.id, month),
    }))
    .filter((c) => c.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  return (
    <Card>
      <CardHeader>
        <div>
          <span className="text-sm font-semibold text-gray-900 dark:text-zinc-50">
            Top Categories
          </span>
          <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">
            Track where your spending has been going this month
          </p>
        </div>
        <span className="text-xs text-gray-400 dark:text-zinc-500">
          {getMonthName(month)}
        </span>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <EmptyState
            heading="No spending this month"
            subtext="Add transactions to see your category breakdown."
          />
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="amount"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  isAnimationActive
                  animationDuration={800}
                  shape={(props) => {
                    const { index } = props;
                    return <Sector {...props} fill={data[index].color} />;
                  }}
                />
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value) || 0)}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-2 w-full sm:w-auto shrink-0">
              {data.map((cat) => (
                <div key={cat.id} className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-xs text-gray-600 dark:text-zinc-400 w-28 truncate">
                    {cat.icon} {cat.name}
                  </span>
                  <span className="text-xs font-semibold text-gray-900 dark:text-zinc-50 ml-auto pl-4">
                    {formatCurrency(cat.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function TopCategories({
  transactions,
  categories,
  month,
}: {
  month: string;
  categories: Category[];
  transactions: Transaction[];
}) {
  const spendingCats = categories.filter((c) => c.id !== "8");
  const ranked = spendingCats
    .map((cat) => ({
      ...cat,
      amount: calculateSpent(transactions, cat.id, month),
    }))
    .filter((c) => c.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  const total = ranked.reduce((s, c) => s + c.amount, 0);

  return (
    <Card>
      <CardHeader>
        <div>
          <span className="text-sm font-semibold text-gray-900 dark:text-zinc-50">
            Category Breakdown
          </span>
          <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">
            See how your spending is distributed across categories
          </p>
        </div>
        <span className="text-xs text-gray-400 dark:text-zinc-500">
          {getMonthName(month)}
        </span>
      </CardHeader>
      <CardContent>
        {ranked.length === 0 ? (
          <EmptyState
            heading="No spending this month"
            subtext="Add transactions to see your top spending categories."
          />
        ) : (
          <div className="space-y-4">
            <div className="space-y-4">
              {ranked.map((cat, i) => {
                const pct =
                  total > 0 ? Math.round((cat.amount / total) * 100) : 0;
                return (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="space-y-1.5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 dark:text-zinc-500 w-4 text-right shrink-0">
                        {i + 1}
                      </span>
                      <span
                        className="w-8 h-8 rounded-full flex items-center justify-center text-base shrink-0"
                        style={{ backgroundColor: cat.color + "22" }}
                      >
                        {cat.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-700 dark:text-zinc-300 truncate">
                            {cat.name}
                          </span>
                          <div className="flex items-center gap-2 shrink-0 ml-2">
                            <span className="text-xs text-gray-400 dark:text-zinc-500">
                              {pct}%
                            </span>
                            <span className="text-sm font-semibold text-gray-900 dark:text-zinc-50">
                              {formatCurrency(cat.amount)}
                            </span>
                          </div>
                        </div>
                        <div className="h-1.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: cat.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{
                              duration: 0.6,
                              delay: i * 0.06,
                              ease: "easeOut",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
