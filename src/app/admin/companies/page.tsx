"use client";

import { useState, useCallback } from "react";
import { CompaniesHeader } from "@/components/admin/companies/companies-header";
import { CompaniesStats } from "@/components/admin/companies/companies-stats";
import { CompaniesTable } from "@/components/admin/companies/companies-table";

export default function CompaniesPage() {
  const [filters, setFilters] = useState({
    status: undefined as string | undefined,
    insurance_type: undefined as string | undefined,
    search: "",
  });

  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [filteredCount, setFilteredCount] = useState(0);

  const handleSearch = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, search: query }));
  }, []);

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "all" ? undefined : value,
    }));
  }, []);

  // Stable identities so child effects don't loop
  const updateSelection = useCallback((rows: number[]) => {
    setSelectedRows(rows);
  }, []);

  const updateCounts = useCallback((total: number, filtered: number) => {
    setTotalCount((prev) => (prev === total ? prev : total));
    setFilteredCount((prev) => (prev === filtered ? prev : filtered));
  }, []);

  return (
    <div className="space-y-6">
      <CompaniesHeader 
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        filters={filters}
        selectedRows={selectedRows}
        totalCount={totalCount}
        filteredCount={filteredCount}
      />
      <CompaniesStats />
      <CompaniesTable 
        onSelectionChange={updateSelection}
        onCountsChange={updateCounts}
        filters={filters}
      />
    </div>
  );
}