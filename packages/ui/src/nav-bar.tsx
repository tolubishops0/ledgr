"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Bell, Menu } from "lucide-react";
import { Avatar } from "./avatar";
import { initials } from "@ledgr/utils";
import { Profile } from "@ledgr/types";
import { useNotifications } from "../../../apps/admin/src/lib/core/hook/use-notifications";
import { NotificationDropdown } from "./notification";

interface NavbarProps {
  sidebarCollapsed: boolean;
  onMenuClick: () => void;
  activeLabel: string;
  user: Profile;
  logo?: string;
  badge?: string;
  badgeColor?: string;
  showUserBadge?: boolean;
}

export function Navbar({
  sidebarCollapsed,
  onMenuClick,
  activeLabel,
  user,
  logo = "Ledgr",
  badge,
  badgeColor = "amber",
  showUserBadge = false,
}: NavbarProps) {
  const leftOffset =
    window.innerWidth >= 1024 ? (sidebarCollapsed ? 64 : 240) : 0;

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 right-0 z-20 h-16 bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between px-4 gap-3 transition-all duration-[250ms]"
      style={{ left: leftOffset }}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>

        <span className="hidden lg:block text-sm font-semibold text-gray-900 dark:text-zinc-50">
          {activeLabel}
        </span>

        <div className="lg:hidden flex items-center gap-2">
          <span className="text-base font-extrabold text-green-600 dark:text-green-400">
            {logo}
          </span>
          {badge && (
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold
              ${
                badgeColor === "amber"
                  ? "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400"
                  : "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400"
              }`}
            >
              {badge}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1">
        <NotificationDropdown userId={user?.id} />
        <div className="relative ml-1">
          <Avatar
            src={user?.avatar_url ?? undefined}
            initials={initials(user.full_name)}
            size="sm"
            className="cursor-pointer"
          />
          {showUserBadge && (
            <span className="absolute -bottom-0.5 -right-0.5 px-1 py-px rounded text-[8px] font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 leading-none">
              A
            </span>
          )}
        </div>
      </div>
    </motion.header>
  );
}
