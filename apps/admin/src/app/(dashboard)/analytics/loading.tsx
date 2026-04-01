import { Skeleton } from "@ledgr/ui";
import React from "react";

function AnalyticsSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="p-6 rounded-xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 h-75"
          >
            <div className="flex items-end gap-3 h-full pt-10">
              <Skeleton className="h-[40%] flex-1 bg-gray-100 dark:bg-zinc-900 rounded-t" />
              <Skeleton className="h-[70%] flex-1 bg-gray-100 dark:bg-zinc-900/50 rounded-t" />
              <Skeleton className="h-[50%] flex-1 bg-gray-100 dark:bg-zinc-900 rounded-t" />
              <Skeleton className="h-[90%] flex-1 bg-gray-100 dark:bg-zinc-900/50 rounded-t" />
              <Skeleton className="h-[60%] flex-1 bg-gray-100 dark:bg-zinc-900 rounded-t" />
            </div>
          </div>
        ))}

        <div className="p-6 rounded-xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 h-75 flex items-center justify-center gap-8">
          <div className="h-60 w-60">
            {" "}
            <Skeleton className="h-full w-full rounded-full border-8 border-gray-100 dark:border-zinc-900 bg-transparent shrink-0" />
          </div>
          <div className="flex-1 space-y-3 w-1/2">
            <Skeleton className="h-3 w-full bg-gray-100 dark:bg-zinc-900" />
            <Skeleton className="h-3 w-full bg-gray-100 dark:bg-zinc-900" />
            <Skeleton className="h-3 w-full bg-gray-100 dark:bg-zinc-900" />
          </div>
        </div>

        {/* Slot 4: Top Categories / Progress Bar List Skeleton */}
        <div className="p-6 rounded-xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 h-75 space-y-6">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-24 bg-gray-100 dark:bg-zinc-900" />
                <Skeleton className="h-3 w-12 bg-gray-100 dark:bg-zinc-900" />
              </div>
              <Skeleton className="h-2 w-full rounded-full bg-gray-100 dark:bg-zinc-800" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AnalyticsSkeleton;
