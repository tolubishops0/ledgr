import { Category, Transaction, TransactionType } from "@ledgr/types";
import { Drawer, Input, Button, Card, CardContent, Select } from "@ledgr/ui";
import {
  formatCurrency,
  formatDate,
  formatDateShort,
  getCategoryById,
  today,
} from "@ledgr/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Pencil, Search, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Label } from "recharts";
import { Badge } from "@ledgr/ui";
import { MdClear } from "react-icons/md";
import { IncomeInput } from "@ledgr/ui/src/income-input";

export function AddTransactionDrawer({
  open,
  onClose,
  onAdd,
  onUpdate,
  editTransaction,
  categories,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (t: Transaction) => void;
  onUpdate: (t: Transaction) => void;
  editTransaction: Transaction | null;
  categories: Category[];
}) {
  const [amount, setAmount] = React.useState("");
  const [type, setType] = React.useState<TransactionType>("expense");
  const [categoryId, setCategoryId] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [date, setDate] = React.useState(today);

  useEffect(() => {
    if (editTransaction) {
      setAmount(String(editTransaction.amount));
      setType(editTransaction.type);
      setCategoryId(editTransaction.category_id);
      setDescription(editTransaction.description ?? "");
      setDate(editTransaction.date);
    } else {
      setAmount("");
      setType("expense");
      setCategoryId("");
      setDescription("");
      setDate(today);
    }
  }, [editTransaction, open]);

  function handleSave() {
    if (editTransaction) {
      onUpdate({
        ...editTransaction,
        amount: parseFloat(amount),
        type,
        category_id: categoryId,
        description,
        date,
      });
    } else {
      onAdd({
        amount: parseFloat(amount),
        type,
        category_id: categoryId,
        description,
        date,
      } as Transaction);
    }
    onClose();
  }

  const handleTypeSelected = (t: TransactionType) => {
    setType(t);
    if (t === "income") {
      const salary = categories.find((c) => c.name === "Salary");
      if (salary) setCategoryId(salary.id);
    } else {
      setCategoryId("");
    }
  };
  return (
    <Drawer
      isOpen={open}
      onClose={onClose}
      title={editTransaction ? "Edit Transaction" : "Add Transaction"}
    >
      <div className="space-y-5">
        <div>
          <Label>Amount</Label>

          <IncomeInput
            value={amount}
            onChange={(amt) => setAmount(amt)}
            size="lg"
            weight={"bold"}
            className="px-4 py-3 "
          />
        </div>

        <div>
          <Label>Type</Label>
          <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-700">
            {(["expense", "income"] as TransactionType[]).map((t) => (
              <motion.button
                key={t}
                onClick={() => handleTypeSelected(t)}
                className={[
                  "cursor-pointer flex-1 py-2.5 text-sm font-semibold capitalize transition-colors",
                  type === t
                    ? "bg-green-600 text-white"
                    : "bg-white dark:bg-zinc-900 text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800",
                ].join(" ")}
              >
                {t}
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          <Label>Category</Label>
          <div className="grid grid-cols-4 gap-2">
            {categories?.map((cat) => {
              const selected = categoryId === cat.id;
              const isDisabled = type === "income";
              return (
                <button
                  key={cat.id}
                  disabled={isDisabled}
                  onClick={() => setCategoryId(cat.id)}
                  className={[
                    "cursor-pointer relative flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all",
                    selected ? "border-green-600" : "border-transparent",
                    isDisabled
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:scale-105",
                  ].join(" ")}
                  style={{
                    backgroundColor: cat.color + "18",
                  }}
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span className="text-[10px] text-gray-600 dark:text-zinc-400 text-center leading-tight truncate w-full">
                    {cat.name.split(" ")[0]}
                  </span>
                  {selected && !isDisabled && (
                    <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-green-600 flex items-center justify-center">
                      <Check size={8} className="text-white" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <Label>Description</Label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Chicken Republic"
          />
        </div>

        <div>
          <Label>Date</Label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <Button
          onClick={handleSave}
          disabled={!amount || !categoryId}
          className="w-full justify-center"
          size="lg"
        >
          {editTransaction ? "Save Changes" : "Add Transaction"}
        </Button>
      </div>
    </Drawer>
  );
}

export function TransactionDetailDrawer({
  transaction,
  onClose,
  categories,
}: {
  categories: Category[];
  transaction: Transaction | null;
  onClose: () => void;
}) {
  const cat =
    transaction && categories
      ? getCategoryById(categories, transaction.category_id)
      : null;
  const isIncome = transaction?.type === "income";

  return (
    <Drawer
      isOpen={!!transaction}
      onClose={onClose}
      title="Transaction Details"
    >
      {transaction && (
        <div className="flex flex-col items-center text-center gap-3 pt-4">
          <span
            className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
            style={{ backgroundColor: cat ? cat.color + "22" : "#f3f4f6" }}
          >
            {cat?.icon ?? "💳"}
          </span>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            {cat?.name}
          </p>
          <p
            className={[
              "text-4xl font-bold",
              isIncome
                ? "text-green-600 dark:text-green-400"
                : "text-red-500 dark:text-red-400",
            ].join(" ")}
          >
            {isIncome ? "+" : "-"}
            {formatCurrency(transaction.amount)}
          </p>
          <Badge variant={isIncome ? "success" : "destructive"}>
            {transaction.type}
          </Badge>
          <div className="w-full mt-4 space-y-3 text-left">
            {transaction.description && (
              <div className="flex justify-between py-2.5 border-b border-gray-100 dark:border-zinc-800">
                <span className="text-sm text-gray-500 dark:text-zinc-400">
                  Description
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-zinc-50">
                  {transaction.description}
                </span>
              </div>
            )}
            <div className="flex justify-between py-2.5 border-b border-gray-100 dark:border-zinc-800">
              <span className="text-sm text-gray-500 dark:text-zinc-400">
                Date
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-zinc-50">
                {formatDate(transaction.date)}
              </span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="text-sm text-gray-500 dark:text-zinc-400">
                Category
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-zinc-50">
                {cat?.name}
              </span>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
}

export function TransactionRow({
  transaction,
  onDelete,
  onClick,
  index,
  categories,
  onEdit,
  isSuspended,
}: {
  categories: Category[];
  transaction: Transaction;
  isSuspended: boolean;

  onEdit: (row: Transaction) => void;
  onDelete: (id: string) => void;
  onClick: () => void;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const cat = getCategoryById(categories, transaction.category_id);
  const isIncome = transaction.type === "income";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer relative"
      onClick={onClick}
    >
      <span
        className="w-9 h-9 rounded-full flex items-center justify-center text-base shrink-0"
        style={{ backgroundColor: cat ? cat.color + "22" : "#f3f4f6" }}
      >
        {cat?.icon ?? "💳"}
      </span>

      <div className="flex-1 min-w-0">
        <p className="text-sm capitalize font-semibold text-gray-900 dark:text-zinc-50 truncate">
          {transaction.description ?? "Transaction"}
        </p>
        <p className="text-xs text-gray-400 dark:text-zinc-500">{cat?.name}</p>
      </div>

      <Badge
        variant={isIncome ? "success" : "destructive"}
        className="hidden sm:inline-flex"
      >
        {transaction.type}
      </Badge>

      <span
        className={[
          "text-sm font-semibold shrink-0 w-28 text-right",
          isIncome
            ? "text-green-600 dark:text-green-400"
            : "text-red-500 dark:text-red-400",
        ].join(" ")}
      >
        {isIncome ? "+" : "-"}
        {formatCurrency(transaction.amount)}
      </span>

      <span className="text-xs text-gray-400 dark:text-zinc-500 w-16 text-right hidden md:block shrink-0">
        {formatDateShort(transaction.date)}
      </span>

      <AnimatePresence>
        {!isSuspended && hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute right-4 flex items-center gap-1 bg-white dark:bg-zinc-900 rounded-lg shadow border border-gray-100 dark:border-zinc-700 p-0.5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => onEdit(transaction)}
              className="cursor-pointer p-1.5 rounded text-gray-400 hover:text-gray-700 dark:hover:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={() => onDelete(transaction.id)}
              className="cursor-pointer p-1.5 rounded text-gray-400 hover:text-white hover:bg-red-500 transition-colors"
            >
              <Trash2 size={13} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

type Filters = {
  search: string;
  type: "all" | TransactionType;
  category: string;
  fromDate: string;
  toDate: string;
};

type transactionFilterProps = {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  clearFilters: () => void;
  hasActiveFilters: boolean | string;
  categories: Category[];
};

export function TransactionsFilters({
  filters,
  setFilters,
  clearFilters,
  hasActiveFilters,
  categories,
}: transactionFilterProps) {
  return (
    <>
      {hasActiveFilters && (
        <div className="w-full flex justify-end">
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <MdClear size={15} />
            Clear filters
          </Button>
        </div>
      )}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <Input
                value={filters.search}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, search: e.target.value }))
                }
                placeholder="Search transactions..."
                className="pl-8"
              />
            </div>

            <Select
              value={filters.type}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  type: e.target.value as "all" | TransactionType,
                }))
              }
              className="sm:w-36"
            >
              <option value="all">All types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </Select>

            <Select
              value={filters.category}
              onChange={(e) =>
                setFilters((f) => ({ ...f, category: e.target.value }))
              }
              className="sm:w-44"
            >
              <option value="all">All categories</option>
              {categories?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </Select>

            <Input
              type="date"
              value={filters.fromDate}
              onChange={(e) =>
                setFilters((f) => ({ ...f, fromDate: e.target.value }))
              }
              className="sm:w-40 cursor-pointer"
            />
            <Input
              type="date"
              value={filters.toDate}
              onChange={(e) =>
                setFilters((f) => ({ ...f, toDate: e.target.value }))
              }
              className="sm:w-40 cursor-pointer"
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
