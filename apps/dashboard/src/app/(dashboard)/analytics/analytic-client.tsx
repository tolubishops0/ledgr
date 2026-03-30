"use client";

import * as React from "react";

import { PageHeader, Select } from "@ledgr/ui";
import { MONTHS_OPTIONS, THIS_MONTH, shortMonth } from "@ledgr/utils";
import {
  IncomeVsExpensesChart,
  SpendingTrendChart,
  CategoryBreakdownChart,
  TopCategories,
} from "./analytics-components";
import { useState } from "react";

import { Category, Transaction } from "@ledgr/types";

export default function AnalyticsClientPage({
  trans,
  cats,
}: {
  trans: Transaction[];
  cats: Category[];
}) {
  const [selectedMonth, setSelectedMonth] = useState(THIS_MONTH);
  const [categories] = useState<Category[]>(cats);
  const [transactions] = useState<Transaction[]>(trans);

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
