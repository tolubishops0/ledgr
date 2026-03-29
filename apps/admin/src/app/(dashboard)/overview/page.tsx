import { getAdminStats } from "@/lib/core/admin";
import {
  RecentSignups,
  StatsSection,
  UserGrowthChart,
} from "./overview-component";
import { getAllUsers } from "@/lib/core/users";

export default async function AdminOverviewPage() {
  const [stats, users] = await Promise.all([getAdminStats(), getAllUsers()]);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <StatsSection stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentSignups signups={users} />
        <UserGrowthChart users={users} />
      </div>
    </div>
  );
}
