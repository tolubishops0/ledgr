"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ArrowLeftRight,
  BarChart2,
  Settings,
  UserCheck2Icon,
} from "lucide-react";
import {
  BottomTabBar,
  MobileDrawer,
  Navbar,
  Sidebar,
  useActiveHref,
} from "@ledgr/ui";
import type { Profile } from "@ledgr/types";
import { signOut } from "@/lib/core/auth";
import { AdminProvider } from "@/lib/context/admin-context";

const NAV = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/users", label: "Users", icon: UserCheck2Icon },
  { href: "/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function DashboardShell({
  user,
  children,
}: {
  user: Profile;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const pathname = usePathname();
  const activeHref = useActiveHref(NAV);
  const activeLabel =
    NAV.find((n) => n.href === activeHref)?.label ?? "Overview";

  return (
    <AdminProvider user={user}>
      <div className="min-h-screen bg-white dark:bg-zinc-950">
        <Sidebar
          navList={NAV}
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
          user={user}
          active={activeHref}
          logout={() => signOut()}
          showUserBadge={true}
          badge="Admin"
        />

        <MobileDrawer
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          navList={NAV}
          user={user}
          active={activeHref}
          logout={() => signOut()}
        />
        <Navbar
          sidebarCollapsed={collapsed}
          onMenuClick={() => setMobileOpen(true)}
          activeLabel={activeLabel}
          user={user}
          showUserBadge={true}
        />
        <motion.main
          animate={{ marginLeft: collapsed ? 64 : 240 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="pt-16 pb-20 lg:pb-0 min-h-screen"
          style={{ marginLeft: 0 }}
        >
          <style>{`@media (max-width: 1023px) { main { margin-left: 0 !important; } }`}</style>
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </motion.main>
        <BottomTabBar navList={NAV} active={activeHref} />
      </div>
    </AdminProvider>
  );
}
