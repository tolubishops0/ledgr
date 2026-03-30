"use client";

import { useEffect } from "react";
import { Button } from "@ledgr/ui";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] px-4 text-center">
      <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
        <AlertTriangle size={20} className="text-red-500 dark:text-red-400" />
      </div>

      <h2 className="text-base font-semibold text-gray-900 dark:text-zinc-50 mb-1">
        Something went wrong
      </h2>

      <p className="text-sm text-gray-500 dark:text-zinc-400 max-w-xs mb-6">
        {error.message?.includes("authenticated")
          ? "Your session may have expired. Please refresh the page."
          : "We couldn't load your data. This might be a temporary issue."}
      </p>

      <Button variant="outline" size="sm" onClick={reset} className="gap-2">
        <RefreshCw size={14} />
        Try again
      </Button>
    </div>
  );
}
