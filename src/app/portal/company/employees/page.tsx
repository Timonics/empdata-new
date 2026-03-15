"use client";

import { useState } from "react";
import { CompanyEmployeesHeader } from "@/components/company/employees/company-employees-header";
import { CompanyEmployeesTable } from "@/components/company/employees/company-employees-table";
import { CompanyEmployeesStats } from "@/components/company/employees/company-employees-stats";

export default function CompanyEmployeesPage() {
  const [filters, setFilters] = useState({
    employment_status: "all",
    nin_verified: "all",
    search: "",
  });

  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [filteredCount, setFilteredCount] = useState(0);

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, search: query }));
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <CompanyEmployeesHeader 
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        filters={filters}
        selectedRows={selectedRows}
        totalCount={totalCount}
        filteredCount={filteredCount}
      />
      <CompanyEmployeesStats />
      <CompanyEmployeesTable 
        onSelectionChange={setSelectedRows}
        onCountsChange={(total, filtered) => {
          setTotalCount(total);
          setFilteredCount(filtered);
        }}
        filters={filters}
      />
    </div>
  );
}