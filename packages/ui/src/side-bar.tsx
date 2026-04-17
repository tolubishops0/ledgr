"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar } from "./avatar";
import { Profile } from "@ledgr/types";
import { initials } from "@ledgr/utils";
import { SignOut } from "./sign-out";
import { NavItem } from "./use-active-href";
import Image from "next/image";
import { Logo } from "./logo";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  navList: NavItem[];
  user: Profile;
  logo?: string;
  badge?: string;
  badgeColor?: string;
  showUserBadge?: boolean;
  active: string;
  logout: () => void;
}

export function Sidebar({
  collapsed,
  onToggle,
  navList,
  user,
  badge,
  badgeColor = "amber",
  showUserBadge = false,
  active,
  logout,
}: SidebarProps) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="hidden lg:flex flex-col fixed left-0 top-0 h-screen z-30 bg-gray-50 dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 overflow-hidden"
    >
      <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-zinc-800 shrink-0">
        <Link
          href="/overview"
          className="flex items-center gap-2 overflow-hidden"
        >
          <div className="w-7 h-7 rounded-lg bg-green-600 flex items-center justify-center text-white font-extrabold text-sm shrink-0">
            <Logo />
          </div>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                key="logo-text"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 overflow-hidden"
              >
                <span className="text-lg font-extrabold text-green-600 dark:text-green-400 tracking-tight whitespace-nowrap">
                  Ledgr
                </span>
                {badge && showUserBadge && (
                  <span
                    className={`px-3 py-0.5 rounded text-[10px] font-bold whitespace-nowrap
                    ${
                      badgeColor === "amber"
                        ? "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400"
                        : "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400"
                    }`}
                  >
                    {badge}
                  </span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>

      <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
        {navList.map(({ href, label, icon: Icon }) => {
          const isActive = active === href;
          return (
            <div key={href} className="relative group px-2 mb-0.5">
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-bar"
                  className="absolute left-0 top-0 bottom-0 w-0.5 bg-green-600 dark:bg-green-400 rounded-r-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Link
                href={href}
                className={[
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150 overflow-hidden",
                  isActive
                    ? "bg-green-50 dark:bg-zinc-800 text-green-600 dark:text-green-400 font-medium"
                    : "text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-50 hover:bg-gray-100 dark:hover:bg-zinc-800",
                ].join(" ")}
              >
                <Icon size={18} className="shrink-0" />
                <AnimatePresence initial={false}>
                  {!collapsed && (
                    <motion.span
                      key={`label-${href}`}
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm whitespace-nowrap overflow-hidden"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              {collapsed && (
                <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 rounded-md bg-gray-900 dark:bg-zinc-700 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  {label}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 dark:border-zinc-800 p-3 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="relative shrink-0">
            <Avatar
              initials={initials(user.full_name)}
              src={user.avatar_url}
              size="sm"
            />
          </div>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                key="user-info"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <p className="text-xs font-semibold text-gray-900 dark:text-zinc-50 truncate leading-tight">
                  {user.full_name}
                </p>
                <p className="text-xs text-gray-400 dark:text-zinc-500 truncate leading-tight">
                  {user.email}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <SignOut collapsed={collapsed} onLogout={logout} />

      <div className="border-t border-gray-200 dark:border-zinc-800 p-3 shrink-0">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center py-2 rounded-lg text-gray-400 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </motion.aside>
  );
}
