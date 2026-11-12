"use client";

import { Skeleton } from "@/components/ui/skeleton";

/**
 * Full-body loading state for detail drawers.
 * Rendered while the full record is being fetched so partial
 * or undefined data never flashes on screen.
 */
export function DrawerLoading() {
  return (
    <div className="p-8 space-y-6" aria-label="Loading details">
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-muted/60 p-4 rounded-lg">
            <Skeleton className="h-6 w-6 mx-auto mb-2" />
            <Skeleton className="h-7 w-12 mx-auto mb-1" />
            <Skeleton className="h-3 w-16 mx-auto" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-6">
        {[1, 2].map((col) => (
          <div key={col} className="bg-muted/60 rounded-lg p-5 space-y-3">
            <Skeleton className="h-4 w-32 mb-4" />
            {[1, 2, 3, 4, 5].map((row) => (
              <div key={row} className="flex items-start gap-3 py-2">
                <Skeleton className="h-4 w-4 mt-0.5" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
