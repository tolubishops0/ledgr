"use client";

import * as React from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Card, CardContent } from "./card";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { useEffect } from "react";

interface StatCardProps {
  icon?: React.ReactNode;
  label: string;
  value: string;
  className?: string;
  change?: number;
  isUp?: boolean;
  isDown?: boolean;
  percent?: number;
  isNew?: boolean;
}

function AnimatedNumber({ value }: { value: string }) {
  const numeric = parseFloat(value.replace(/[^0-9.]/g, ""));
  const prefix = value.match(/^[^0-9]*/)?.[0] ?? "";
  const suffix = value.match(/[^0-9.]*$/)?.[0] ?? "";
  const isNumeric = !isNaN(numeric);

  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => {
    const formatted = Number.isInteger(numeric)
      ? Math.round(v).toLocaleString()
      : v.toFixed(2);
    return `${prefix}${formatted}${suffix}`;
  });

  useEffect(() => {
    if (!isNumeric) return;
    const controls = animate(count, numeric, { duration: 1, ease: "easeOut" });
    return controls.stop;
  }, [numeric]);

  if (!isNumeric) return <span>{value}</span>;
  return <motion.span>{rounded}</motion.span>;
}

export function StatCard({
  icon,
  label,
  value,
  isDown,
  isUp,
  percent,
  isNew,
  className = "",
}: StatCardProps) {
  const trendColor = isUp
    ? "text-green-600 dark:text-green-400"
    : isDown
      ? "text-red-500 dark:text-red-400"
      : "text-gray-400";
  return (
    <Card className={className}>
      <CardContent className="py-5 min-h-30">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-500 dark:text-zinc-400 truncate">
              {label}
            </p>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-zinc-50 tracking-tight">
              <AnimatedNumber value={value} />
            </p>
            {percent !== undefined && (
              <p
                className={[
                  "mt-1 text-xs font-medium flex items-center gap-1",
                  trendColor,
                ].join(" ")}
              >
                {!isNew && (
                  <>
                    {isUp && <ArrowUp size={14} />}
                    {isDown && <ArrowDown size={14} />}
                    {!isUp && !isDown && <Minus size={14} />}
                  </>
                )}

                {isNew ? "" : `${Math.abs(percent).toFixed(1)}%`}
              </p>
            )}
          </div>
          {icon && (
            <div className="shrink-0 p-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
