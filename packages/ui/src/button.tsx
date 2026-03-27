"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Spinner } from "./spinner";

type ButtonVariant = "default" | "outline" | "ghost" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  default:
    "bg-green-600 hover:bg-green-700 text-white border-transparent focus:ring-green-500",
  outline:
    "bg-transparent border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-zinc-50 hover:bg-gray-50 dark:hover:bg-zinc-800 focus:ring-green-500",
  ghost:
    "bg-transparent border-transparent text-gray-900 dark:text-zinc-50 hover:bg-gray-100 dark:hover:bg-zinc-800 focus:ring-green-500",
  destructive:
    "bg-red-600 hover:bg-red-700 text-white border-transparent focus:ring-red-500",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "text-xs px-3 py-1.5 rounded-md gap-1.5",
  md: "text-sm px-4 py-2 rounded-lg gap-2",
  lg: "text-base px-5 py-2.5 rounded-lg gap-2",
};

export function Button({
  variant = "default",
  size = "md",
  loading = false,
  disabled,
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={[
        "inline-flex items-center justify-center font-medium border transition-colors duration-150",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(" ")}
      {...props}
    >
      <AnimatePresence mode="wait" initial={false}>
        {loading ? (
          <motion.span
            key="loading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2"
          >
            <Spinner
              size={size === "lg" ? "md" : "sm"}
              className="text-current"
            />
            <span>Loading...</span>
          </motion.span>
        ) : (
          <motion.span
            key="content"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2"
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
