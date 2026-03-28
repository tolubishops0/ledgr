"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar } from "./avatar";
import { Profile } from "@ledgr/types";
import { initials } from "@ledgr/utils";
import { NavItem } from "./use-active-href";
import { SignOut } from "./sign-out";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  navList: NavItem[];
  user: Profile;
  logo?: string;
  badge?: string;
  badgeColor?: string;
  active?: string;
  showUserBadge?: boolean;
  logout: () => void;
}

export function MobileDrawer({
  open,
  onClose,
  navList,
  user,
  logo = "Ledgr",
  badge,
  badgeColor = "amber",
  showUserBadge = false,
  active,
  logout,
}: MobileDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="lg:hidden fixed inset-0 z-40">
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="absolute left-0 top-0 bottom-0 w-64 bg-gray-50 dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 flex flex-col pb-4"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="flex items-center gap-2 h-16 px-5 border-b border-gray-200 dark:border-zinc-800">
              <span className="text-xl font-extrabold text-green-600 dark:text-green-400">
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

            <nav className="flex-1 py-3 px-2 overflow-y-auto">
              {navList.map(({ href, label, icon: Icon }) => {
                const isActive = active === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={onClose}
                    className={[
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-0.5 transition-colors",
                      isActive
                        ? "bg-green-50 dark:bg-zinc-800 text-green-600 dark:text-green-400 font-medium"
                        : "text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-50 hover:bg-gray-100 dark:hover:bg-zinc-800",
                    ].join(" ")}
                  >
                    <Icon size={18} />
                    {label}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-gray-200 dark:border-zinc-800 p-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar
                    initials={initials(user.full_name)}
                    src={user.avatar_url}
                    size="sm"
                  />
                  {showUserBadge && (
                    <span className="absolute -bottom-0.5 -right-0.5 px-1 py-px rounded text-[8px] font-bold bg-green-600 text-white leading-none">
                      A
                    </span>
                  )}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-gray-900 dark:text-zinc-50 truncate">
                    {user.full_name}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-zinc-500 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            <SignOut collapsed={false} onLogout={logout} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
