import DashboardShell from "@/components/ui/dashboard-shell";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const profileCookie = cookieStore.get("profile")?.value;

  if (!profileCookie) redirect("/login");

  const profile = JSON.parse(profileCookie);

  return <DashboardShell user={profile}>{children}</DashboardShell>;
}
