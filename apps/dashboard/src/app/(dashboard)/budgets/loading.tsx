import { Skeleton } from "@ledgr/ui";
import React from "react";

export default function BudgetsSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-4 max-w-5xl mx-auto">
      <Skeleton variant="text" className="h-8 w-40" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} variant="stat" className="h-44" />
        ))}
      </div>
    </div>
  );
}
