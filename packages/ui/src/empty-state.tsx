"use client";

import * as React from "react";
import { Button } from "./button";

interface EmptyStateProps {
  heading: string;
  subtext: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  heading,
  subtext,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={[
        "flex flex-col items-center justify-center text-center py-16 px-6",
        className,
      ].join(" ")}
    >
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        className="mb-5 text-gray-200 dark:text-zinc-700"
        aria-hidden="true"
      >
        <rect
          x="10"
          y="20"
          width="60"
          height="45"
          rx="6"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <path
          d="M25 20V15a15 15 0 0130 0v5"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="40" cy="42" r="7" stroke="currentColor" strokeWidth="2.5" />
        <path
          d="M40 49v6"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      <h3 className="text-base font-semibold text-gray-900 dark:text-zinc-50">
        {heading}
      </h3>
      <p className="mt-1.5 text-sm text-gray-500 dark:text-zinc-400 max-w-xs">
        {subtext}
      </p>
      {action && (
        <div className="mt-5">
          <Button onClick={action.onClick}>{action.label}</Button>
        </div>
      )}
    </div>
  );
}
