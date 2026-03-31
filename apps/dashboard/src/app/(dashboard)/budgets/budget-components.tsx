import { Budget, Category, Transaction } from "@ledgr/types";
import {
  Modal,
  Input,
  Button,
  Card,
  CardContent,
  ProgressBar,
  Label,
  Select,
} from "@ledgr/ui";
import { IncomeInput } from "@ledgr/ui/src/income-input";
import {
  calculateBudgetProgress,
  calculateSpent,
  THIS_MONTH,
  formatCurrency,
  getCategoryById,
} from "@ledgr/utils";
import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

export function BudgetModal({
  open,
  onClose,
  onSave,
  onEdit,
  existing,
  unusedCategories,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (b: Budget) => void;
  onEdit: (b: Budget) => void;
  existing?: Budget | null;
  unusedCategories: Category[];
}) {
  const [categoryId, setCategoryId] = useState(existing?.category_id ?? "");
  const [amount, setAmount] = useState(existing ? String(existing.amount) : "");
  const [month, setMonth] = useState(existing?.month ?? THIS_MONTH);

  useEffect(() => {
    if (open) {
      setCategoryId(existing?.category_id ?? "");
      setAmount(existing ? String(existing.amount) : "");
      setMonth(existing?.month ?? THIS_MONTH);
    }
  }, [open, existing]);

  function handleSave() {
    if (!categoryId || !amount) return;
    const budget: Budget = {
      id: existing?.id ?? `b-${Date.now()}`,
      user_id: existing?.user_id || "ui",
      category_id: categoryId,
      amount: parseFloat(amount),
      month,
      created_at: existing?.created_at ?? new Date().toISOString(),
    };

    if (existing) {
      onEdit(budget);
    } else {
      onSave(budget);
    }
    onClose();
  }

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={existing ? "Edit Budget" : "Set Budget"}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="cat">Category</Label>
          <Select
            disabled={!!existing}
            id="cat"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="" disabled={!existing}>
              {existing
                ? `${existing.category?.icon} ${existing.category?.name}`
                : "Select a category"}
            </option>
            {unusedCategories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="amt">Monthly budget</Label>

          <IncomeInput
            value={amount}
            onChange={(amt) => setAmount(amt)}
            size="sm"
            weight={"normal"}
            className="px-4 py-2 "
          />
        </div>

        <div>
          <Label htmlFor="month">Month</Label>
          <Input
            id="month"
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </div>

        <div className="flex gap-2 pt-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="flex-1 justify-center"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!categoryId || !amount}
            className="flex-1 justify-center"
          >
            Save Budget
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export function BudgetCard({
  budget,
  index,
  onEdit,
  onDelete,
  categories,
  transactions,
  isSuspended,
}: {
  budget: Budget;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  isSuspended: boolean;
  categories: Category[];
  transactions: Transaction[];
}) {
  const cat = getCategoryById(categories, budget.category_id);
  const spent = calculateSpent(transactions, budget.category_id, budget.month);
  const progress = calculateBudgetProgress(spent, budget.amount);
  const remaining = budget.amount - spent;
  const overBudget = remaining < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
    >
      <Card className="h-full">
        <CardContent className="py-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <span
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0"
                style={{ backgroundColor: cat ? cat.color + "22" : "#f3f4f6" }}
              >
                {cat?.icon ?? "📦"}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50 truncate">
                  {cat?.name ?? "Category"}
                </p>
                <p className="text-xs text-gray-400 dark:text-zinc-500">
                  {formatCurrency(budget.amount)} / month
                </p>
              </div>
            </div>
            {!isSuspended && (
              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  onClick={onEdit}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={onDelete}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            )}
          </div>

          <p className="text-xl font-bold text-gray-900 dark:text-zinc-50">
            {formatCurrency(spent)}
            <span className="text-xs font-normal text-gray-400 dark:text-zinc-500 ml-1">
              spent
            </span>
          </p>

          <ProgressBar value={progress} />

          <p
            className={[
              "text-xs font-semibold",
              overBudget
                ? "text-red-500 dark:text-red-400"
                : "text-green-600 dark:text-green-400",
            ].join(" ")}
          >
            {overBudget
              ? `Over budget by ${formatCurrency(Math.abs(remaining))}`
              : `${formatCurrency(remaining)} remaining`}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
