import { redirect } from "next/navigation";

export default function AdminDashboardRoot() {
  return redirect("/overview");
}
