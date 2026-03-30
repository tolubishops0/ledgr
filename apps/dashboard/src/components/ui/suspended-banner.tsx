import React from "react";

export default function SuspendedBanner() {
  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 px-4 py-2.5 text-center">
      <p className="text-xs text-amber-700 dark:text-amber-400">
        Your account has been suspended. You can view your data but cannot make
        changes. Contact support for help.
      </p>
    </div>
  );
}
