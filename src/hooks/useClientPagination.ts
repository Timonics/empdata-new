"use client";

import { useState, useMemo } from "react";

interface ClientPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

/**
 * Client-side pagination fallback for tables whose API does not
 * return pagination meta. Pass `enabled=false` when the server
 * paginates — the hook then returns all rows and no pagination.
 */
export function useClientPagination<T>(
  items: T[],
  pageSize = 15,
  enabled = true,
): { rows: T[]; pagination: ClientPagination | undefined } {
  const [page, setPage] = useState(1);

  return useMemo(() => {
    if (!enabled) {
      return { rows: items, pagination: undefined };
    }

    const totalItems = items.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const currentPage = Math.min(page, totalPages);
    const rows = items.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return {
      rows,
      pagination: {
        currentPage,
        totalPages,
        totalItems,
        onPageChange: setPage,
      },
    };
  }, [items, page, pageSize, enabled]);
}
