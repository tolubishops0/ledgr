"use client";

import * as React from "react";
import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number; // 0–100
  className?: string;
}

function getColor(value: number) {
  if (value >= 90) return "bg-red-500";
  if (value >= 75) return "bg-amber-500";
  return "bg-green-500";
}

export function ProgressBar({ value, className = "" }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const color = getColor(clamped);

  return (
    <div className={["flex items-center gap-3", className].join(" ")}>
      <div className="flex-1 h-2 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          className={["h-full rounded-full", color].join(" ")}
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
      <span className="text-xs font-medium text-gray-500 dark:text-zinc-400 w-8 text-right">
        {clamped}%
      </span>
    </div>
  );
}
