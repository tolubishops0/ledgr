"use client";

import { Bell, Check, CheckCheck, X } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SupabaseClient } from "@supabase/supabase-js";
import { useNotifications } from "./hook/use-notifications";

export interface NotificationProps {
  userId: string;
  supabase: SupabaseClient;
}

const typeConfig: Record<string, { icon: string; color: string }> = {
  transaction: { icon: "💳", color: "text-blue-500" },
  budget: { icon: "🎯", color: "text-purple-500" },
  "user-status": { icon: "👤", color: "text-amber-500" },
};

export function NotificationDropdown({ userId, supabase }: NotificationProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications({ userId, supabase });

  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="cursor-pointer relative p-2 rounded-lg text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-green-500" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-lg z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-zinc-800">
              <span className="text-sm font-semibold text-gray-900 dark:text-zinc-50">
                Notifications
              </span>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 hover:underline"
                  >
                    <CheckCheck size={12} />
                    Mark all read
                  </button>
                )}

                <button
                  onClick={() => setOpen(false)}
                  className="cursor-pointer p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                  <Bell className="text-gray-300 dark:text-zinc-600 mb-2" />
                  <p className="text-sm text-gray-500 dark:text-zinc-400">
                    No notifications yet
                  </p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={[
                      "flex items-start gap-3 px-4 py-3 border-b border-gray-50 dark:border-zinc-800/50 last:border-0 transition-colors",
                      !n.read ? "bg-green-50/50 dark:bg-green-900/10" : "",
                    ].join(" ")}
                  >
                    <span
                      className={`text-lg mt-0.5 ${
                        typeConfig[n.type]?.color ?? "text-gray-400"
                      }`}
                    >
                      {typeConfig[n.type]?.icon ?? "🔔"}
                    </span>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-700 dark:text-zinc-300">
                        {n.message}
                      </p>
                      <p className="text-[10px] text-gray-400 dark:text-zinc-500 mt-0.5">
                        {new Date(n.created_at).toLocaleString()}
                      </p>
                    </div>

                    {!n.read && (
                      <button
                        onClick={() => markAsRead(n.id)}
                        className="cursor-pointer p-1 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"
                      >
                        <Check size={12} />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
