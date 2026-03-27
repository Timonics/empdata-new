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
import { Download, Filter, Search, SlidersHorizontal, Upload } from "lucide-react";
import { ExportModal } from "@/components/export-modal";
import { ImportModal } from "@/components/import-modal";
import { toast } from "sonner";

interface EmployeesHeaderProps {
  onSearch?: (query: string) => void;
  onFilterChange?: (key: string, value: string) => void;
  filters?: {
    company_id?: string;
    status?: string;
    department?: string;
    employment_status?: string;
  };
  selectedRows?: number[];
  totalCount?: number;
  filteredCount?: number;
  companies?: { id: number; name: string }[];
  data?: any[];
}

export function EmployeesHeader({
  onSearch,
  onFilterChange,
  filters = {},
  selectedRows = [],
  totalCount = 0,
  filteredCount = 0,
  companies = [],
  data = [],
}: EmployeesHeaderProps) {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  // Export columns definition
  const exportColumns = [
    { key: "first_name", label: "First Name", default: true },
    { key: "last_name", label: "Last Name", default: true },
    { key: "employee_id", label: "Employee ID", default: true },
    { key: "email", label: "Email", default: true },
    { key: "phone", label: "Phone", default: true },
    { key: "company_name", label: "Company", default: true },
    { key: "department", label: "Department", default: true },
    { key: "position", label: "Position", default: true },
    { key: "status", label: "Status", default: true },
    { key: "nin_verification_status", label: "NIN Status", default: true },
    { key: "date_of_birth", label: "Date of Birth", default: false },
    { key: "gender", label: "Gender", default: false },
    { key: "address", label: "Address", default: false },
    { key: "city", label: "City", default: false },
    { key: "state", label: "State", default: false },
    { key: "country", label: "Country", default: false },
    { key: "bank_name", label: "Bank Name", default: false },
    { key: "bank_account_number", label: "Account Number", default: false },
    { key: "hire_date", label: "Hire Date", default: false },
    { key: "created_at", label: "Created At", default: false },
  ];

  // Import template columns for employee registrations
  const importTemplateColumns = [
    "first_name",
    "last_name",
    "email",
    "phone_number",
    "date_of_birth",
    "gender",
    "nationality",
    "country",
    "state",
    "city",
    "house_address",
    "identity_card_type",
    "identity_card_number",
    "bank_name",
    "bank_account_number",
  ];

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Employees</h2>
          <p className="text-muted-foreground">
            View and manage all employees across all companies
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => setShowImportModal(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowExportModal(true)}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
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
            defaultValue="all"
            value={filters.company_id || "all"}
            onValueChange={(value) => onFilterChange?.("company_id", value)}
          >
            <SelectTrigger className="w-40">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Company" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Companies</SelectItem>
              {companies.map((company) => (
                <SelectItem key={company.id} value={String(company.id)}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            defaultValue="all"
            value={filters.status || "all"}
            onValueChange={(value) => onFilterChange?.("status", value)}
          >
            <SelectTrigger className="w-35">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="terminated">Terminated</SelectItem>
            </SelectContent>
          </Select>

          <Select
            defaultValue="all"
            value={filters.department || "all"}
            onValueChange={(value) => onFilterChange?.("department", value)}
          >
            <SelectTrigger className="w-35">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="hr">Human Resources</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="operations">Operations</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Export Modal */}
      <ExportModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        entity="employee-registrations"
        title="Export Employees"
        description="Export your employees data in various formats"
        filters={filters}
        selectedIds={selectedRows}
        totalCount={totalCount}
        filteredCount={filteredCount}
        columns={exportColumns}
        formats={["csv", "excel"]}
        showDateRange={true}
        showColumnSelection={true}
        additionalParams={{
          company_id: filters.company_id !== "all" ? filters.company_id : undefined,
          employment_status: filters.status !== "all" ? filters.status : undefined,
        }}
        onSuccess={() => {
          console.log("Employees export completed");
          toast.success("Export completed successfully");
        }}
      />

      {/* Import Modal */}
      <ImportModal
        open={showImportModal}
        onOpenChange={setShowImportModal}
        entity="employee-registrations"
        title="Import Employees"
        description="Upload a CSV or Excel file to import employees"
        templateColumns={importTemplateColumns}
        templateData={[
          {
            first_name: "John",
            last_name: "Doe",
            email: "john.doe@example.com",
            phone_number: "08012345678",
            date_of_birth: "1990-01-15",
            gender: "Male",
            nationality: "Nigerian",
            country: "Nigeria",
            state: "Lagos",
            city: "Ikeja",
            house_address: "123 Main Street",
            identity_card_type: "National Identity Number",
            identity_card_number: "12345678901",
            bank_name: "GTBank",
            bank_account_number: "0123456789",
          },
          {
            first_name: "Jane",
            last_name: "Smith",
            email: "jane.smith@example.com",
            phone_number: "08087654321",
            date_of_birth: "1988-05-20",
            gender: "Female",
            nationality: "Nigerian",
            country: "Nigeria",
            state: "Abuja FCT",
            city: "Garki",
            house_address: "456 Garden Avenue",
            identity_card_type: "National Identity Number",
            identity_card_number: "98765432109",
            bank_name: "Access Bank",
            bank_account_number: "9876543210",
          },
        ]}
        onSuccess={() => {
          console.log("Employees import completed");
          toast.success("Import completed successfully");
          // Refresh the page or refetch data
          window.location.reload();
        }}
      />
    </>
  );
}