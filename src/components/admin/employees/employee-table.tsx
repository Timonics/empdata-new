"use client";

import { useClientPagination } from "@/hooks/useClientPagination";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MoreHorizontal,
  Eye,
  Mail,
  Building2,
  ShieldCheck,
  ShieldX,
  Clock,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EmployeeDrawer } from "./employee-drawer";
import { useAdminEmployees } from "@/hooks/queries/useEmployees";
import { formatDistanceToNow } from "date-fns";
import type { PortalEmployee } from "@/types/employee.types";

const ninStatusStyles = {
  verified: "bg-green-100 text-green-800 border-green-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  not_submitted: "bg-muted text-foreground border-border",
};

function getNINStatus(employee: PortalEmployee): keyof typeof ninStatusStyles {
  const v = employee.nin_verification;
  if (v?.is_nin_verified) return "verified";
  if (v?.has_submitted_nin) return "pending";
  return "not_submitted";
}

export function EmployeesTable({
  companyId,
}: {
  companyId?: number;
}) {
  // Pagination and filter state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchInput, setSearchInput] = useState("");

  // Selection state
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  // Drawer state
  const [drawerEmployee, setDrawerEmployee] = useState<PortalEmployee | null>(
    null,
  );
  const [drawerMode, setDrawerMode] = useState<"view" | "edit">("view");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, refetch, isFetching } = useAdminEmployees({
    page: currentPage,
    per_page: pageSize,
    search: searchInput || undefined,
    employment_status:
      statusFilter === "all" ? undefined : (statusFilter as "active" | "inactive"),
    company_id: companyId,
  });


  const employees = data?.data || [];
  const pagination = data?.pagination;

  // Client-side pager fallback when the API returns no pagination meta
  const client = useClientPagination(employees, pageSize, !pagination);

  const toggleAllRows = () => {
    if (selectedRows.length === employees.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(employees.map((e) => e.id));
    }
  };

  const toggleRow = (id: number) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedRows([]);
  };

  const handlePageSizeChange = (size: string) => {
    setPageSize(Number(size));
    setCurrentPage(1);
    setSelectedRows([]);
  };

  const columns = [
    {
      header: (
        <Checkbox
          checked={
            employees.length > 0 && selectedRows.length === employees.length
          }
          onCheckedChange={toggleAllRows}
        />
      ),
      cell: (item: PortalEmployee) => (
        <Checkbox
          checked={selectedRows.includes(item.id)}
          onCheckedChange={() => toggleRow(item.id)}
        />
      ),
      className: "w-12",
    },
    {
      header: "Employee",
      cell: (item: PortalEmployee) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border">
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {`${item.first_name?.[0] || ""}${item.last_name?.[0] || ""}`.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">
              {item.first_name} {item.last_name}
            </p>
            <p className="text-xs text-muted-foreground">
              {item.employee_number || "—"}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Company",
      cell: (item: PortalEmployee) => (
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-gray-400 shrink-0" />
          <span className="text-sm">{item.company_name || "—"}</span>
        </div>
      ),
    },
    {
      header: "Contact",
      cell: (item: PortalEmployee) => (
        <div>
          <p className="text-sm">{item.email}</p>
          <p className="text-xs text-muted-foreground">{item.phone || "—"}</p>
        </div>
      ),
    },
    {
      header: "NIN Status",
      cell: (item: PortalEmployee) => {
        const status = getNINStatus(item);
        const Icon =
          status === "verified"
            ? ShieldCheck
            : status === "pending"
              ? Clock
              : ShieldX;
        return (
          <Badge
            variant="outline"
            className={cn("font-medium", ninStatusStyles[status])}
          >
            <Icon className="mr-1 h-3 w-3" />
            {status === "not_submitted"
              ? "Not Submitted"
              : status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      header: "Department",
      cell: (item: PortalEmployee) => (
        <div>
          <p className="text-sm">{item.department || "—"}</p>
          <p className="text-xs text-muted-foreground">
            {item.position || ""}
          </p>
        </div>
      ),
    },
    {
      header: "Joined",
      cell: (item: PortalEmployee) => (
        <div>
          <span className="text-sm">
            {item.created_at
              ? new Date(item.created_at).toLocaleDateString()
              : "—"}
          </span>
          {item.created_at && (
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(item.created_at), {
                addSuffix: true,
              })}
            </p>
          )}
        </div>
      ),
    },
    {
      header: "",
      cell: (item: PortalEmployee) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setDrawerEmployee(item);
                setDrawerMode("view");
              }}
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setDrawerEmployee(item);
                setDrawerMode("edit");
              }}
            >
              <Mail className="mr-2 h-4 w-4" />
              Edit Employee
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      className: "w-12",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 / page</SelectItem>
              <SelectItem value="15">15 / page</SelectItem>
              <SelectItem value="25">25 / page</SelectItem>
              <SelectItem value="50">50 / page</SelectItem>
              <SelectItem value="100">100 / page</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
            title="Refresh"
          >
            <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} />
          </Button>
        </div>

        {selectedRows.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {selectedRows.length} selected
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedRows([])}
              className="h-8"
            >
              Clear
            </Button>
          </div>
        )}
      </div>

      <DataTable
        data={client.rows}
        columns={columns}
        isLoading={isLoading}
        onSearch={setSearchInput}
        searchPlaceholder="Search employees by name, email, or employee number..."
        pagination={
          pagination
            ? {
                currentPage: pagination.current_page,
                totalPages: pagination.last_page,
                totalItems: pagination.total,
                onPageChange: handlePageChange,
              }
            : client.pagination
        }
        emptyMessage="No employees found"
      />

      {drawerEmployee && (
        <EmployeeDrawer
          employee={drawerEmployee}
          open={!!drawerEmployee}
          onOpenChange={() => setDrawerEmployee(null)}
          mode={drawerMode}
          onModeChange={(mode) => setDrawerMode(mode)}
          onSave={async (data) => {
            console.log("Saving employee:", data);
          }}
        />
      )}
    </div>
  );
}
