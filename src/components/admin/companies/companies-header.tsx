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
  Plus,
  Search,
  SlidersHorizontal,
  Upload,
} from "lucide-react";
import { ExportModal } from "@/components/export-modal";
import { ImportModal } from "@/components/import-modal";
import { toast } from "sonner";
// import { AddCompanyModal } from "./add-company-modal"

interface CompaniesHeaderProps {
  onSearch?: (query: string) => void;
  onFilterChange?: (key: string, value: string) => void;
  filters?: {
    status?: string;
    insurance_type?: string;
  };
  selectedRows?: number[];
  totalCount?: number;
  filteredCount?: number;
  data?: any[]; // For frontend export if needed
}

export function CompaniesHeader({
  onSearch,
  onFilterChange,
  filters = {},
  selectedRows = [],
  totalCount = 0,
  filteredCount = 0,
  data = [],
}: CompaniesHeaderProps) {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  // Export columns definition (for column selection in modal)
  const exportColumns = [
    { key: "name", label: "Company Name", default: true },
    { key: "rc_number", label: "RC Number", default: true },
    { key: "email", label: "Email", default: true },
    { key: "phone", label: "Phone", default: true },
    { key: "status", label: "Status", default: true },
    { key: "employees_count", label: "Employees", default: true },
    { key: "policies_count", label: "Policies", default: true },
    { key: "insurance_type", label: "Insurance Type", default: true },
    { key: "joined_date", label: "Joined Date", default: false },
    { key: "admin_name", label: "Admin Name", default: false },
    { key: "admin_email", label: "Admin Email", default: false },
    { key: "admin_phone", label: "Admin Phone", default: false },
    { key: "address", label: "Address", default: false },
    { key: "city", label: "City", default: false },
    { key: "state", label: "State", default: false },
    { key: "country", label: "Country", default: false },
    { key: "website", label: "Website", default: false },
    { key: "tax_id", label: "Tax ID", default: false },
    { key: "created_at", label: "Created At", default: false },
  ];

  // Import template columns
  const importTemplateColumns = [
    "name",
    "rc_number",
    "email",
    "phone",
    "address",
    "city",
    "state",
    "country",
    "insurance_type",
    "website",
    "tax_id",
  ];

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Companies</h2>
          <p className="text-muted-foreground">
            Manage and view all corporate clients and their details
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
            placeholder="Search companies by name, email, or RC number..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Select
            defaultValue="all"
            value={filters.status || "all"}
            onValueChange={(value) => onFilterChange?.("status", value)}
          >
            <SelectTrigger className="w-45">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>

          <Select
            defaultValue="all"
            value={filters.insurance_type || "all"}
            onValueChange={(value) => onFilterChange?.("insurance_type", value)}
          >
            <SelectTrigger className="w-45">
              <SelectValue placeholder="Insurance Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="group-life">Group Life</SelectItem>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="pension">Pension</SelectItem>
              <SelectItem value="corporate">Corporate</SelectItem>
              <SelectItem value="individual">Individual</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Export Modal - Using correct entity type */}
      <ExportModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        entity="company-registrations"
        title="Export Companies"
        description="Export your companies data in various formats"
        filters={filters}
        selectedIds={selectedRows}
        totalCount={totalCount}
        filteredCount={filteredCount}
        columns={exportColumns}
        formats={["csv", "excel"]}
        showDateRange={true}
        showColumnSelection={true}
        onSuccess={() => {
          console.log("Companies export completed");
          toast.success("Export completed successfully");
        }}
      />

      {/* Import Modal */}
      <ImportModal
        open={showImportModal}
        onOpenChange={setShowImportModal}
        entity="company-registrations"
        title="Import Companies"
        description="Upload a CSV or Excel file to import companies"
        templateColumns={importTemplateColumns}
        templateData={[
          {
            name: "Example Company Ltd",
            rc_number: "RC123456",
            email: "info@example.com",
            phone: "08012345678",
            address: "123 Business Avenue",
            city: "Lagos",
            state: "Lagos",
            country: "Nigeria",
            insurance_type: "group-life",
            website: "www.example.com",
            tax_id: "TAX123456",
          }
        ]}
        onSuccess={() => {
          console.log("Companies import completed");
          toast.success("Import completed successfully");
          // Refresh the page or refetch data
          window.location.reload();
        }}
      />
    </>
  );
}