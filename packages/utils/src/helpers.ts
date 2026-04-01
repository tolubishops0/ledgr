// 2026-03-24T12:34:56.789Z ===>2026-03
// export const THIS_MONTH = new Date().toISOString().slice(0, 7);

import { Category, Transaction } from "@ledgr/types";

export const THIS_MONTH = (() => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
})();

export function shortMonth(ym: string) {
  const [y, m] = ym.split("-");
  return new Date(parseInt(y), parseInt(m) - 1, 1).toLocaleDateString("en-US", {
    month: "short",
    year: "2-digit",
  });
}

// ==> [mar 26, feb 26, jan 26, dec 25, nov 25]
export const MONTHS_OPTIONS = (() => {
  const months: string[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
    );
  }
  return months;
})();

// 2026-03-24T12:34:56.789Z ===>2026-03-24
export const today = new Date().toISOString().split("T")[0];

// Format "May 2026"
export function formatMonthYear(): string {
  const [year, month] = THIS_MONTH.split("-").map(Number);
  if (!year || !month) return "";
  const date = new Date(year, month - 1);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

// Format currency safely
export function formatCurrency(amount: number | null | undefined): string {
  if (typeof amount !== "number") amount = 0;
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
}

// "2026-03-24T12:34:56Z" => "Mar 24, 2026"
export function formatDate(date: string | undefined | null): string {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

// "2026-05-12" => "May 12"
export function formatDateShort(date: string | undefined | null): string {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(d);
}

// "2026-05-12" => 12 may 2026"
export function formatFullDate(input: string): string {
  const [day, month, year] = input.split("/").map(Number);
  const date = new Date(year, month - 1, day);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  return date.toLocaleDateString("en-GB", options);
}

export function toInputDate(d: string) {
  const dateObj = new Date(d);
  const yyyy = dateObj.getFullYear();
  const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
  const dd = String(dateObj.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// // "2026-05-12" => "May 2026"
export function getMonthName(date: Date | string | undefined | null): string {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(d);
}

// Calculate budget progress safely
export function calculateBudgetProgress(
  spent: number | null | undefined,
  budget: number | null | undefined,
): number {
  spent = typeof spent === "number" ? spent : 0;
  budget = typeof budget === "number" ? budget : 0;
  if (budget === 0) return 0;
  return Math.min(100, Math.round((spent / budget) * 100));
}

// Group transactions by date with safe checks
export function groupTransactionsByDate(
  transactions: Transaction[] | undefined,
): Record<string, Transaction[]> {
  if (!Array.isArray(transactions)) return {};
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const groups: Record<string, Transaction[]> = {};

  const sorted = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  for (const t of sorted) {
    const d = new Date(t.date);
    if (isNaN(d.getTime())) continue;
    d.setHours(0, 0, 0, 0);

    let label: string;
    if (d.getTime() === today.getTime()) {
      label = "Today";
    } else if (d.getTime() === yesterday.getTime()) {
      label = "Yesterday";
    } else {
      label = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }).format(d);
    }

    if (!groups[label]) groups[label] = [];
    groups[label].push(t);
  }

  return groups;
}

// Monthly totals with safe checks
export function getMonthlyTotals(
  transactions: Transaction[] | undefined,
  months: number,
): { month: string; income: number; expense: number }[] {
  if (!Array.isArray(transactions)) return [];
  const result: { month: string; income: number; expense: number }[] = [];
  const now = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = new Intl.DateTimeFormat("en-US", {
      month: "short",
      year: "2-digit",
    }).format(d);

    const income = transactions
      .filter((t) => t.date?.startsWith(key) && t.type === "income")
      .reduce((s, t) => s + (t.amount ?? 0), 0);

    const expense = transactions
      .filter((t) => t.date?.startsWith(key) && t.type === "expense")
      .reduce((s, t) => s + (t.amount ?? 0), 0);

    result.push({ month: label, income, expense });
  }

  return result;
}

// Initials safely
export function initials(name?: string): string {
  if (!name) return "";
  return name
    .split(" ")
    .map((w) => w[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// Calculate spent safely
export function calculateSpent(
  transactions: Transaction[] | undefined,
  categoryId: string,
  month: string,
): number {
  if (!Array.isArray(transactions) || !categoryId || !month) return 0;

  return transactions
    .filter(
      (t) =>
        t.category_id === categoryId &&
        tMonth(t) === month &&
        t.type === "expense",
    )
    .reduce((sum, t) => sum + (t.amount ?? 0), 0);

  function tMonth(tx: Transaction) {
    return tx.date?.slice(0, 7) ?? "";
  }
}

// Get category by id
export function getCategoryById(
  categories: Category[] | undefined,
  id: string,
) {
  if (!Array.isArray(categories) || !id) return undefined;
  return categories.find((c) => c.id === id);
}

// Get monthly income safely
export function getMonthlyIncome(transactions: Transaction[] | undefined) {
  if (!Array.isArray(transactions)) return 0;
  return transactions
    .filter((t) => t.type === "income" && t.date?.startsWith(THIS_MONTH))
    .reduce((s, t) => s + (t.amount ?? 0), 0);
}

// Get monthly expenses safely
export function getMonthlyExpenses(transactions: Transaction[] | undefined) {
  if (!Array.isArray(transactions)) return 0;
  return transactions
    .filter((t) => t.type === "expense" && t.date?.startsWith(THIS_MONTH))
    .reduce((s, t) => s + (t.amount ?? 0), 0);
}

// Total balance safely
export function getTotalBalance(transactions: Transaction[] | undefined) {
  if (!Array.isArray(transactions)) return 0;
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + (t.amount ?? 0), 0);
  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + (t.amount ?? 0), 0);
  return income - expense;
}

// Monthly count safely
export function getMonthlyCount(transactions: Transaction[] | undefined) {
  if (!Array.isArray(transactions)) return 0;
  return transactions.filter((t) => t.date?.startsWith(THIS_MONTH)).length;
}

// Spending by category safely
export function getSpendingByCategory({
  categories,
  transactions,
}: {
  categories: Category[] | undefined;
  transactions: Transaction[] | undefined;
}) {
  if (!Array.isArray(categories) || !Array.isArray(transactions)) return [];
  const spendingCats = categories.filter((c) => c.name !== "Salary");
  return spendingCats
    .map((cat) => ({
      ...cat,
      amount: calculateSpent(transactions, cat.id, THIS_MONTH),
    }))
    .filter((c) => c.amount > 0);
}

// 10000 ==> #10,000
export const formatNaira = (amount: number, includeSymbol: boolean = true) => {
  if (!amount) return null;
  return new Intl.NumberFormat("en-NG", {
    style: includeSymbol ? "currency" : "decimal",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

// "2026-03-24T12:34:56Z" => "4:09:03 PM"
export const formatNotificationTime = (date?: string | number | Date) => {
  if (!date) return "";

  const now = new Date();
  const target = new Date(date);

  const diffMs = now.getTime() - target.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hr ago`;

  if (diffDays === 1) return "yesterday";

  if (diffDays < 7) return `${diffDays} days ago`;

  return target.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
