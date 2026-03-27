import { getAdminAnalytics } from "@/lib/core/admin"
import { PageHeader } from "@ledgr/ui"
import { MonthlyVolumeChart, MostActiveUsers, TransactionTypeSplit, UserGrowthChart } from "./analytics-component"

export default async function AdminAnalyticsPage() {
  const { users, transactions } = await getAdminAnalytics()

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
      <PageHeader title="Analytics" subtitle="Platform-wide insights" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserGrowthChart users={users} />
        <MonthlyVolumeChart transactions={transactions} />
        <TransactionTypeSplit transactions={transactions} />
        <MostActiveUsers users={users} transactions={transactions} />
      </div>
    </div>
  )
}
