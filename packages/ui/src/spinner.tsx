"use client";

import * as React from "react";

type SpinnerSize = "sm" | "md" | "lg";

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: "w-3.5 h-3.5 border-[2px]",
  md: "w-5 h-5 border-2",
  lg: "w-7 h-7 border-[3px]",
};

export function Spinner({ size = "md", className = "" }: SpinnerProps) {
  return (
    <span
      className={[
        "inline-block rounded-full border-current border-r-transparent animate-spin",
        sizeClasses[size],
        className || "text-green-500",
      ].join(" ")}
      role="status"
      aria-label="Loading"
    />
  );
}
