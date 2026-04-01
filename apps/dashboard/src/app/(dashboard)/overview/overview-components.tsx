"use client";
import { Budget, Category, Transaction } from "@ledgr/types";
import {
  Card,
  CardContent,
  CardHeader,
  EmptyState,
  ProgressBar,
  StatCard,
} from "@ledgr/ui";
import {
  formatCurrency,
  getTotalBalance,
  getMonthlyIncome,
  getMonthlyExpenses,
  getMonthlyCount,
  getSpendingByCategory,
  calculateBudgetProgress,
  calculateSpent,
  getCategoryById,
  THIS_MONTH,
  formatMonthYear,
} from "@ledgr/utils";
import { motion } from "framer-motion";
import { Wallet, TrendingUp, TrendingDown, ArrowLeftRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { ResponsiveContainer, Pie, Cell, Tooltip, PieChart } from "recharts";

export function StatsSection({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const stats = [
    {
      label: "Total Balance",
      value: formatCurrency(getTotalBalance(transactions)),
      trend: 12.5,
      icon: <Wallet size={18} />,
    },
    {
      label: "Income This Month",
      value: formatCurrency(getMonthlyIncome(transactions)),
      trend: 8.2,
      icon: <TrendingUp size={18} />,
    },
    {
      label: "Expenses This Month",
      value: formatCurrency(getMonthlyExpenses(transactions)),
      trend: -3.1,
      icon: <TrendingDown size={18} />,
    },
    {
      label: "Transactions",
      value: String(getMonthlyCount(transactions)),
      icon: <ArrowLeftRight size={18} />,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.3 }}
        >
          <StatCard {...s} />
        </motion.div>
      ))}
    </div>
  );
}

export function SpendingPie({
  categories,
  transactions,
}: {
  categories: Category[];
  transactions: Transaction[];
}) {
  const data = getSpendingByCategory({ categories, transactions });

  if (!data.length) {
    return (
      <Card>
        <CardHeader>
          <span className="text-sm font-semibold text-gray-900 dark:text-zinc-50">
            Spending by Category
          </span>
        </CardHeader>
        <CardContent>
          <EmptyState
            heading="No spending data"
            subtext="Add your first transaction to see your spending breakdown."
          />
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader>
        <span className="text-sm font-semibold text-gray-900 dark:text-zinc-50">
          Spending by Category
        </span>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              isAnimationActive
              animationDuration={800}
            >
              {data.map((entry) => (
                <Cell key={entry.id} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatCurrency(Number(value) || 0)}
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: "1px solid #e5e7eb",
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
          {data.map((cat) => (
            <div key={cat.id} className="flex items-center gap-2 min-w-0">
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0"
                style={{ backgroundColor: cat.color + "22" }}
              >
                {cat.icon}
              </span>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 dark:text-zinc-400 truncate">
                  {cat.name}
                </p>
                <p className="text-xs font-medium text-gray-900 dark:text-zinc-50">
                  {formatCurrency(cat.amount)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function BudgetOverview({
  budgets,
  categories,
  transactions,
}: {
  budgets: Budget[];
  categories: Category[];
  transactions: Transaction[];
}) {
  const noData = !budgets.length || !categories.length;
  return (
    <Card>
      <CardHeader>
        <span className="text-sm font-semibold text-gray-900 dark:text-zinc-50">
          Budget Overview
        </span>
        <span className="text-xs text-gray-400 dark:text-zinc-500">
          {formatMonthYear()}
        </span>
      </CardHeader>
      <CardContent>
        {noData ? (
          <EmptyState
            heading="No budgets set"
            subtext="Set your first budget to start tracking your spending."
          />
        ) : (
          <div className="space-y-4">
            {budgets.map((budget, i) => {
              const cat = getCategoryById(categories, budget.category_id);
              if (!cat) return null;
              const spent = calculateSpent(
                transactions,
                budget.category_id,
                THIS_MONTH,
              );
              const progress = calculateBudgetProgress(spent, budget.amount);
              return (
                <motion.div
                  key={budget.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0"
                        style={{ backgroundColor: cat.color + "22" }}
                      >
                        {cat.icon}
                      </span>
                      <span className="text-sm text-gray-700 dark:text-zinc-300 truncate">
                        {cat.name}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-zinc-400 shrink-0">
                      {formatCurrency(spent)} / {formatCurrency(budget.amount)}
                    </span>
                  </div>
                  <ProgressBar value={progress} />
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function RecentTransactions({
  categories,
  transactions,
}: {
  categories: Category[];
  transactions: Transaction[];
}) {
  const noData = !categories.length || !transactions.length;

  const recent = !noData
    ? [...transactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)
    : [];

  return (
    <Card>
      <CardHeader>
        <span className="text-sm font-semibold text-gray-900 dark:text-zinc-50">
          Recent Transactions
        </span>
        {!noData && transactions.length > 0 && (
          <Link
            href="/transactions"
            className="text-xs text-green-600 dark:text-green-400 hover:underline"
          >
            View all
          </Link>
        )}
      </CardHeader>

      <CardContent className="px-0 py-0 pb-2">
        {noData ? (
          <EmptyState
            heading="No recent transactions made"
            subtext="Make your first transaction to track your spendings"
          />
        ) : (
          recent.map((t, i) => {
            const cat = getCategoryById(categories, t.category_id);
            const isIncome = t.type === "income";
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center text-base shrink-0"
                  style={{
                    backgroundColor: cat ? cat.color + "22" : "#f3f4f6",
                  }}
                >
                  {cat?.icon ?? "💳"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-zinc-50 truncate">
                    {t.description ?? "Transaction"}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-zinc-500">
                    {new Date(t.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <span
                  className={[
                    "text-sm font-semibold shrink-0",
                    isIncome
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-500 dark:text-red-400",
                  ].join(" ")}
                >
                  {isIncome ? "+" : "-"}
                  {formatCurrency(t.amount)}
                </span>
              </motion.div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
