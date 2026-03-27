// import { getTransactions } from "@/lib/core/transactions";
// import { getCategories } from "@/lib/core/categories";
// import { getBudgets } from "@/lib/core/budgets";
// import { THIS_MONTH } from "@ledgr/utils";
// import { StatsSection, SpendingPie, BudgetOverview, RecentTransactions } from "./overview-components";

// export default async function OverviewPage() {
//   const [transactions, categories, budgets] = await Promise.all([
//     getTransactions(),
//     getCategories(),
//     getBudgets(THIS_MONTH),
//   ]);

//   return (
//     <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
//       <StatsSection transactions={transactions} />
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <SpendingPie transactions={transactions} categories={categories} />
//         <BudgetOverview
//           budgets={budgets}
//           transactions={transactions}
//           categories={categories}
//         />
//       </div>
//       <RecentTransactions categories={categories} transactions={transactions} />
//     </div>
//   );
// }


import { Suspense } from 'react'
import { Skeleton } from '@ledgr/ui'
import { getTransactions } from '@/lib/core/transactions'
import { getCategories } from '@/lib/core/categories'
import { getBudgets } from '@/lib/core/budgets'
import { THIS_MONTH } from '@ledgr/utils'
import {
  StatsSection,
  SpendingPie,
  BudgetOverview,
  RecentTransactions,
} from './overview-components'

export const experimental_ppr = true


async function StatsData() {
  const transactions = await getTransactions()
  return <StatsSection transactions={transactions ?? []} />
}

async function PieData() {
  const [transactions, categories] = await Promise.all([
    getTransactions(),
    getCategories(),
  ])
  return <SpendingPie transactions={transactions ?? []} categories={categories ?? []} />
}

async function BudgetData() {
  const [transactions, categories, budgets] = await Promise.all([
    getTransactions(),
    getCategories(),
    getBudgets(THIS_MONTH),
  ])
  return (
    <BudgetOverview
      budgets={budgets ?? []}
      transactions={transactions ?? []}
      categories={categories ?? []}
    />
  )
}

async function RecentData() {
  const [transactions, categories] = await Promise.all([
    getTransactions(),
    getCategories(),
  ])
  return <RecentTransactions transactions={transactions ?? []} categories={categories ?? []} />
}


export default function OverviewPage() {
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <Suspense fallback={
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map(i => <Skeleton key={i} variant="stat" />)}
        </div>
      }>
        <StatsData />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<Skeleton variant="card" className="h-64" />}>
          <PieData />
        </Suspense>
        <Suspense fallback={<Skeleton variant="card" className="h-64" />}>
          <BudgetData />
        </Suspense>
      </div>

      <Suspense fallback={<Skeleton variant="card" className="h-48" />}>
        <RecentData />
      </Suspense>
    </div>
  )
}