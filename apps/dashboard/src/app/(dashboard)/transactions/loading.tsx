import { Skeleton } from "@ledgr/ui";
import React from "react";

export default function TransactionsSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-4 max-w-4xl mx-auto">
      <Skeleton variant="text" className="h-8 w-48" />
      <Skeleton variant="card" className="h-20 my-8" />
      <Skeleton variant="card" className="h-54" />
    </div>
  );
}
