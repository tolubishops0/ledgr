"use client";

import * as React from "react";

import { PageHeader, Select } from "@ledgr/ui";
import { MONTHS_OPTIONS, THIS_MONTH, shortMonth } from "@ledgr/utils";
import AnalyticsSkeleton from "./loading";
import {
  IncomeVsExpensesChart,
  SpendingTrendChart,
  CategoryBreakdownChart,
  TopCategories,
} from "./analytics-components";
import { useEffect, useState } from "react";
import { getCategories } from "@/lib/core/categories";
import { getTransactions } from "@/lib/core/transactions";
import { Category, Transaction } from "@ledgr/types";
import { toast } from "sonner";

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(THIS_MONTH);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [txs, cats] = await Promise.all([
          getTransactions(),
          getCategories(),
        ]);
        setTransactions(txs ?? []);
        setCategories(cats ?? []);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <AnalyticsSkeleton />;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Analytics"
        subtitle="Visualise your financial patterns"
        action={
          <Select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-36"
          >
            {MONTHS_OPTIONS.map((m) => (
              <option key={m} value={m}>
                {shortMonth(m)}
              </option>
            ))}
          </Select>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IncomeVsExpensesChart transactions={transactions} />
        <SpendingTrendChart transactions={transactions} />
        <CategoryBreakdownChart
          transactions={transactions}
          categories={categories}
          month={selectedMonth}
        />
        <TopCategories
          transactions={transactions}
          categories={categories}
          month={selectedMonth}
        />
      </div>
    </div>
  );
}
