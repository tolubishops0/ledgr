import { getAllTransactions, getAllUsers } from "@/lib/core/users";
import AdminUsersPageClient from "./user-client";


export default async function AdminUsersPage() {
  const [users, transactions] = await Promise.all([getAllUsers(), getAllTransactions()]);

  return <AdminUsersPageClient initialTrans={transactions} initialUsers={users ?? []} />;
}

