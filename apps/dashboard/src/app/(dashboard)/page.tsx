import { redirect } from "next/navigation";

export default function UserDashboardRoot() {
  return redirect("/overview");
}
