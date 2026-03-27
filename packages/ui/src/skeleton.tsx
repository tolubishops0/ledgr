"use client";

import * as React from "react";

type SkeletonVariant = "text" | "card" | "avatar" | "stat";

interface SkeletonProps {
  variant?: SkeletonVariant;
  className?: string;
}

const base = "animate-pulse bg-gray-200 dark:bg-zinc-800 rounded";

export function Skeleton({ variant = "text", className = "" }: SkeletonProps) {
  if (variant === "avatar") {
    return (
      <span
        className={[base, "rounded-full w-9 h-9 block", className].join(" ")}
      />
    );
  }

  if (variant === "card") {
    return (
      <div
        className={[
          "rounded-xl border border-gray-200 dark:border-zinc-800 p-5 space-y-3",
          className,
        ].join(" ")}
      >
        <span className={[base, "h-4 w-1/3 block"].join(" ")} />
        <span className={[base, "h-3 w-full block"].join(" ")} />
        <span className={[base, "h-3 w-4/5 block"].join(" ")} />
      </div>
    );
  }

  if (variant === "stat") {
    return (
      <div
        className={[
          "rounded-xl border border-gray-200 dark:border-zinc-800 p-5 space-y-2",
          className,
        ].join(" ")}
      >
        <span className={[base, "h-3 w-24 block"].join(" ")} />
        <span className={[base, "h-8 w-32 block"].join(" ")} />
        <span className={[base, "h-2.5 w-16 block"].join(" ")} />
      </div>
    );
  }

  // text (default)
  return <span className={[base, "h-4 w-full block", className].join(" ")} />;
}
