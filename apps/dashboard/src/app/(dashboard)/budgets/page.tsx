"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { PageHeader, Button, ConfirmDialog, EmptyState } from "@ledgr/ui";
import { THIS_MONTH } from "@ledgr/utils";
import type { Budget, Category, Transaction } from "@ledgr/types";
import BudgetsSkeleton from "./loading";
import { BudgetCard, BudgetModal } from "./budget-components";
import { getCategories } from "@/lib/core/categories";
import { getTransactions } from "@/lib/core/transactions";
import { useEffect, useState } from "react";
import {
  addBudget,
  deleteBudget,
  getBudgets,
  updateBudget,
} from "@/lib/core/budgets";
import { toast } from "sonner";

export default function BudgetsPage() {
  const [loading, setLoading] = useState(true);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editBudget, setEditBudget] = useState<Budget | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // CHECK FOR DUPLICATE BUDGER WHEN MISS CLAUDE COMES ON

  useEffect(() => {
    Promise.all([getTransactions(), getCategories(), getBudgets(THIS_MONTH)])
      .then(([txs, cats, bgt]) => {
        setTransactions(txs ?? []);
        setCategories(cats ?? []);
        setBudgets(bgt ?? []);
      })
      .catch((error) => {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong",
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (bgt: Budget) => {
    const tempId = crypto.randomUUID();
    const optimistic = {
      ...bgt,
      id: tempId,
      user_id: "",
      created_at: new Date().toISOString(),
    };

    setBudgets((prev) => [optimistic, ...prev]);

    try {
      // const { id: _id, created_at: _created_at, user_id: _user_id, ...cleanedbgt } = bgt
      const cleanBgt = {
        amount: bgt.amount,
        category_id: bgt.category_id,
        month: bgt.month,
        category: bgt.category,
      };
      const saved = await addBudget(cleanBgt);
      toast.success("Budget added!");
      setBudgets((prev) => prev.map((b) => (b.id === tempId ? saved : b)));
    } catch (error) {
      setBudgets((prev) => prev.filter((b) => b.id !== tempId));
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  };

  const handleDelete = async (id: string) => {
    const deletedBgt = budgets.find((b) => b.id === id);
    setBudgets((prev) => prev.filter((b) => b.id !== id));
    try {
      await deleteBudget(id);
      toast.success("Budget deleted!");
    } catch (error) {
      setBudgets((prev) => [deletedBgt!, ...prev]);
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  };

  const handleUpdate = async (bgt: Budget) => {
    const prevBgt = budgets.find((b) => b.id === bgt.id);
    if (!prevBgt) return;
    setBudgets((prev) => prev.map((b) => (b.id === bgt.id ? bgt : b)));
    try {
      // const { created_at, user_id, ...bgtToSend } = bgt;
      const bgtToSend = {
        category_id: bgt.category_id,
        category: bgt.category,
        amount: bgt.amount,
        month: bgt.month,
      };
      const saved = await updateBudget(bgt.id, bgtToSend);
      toast.success("Budget updated!");
      setBudgets((prev) => prev.map((b) => (b.id === bgt.id ? saved : b)));
    } catch (error) {
      setBudgets((prev) => prev.map((b) => (b.id === bgt.id ? prevBgt : b)));
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  };
  console.log(
    budgets.map((item) => item.category?.name),
    "used budgets",
  );
  const usedCategoryIds = budgets.map((b) => b.id);

  if (loading) return <BudgetsSkeleton />;
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Budgets"
        subtitle="Manage your monthly spending limits"
        action={
          <Button
            size="sm"
            onClick={() => {
              setEditBudget(null);
              setModalOpen(true);
            }}
          >
            <Plus size={15} />
            Set Budget
          </Button>
        }
      />

      {budgets.length === 0 ? (
        <EmptyState
          heading="No budgets set yet"
          subtext="Start by setting your first budget to track your spending."
          action={{
            label: "Set Budget",
            onClick: () => {
              setEditBudget(null);
              setModalOpen(true);
            },
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((budget, i) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              index={i}
              onEdit={() => {
                setEditBudget(budget);
                setModalOpen(true);
              }}
              onDelete={() => setDeleteId(budget.id)}
              categories={categories}
              transactions={transactions}
            />
          ))}
        </div>
      )}

      <BudgetModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        onEdit={handleUpdate}
        existing={editBudget}
        categories={categories}
        usedCategoriesIds={usedCategoryIds}
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        title="Delete Budget"
        description="Are you sure you want to delete this budget? This cannot be undone."
      />
    </div>
  );
}
