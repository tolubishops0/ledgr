"use client";

import * as React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={[
        "bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800",
        "rounded-xl shadow-sm",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={[
        "px-5 pt-5 pb-3 flex items-center justify-between",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={[
        "px-5 py-3 max-h-100 overflow-auto scroll scrollbar-hide",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardFooter({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={[
        "px-5 pt-3 pb-5 border-t border-gray-200 dark:border-zinc-800 flex items-center gap-3",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
