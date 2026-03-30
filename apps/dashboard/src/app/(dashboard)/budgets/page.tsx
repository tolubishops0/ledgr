import React from "react";
import { THIS_MONTH } from "@ledgr/utils";
import BudgetsClientPage from "./budget-client";
import { getBudgets, getCategories, getTransactions } from "@/lib/core/queries";

export default async function Budget() {
  const [transactions, categories, bgts] = await Promise.all([
    getTransactions(),
    getCategories(),
    getBudgets(THIS_MONTH),
  ]);
  return (
    <BudgetsClientPage trans={transactions} cats={categories} bgts={bgts} />
  );
}
