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

export function EmployeesHeader() {
  const [showExportModal, setShowExportModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
          <Button variant="outline" size="sm">
            <Upload
              className="mr-2 h-4 w-4"
              onClick={() => setShowExportModal(true)}
            />
            Import
          </Button>
          <Button size="sm">
            <Download
              className="mr-2 h-4 w-4"
              onClick={() => setShowExportModal(true)}
            />
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
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Company" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Companies</SelectItem>
              <SelectItem value="techcorp">TechCorp Solutions</SelectItem>
              <SelectItem value="global">Global Industries</SelectItem>
              <SelectItem value="afrihealth">AfriHealth</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all">
            <SelectTrigger className="w-35">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all">
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
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* <ExportModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        entityName="employees"
        totalCount={2345}
        // selectedCount={selectedRows.length}
        // filteredCount={filteredEmployees.length}
        columns={[
          { key: "name", label: "Employee Name", default: true },
          { key: "employeeId", label: "Employee ID", default: true },
          { key: "email", label: "Email", default: true },
          { key: "phone", label: "Phone", default: true },
          { key: "department", label: "Department", default: true },
          { key: "position", label: "Position", default: true },
          { key: "status", label: "Status", default: true },
          { key: "ninStatus", label: "NIN Status", default: true },
          { key: "dateJoined", label: "Date Joined", default: true },
          { key: "beneficiaries", label: "Beneficiaries", default: false },
          { key: "dateOfBirth", label: "Date of Birth", default: false },
          { key: "gender", label: "Gender", default: false },
          { key: "address", label: "Address", default: false },
        ]}
        onExport={async (options) => {
          // Implement your export logic
        }}
      /> */}
    </>
  );
}
