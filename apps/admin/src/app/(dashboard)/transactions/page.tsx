import { getCategories } from "@/lib/core/categories";
import AdminTransactionsPageClient from "./transaction-client";
import { getAllTransactions } from "@/lib/core/users";

export default async function AdminTransactionsPage() {
  const [transactions, categories] = await Promise.all([
    getAllTransactions(),
    getCategories(),
  ]);

  return (
    <AdminTransactionsPageClient
      initialTransactions={transactions ?? []}
      initialCategories={categories ?? []}
    />
  );
}