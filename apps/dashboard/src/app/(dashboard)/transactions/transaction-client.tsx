"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import {
  PageHeader,
  Card,
  CardContent,
  Button,
  EmptyState,
  ConfirmDialog,
} from "@ledgr/ui";
import { groupTransactionsByDate } from "@ledgr/utils";
import type { Category, Transaction, TransactionType } from "@ledgr/types";
import {
  AddTransactionDrawer,
  TransactionDetailDrawer,
  TransactionRow,
  TransactionsFilters,
} from "./transaction-components";
import { useMemo, useState } from "react";

import { toast } from "sonner";
import {
  addTransaction,
  deleteTransaction,
  updateTransaction,
} from "@/lib/core/actions";
import { useUserContext } from "@/lib/context/user-context";

const initialFilters = {
  search: "",
  type: "all" as "all" | TransactionType,
  category: "all",
  fromDate: "",
  toDate: "",
};

export default function TransactionsClientPage({
  trans,
  cats,
}: {
  trans: Transaction[];
  cats: Category[];
}) {
  const { user } = useUserContext();
  const [transactions, setTransactions] = useState<Transaction[]>(trans);

  const [addOpen, setAddOpen] = useState(false);
  const [detailTx, setDetailTx] = useState<Transaction | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editTx, setEditTx] = useState<Transaction | null>(null);
  const [filters, setFilters] = useState(initialFilters);

  const [categories] = useState<Category[]>(cats);

  const clearFilters = () => setFilters(initialFilters);
  const isSuspended = user?.status === "suspended";
  const hasActiveFilters =
    filters.search ||
    filters.type !== "all" ||
    filters.category !== "all" ||
    filters.fromDate ||
    filters.toDate;

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (
        filters.search &&
        !t.description?.toLowerCase().includes(filters.search.toLowerCase())
      )
        return false;
      if (filters.type !== "all" && t.type !== filters.type) return false;
      if (filters.category !== "all" && t.category_id !== filters.category)
        return false;
      if (filters.fromDate && t.date < filters.fromDate) return false;
      if (filters.toDate && t.date > filters.toDate) return false;
      return true;
    });
  }, [transactions, filters]);

  const grouped = useMemo(() => groupTransactionsByDate(filtered), [filtered]);

  const handleAdd = async (trans: Transaction) => {
    const tempId = crypto.randomUUID();
    const optimistic = {
      ...trans,
      id: tempId,
      user_id: "",
      created_at: new Date().toISOString(),
    };
    setTransactions((prev) => [optimistic, ...prev]);
    try {
      // const { id: _id, created_at: _created_at, user_id: _user_id, ...transToSend } = trans;
      const transToSend = {
        amount: trans.amount,
        type: trans.type,
        category_id: trans.category_id,
        category: trans.category,
        description: trans.description,
        date: trans.date,
      };
      const saved = await addTransaction(transToSend);
      toast.success("Transaction added!");
      setTransactions((prev) =>
        prev.map((tx) =>
          tx.id === tempId
            ? {
                ...tx,
                amount: saved.amount,
                category: saved.category,
                date: saved.date,
              }
            : tx,
        ),
      );
    } catch (error) {
      setTransactions((prev) => prev.filter((tx) => tx.id !== tempId));
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  };

  const handleDelete = async (id: string) => {
    const index = transactions.findIndex((t) => t.id === id);
    if (index === -1) return;

    const deletedTx = transactions[index];

    setTransactions((prev) => prev.filter((t) => t.id !== id));

    try {
      await deleteTransaction(id);
      toast.info("Transaction deleted!");
    } catch (error) {
      setTransactions((prev) => {
        const copy = [...prev];
        copy.splice(index, 0, deletedTx);
        return copy;
      });

      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  };

  const handleUpdate = async (trans: Transaction) => {
    const prevTx = transactions.find((t) => t.id === trans.id);
    if (!prevTx) return;
    setTransactions((prev) => prev.map((t) => (t.id === trans.id ? trans : t)));

    try {
      // const { created_at, user_id, category, ...transToSend } = trans;
      const transToSend = {
        amount: trans.amount,
        type: trans.type,
        category_id: trans.category_id,
        description: trans.description,
        date: trans.date,
      };
      const saved = await updateTransaction(trans.id, transToSend);
      setTransactions((prev) =>
        prev.map((t) => (t.id === trans.id ? saved : t)),
      );
      toast.success("Transaction updated!");
    } catch (error) {
      setTransactions((prev) =>
        prev.map((t) => (t.id === trans.id ? prevTx : t)),
      );
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-4xl mx-auto">
      <PageHeader
        title="Transactions"
        subtitle="Track your income and expenses"
        action={
          <Button
            onClick={() => setAddOpen(true)}
            size="sm"
            disabled={user?.status === "suspended"}
          >
            <Plus size={15} />
            Add Transaction
          </Button>
        }
      />

      {transactions.length > 0 && (
        <TransactionsFilters
          categories={categories}
          filters={filters}
          setFilters={setFilters}
          clearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      )}

      {Object.keys(grouped).length === 0 ? (
        <EmptyState
          isSuspended={isSuspended}
          heading="No transactions found"
          subtext="Try adjusting your filters or add a new transaction."
          action={{ label: "Add Transaction", onClick: () => setAddOpen(true) }}
        />
      ) : (
        <Card>
          <CardContent className="px-0 py-0">
            {Object.entries(grouped).map(([label, txs]) => (
              <div key={label}>
                <div className="px-5 py-2 bg-gray-50 dark:bg-zinc-800/50 border-b border-gray-100 dark:border-zinc-800">
                  <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wide">
                    {label}
                  </span>
                </div>
                {txs.map((t, i) => (
                  <TransactionRow
                    key={t.id}
                    transaction={t}
                    index={i}
                    isSuspended={isSuspended}
                    categories={categories}
                    onClick={() => setDetailTx(t)}
                    onDelete={() => setDeleteId(t.id)}
                    onEdit={(tx) => setEditTx(tx)}
                  />
                ))}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <AddTransactionDrawer
        open={addOpen || !!editTx}
        onClose={() => {
          setAddOpen(false);
          setEditTx(null);
        }}
        onAdd={handleAdd}
        editTransaction={editTx}
        categories={categories}
        onUpdate={handleUpdate}
      />
      <TransactionDetailDrawer
        transaction={detailTx}
        onClose={() => setDetailTx(null)}
        categories={categories}
      />
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        title="Delete Transaction"
        description="Are you sure you want to delete this transaction? This action cannot be undone."
      />
    </div>
  );
}
