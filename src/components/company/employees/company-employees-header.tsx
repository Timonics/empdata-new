"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  Filter,
  Search,
  SlidersHorizontal,
  UserPlus,
} from "lucide-react";
import { AddEmployeeDrawer } from "./add-employee-drawer";
import { ExportModal } from "@/components/export-modal";
import { useExportEmployees } from "@/hooks/queries/useEmployees";

interface CompanyEmployeesHeaderProps {
  onSearch?: (query: string) => void;
  onFilterChange?: (key: string, value: string) => void;
  filters?: {
    employment_status?: string;
    nin_verified?: string;
    department?: string;
  };
  selectedRows?: number[];
  totalCount?: number;
  filteredCount?: number;
}

export function CompanyEmployeesHeader({ 
  onSearch, 
  onFilterChange,
  filters = {},
  selectedRows = [],
  totalCount = 0,
  filteredCount = 0,
}: CompanyEmployeesHeaderProps) {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const exportMutation = useExportEmployees();

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  // Export columns definition
  const exportColumns = [
    { key: "first_name", label: "First Name", default: true },
    { key: "last_name", label: "Last Name", default: true },
    { key: "email", label: "Email", default: true },
    { key: "phone", label: "Phone", default: true },
    { key: "employee_number", label: "Employee ID", default: true },
    { key: "department", label: "Department", default: true },
    { key: "position", label: "Position", default: true },
    { key: "employment_status", label: "Status", default: true },
    { key: "nin_verified", label: "NIN Verified", default: true },
    { key: "date_of_birth", label: "Date of Birth", default: false },
    { key: "created_at", label: "Date Joined", default: true },
    { key: "beneficiaries_count", label: "Beneficiaries", default: false },
  ];

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Employees</h2>
          <p className="text-muted-foreground">
            Manage your company's employees and their information
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* <Button variant="outline" size="sm" onClick={() => setShowExportModal(true)}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button> */}
          <Button size="sm" onClick={() => setShowAddDrawer(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Employee
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search employees by name, email, or employee ID..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Select 
            value={filters.employment_status || "all"}
            onValueChange={(value) => onFilterChange?.("employment_status", value)}
          >
            <SelectTrigger className="w-35">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={filters.nin_verified || "all"}
            onValueChange={(value) => onFilterChange?.("nin_verified", value)}
          >
            <SelectTrigger className="w-35">
              <SelectValue placeholder="NIN Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="true">Verified</SelectItem>
              <SelectItem value="false">Not Verified</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <AddEmployeeDrawer open={showAddDrawer} onOpenChange={setShowAddDrawer} />
      
      <ExportModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        entity="employees"
        title="Export Employees"
        description="Export your employees data in various formats"
        filters={filters}
        selectedIds={selectedRows}
        totalCount={totalCount}
        filteredCount={filteredCount}
        columns={exportColumns}
        formats={['csv', 'excel']}
        showDateRange={true}
        showColumnSelection={true}
        // onExport={async (options) => {
        //   await exportMutation.mutateAsync(options.filters);
        // }}
      />
    </>
  );
}