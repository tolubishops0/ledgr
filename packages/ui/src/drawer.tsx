"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Drawer({ isOpen, onClose, title, children }: DrawerProps) {
  React.useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Desktop: slide from right */}
          <motion.div
            className={[
              "absolute right-0 top-0 h-full w-full max-w-sm",
              "bg-white dark:bg-zinc-900 border-l border-gray-200 dark:border-zinc-800",
              "shadow-xl flex flex-col",
              "hidden sm:flex",
            ].join(" ")}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <DrawerInner title={title} onClose={onClose}>
              {children}
            </DrawerInner>
          </motion.div>

          {/* Mobile: slide from bottom */}
          <motion.div
            className={[
              "absolute bottom-0 left-0 right-0 max-h-[85vh]",
              "bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800",
              "rounded-t-2xl shadow-xl flex flex-col",
              "sm:hidden",
            ].join(" ")}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <DrawerInner title={title} onClose={onClose}>
              {children}
            </DrawerInner>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function DrawerInner({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-zinc-800 shrink-0">
        <h2 className="text-base font-semibold text-gray-900 dark:text-zinc-50">
          {title}
        </h2>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-gray-400 dark:text-zinc-500 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
    </>
  );
}
