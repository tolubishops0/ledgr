"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { PageHeader, Button, ConfirmDialog, EmptyState } from "@ledgr/ui";
import type { Budget, Category, Transaction } from "@ledgr/types";
import { BudgetCard, BudgetModal } from "./budget-components";
import { useState } from "react";

import { toast } from "sonner";
import { addBudget, deleteBudget, updateBudget } from "@/lib/core/actions";

export default function BudgetsClientPage({
  trans,
  cats,
  bgts,
}: {
  trans: Transaction[];
  cats: Category[];
  bgts: Budget[];
}) {
  const [budgets, setBudgets] = useState<Budget[]>(bgts);
  const [categories] = useState<Category[]>(cats);
  const [transactions] = useState<Transaction[]>(trans);
  const [modalOpen, setModalOpen] = useState(false);
  const [editBudget, setEditBudget] = useState<Budget | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // CHECK FOR DUPLICATE BUDGER WHEN MISS CLAUDE COMES ON

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

  const unusedCategories = categories.filter(
    (item) =>
      item.name !== "Salary" &&
      !budgets.some((bug) => bug.category?.id === item.id),
  );

  //   if (loading) return <BudgetsSkeleton />;

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
        unusedCategories={unusedCategories}
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
