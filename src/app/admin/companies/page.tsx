"use client";

import { useState } from "react";
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

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, search: query }));
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value === "all" ? undefined : value }));
  };

  // These will be updated by the table component
  const updateSelection = (rows: number[]) => {
    setSelectedRows(rows);
  };

  const updateCounts = (total: number, filtered: number) => {
    setTotalCount(total);
    setFilteredCount(filtered);
  };

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