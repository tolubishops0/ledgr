import { getTransactions, getCategories, getBudgets } from "@/lib/core/queries";
import { THIS_MONTH } from "@ledgr/utils";
import {
  StatsSection,
  SpendingPie,
  BudgetOverview,
  RecentTransactions,
} from "./overview-components";
import { FirstTimeUserModal } from "@/components/ui/firsttime-modal";

export default async function OverviewPage() {
  const [transactions, categories, budgets] = await Promise.all([
    getTransactions(),
    getCategories(),
    getBudgets(THIS_MONTH),
  ]);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <StatsSection transactions={transactions ?? []} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingPie
          transactions={transactions ?? []}
          categories={categories ?? []}
        />
        <BudgetOverview
          budgets={budgets ?? []}
          transactions={transactions ?? []}
          categories={categories ?? []}
        />
      </div>
      <RecentTransactions
        transactions={transactions ?? []}
        categories={categories ?? []}
      />
      <FirstTimeUserModal
        budgetsCount={budgets.length}
        transactionsCount={transactions.length}
      />
    </div>
  );
}
