import { getCategories, getTransactions } from "@/lib/core/queries";
import React from "react";
import TransactionsClientPage from "./transaction-client";

export default async function Transaction() {
  const [transactions, categories] = await Promise.all([
    getTransactions(),
    getCategories(),
  ]);
  return <TransactionsClientPage trans={transactions} cats={categories} />;
}
