"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  Edit,
  Trash2,
  Mail,
  Phone,
  Shield,
  ShieldCheck,
  ShieldX,
  Clock,
  UserCog,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EmployeeDetailsDrawer } from "./employee-details-drawer";
import { EditEmployeeDrawer } from "./edit-employee-drawer";
import { DeleteEmployeeModal } from "./delete-employee-modal";
import { useEmployees, useDeleteEmployee } from "@/hooks/queries/useEmployees";
import { format } from "date-fns";
import { EmploymentStatus } from "@/types/employee.types";

const statusStyles = {
  active: "bg-green-100 text-green-800 border-green-200",
  inactive: "bg-gray-100 text-gray-800 border-gray-200",
};

const ninStatusIcons = {
  verified: ShieldCheck,
  pending: Clock,
  not_submitted: ShieldX,
};

interface CompanyEmployeesTableProps {
  onSelectionChange?: (selectedIds: number[]) => void;
  onCountsChange?: (total: number, filtered: number) => void;
  filters?: {
    employment_status?: string;
    nin_verified?: string;
    search?: string;
  };
}

export function CompanyEmployeesTable({
  onSelectionChange,
  onCountsChange,
  filters: externalFilters = {},
}: CompanyEmployeesTableProps) {
  // Pagination and filter state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [detailsEmployee, setDetailsEmployee] = useState<any | null>(null);
  const [editEmployee, setEditEmployee] = useState<any | null>(null);
  const [deleteEmployee, setDeleteEmployee] = useState<any | null>(null);

  // Memoize internal filters
  const internalFilters = {
    employment_status:
      externalFilters.employment_status !== "all"
        ? (externalFilters.employment_status as EmploymentStatus)
        : undefined,
    nin_verified:
      externalFilters.nin_verified !== "all"
        ? externalFilters.nin_verified === "true"
        : undefined,
    search: externalFilters.search || "",
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [externalFilters]);

  // Fetch data
  const { data, isLoading, refetch, isFetching } = useEmployees({
    ...internalFilters,
    page: currentPage,
    per_page: pageSize,
  });

  const deleteMutation = useDeleteEmployee();

  const employees = data?.data || [];
  const pagination = data?.pagination;

  // Notify parent of counts
  useEffect(() => {
    if (pagination) {
      onCountsChange?.(pagination.total, employees.length);
    }
  }, [pagination, employees.length, onCountsChange]);

  // Notify parent of selection changes
  useEffect(() => {
    onSelectionChange?.(selectedRows);
  }, [selectedRows, onSelectionChange]);

  const toggleAllRows = () => {
    if (selectedRows.length === employees.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(employees.map((e: any) => e.id));
    }
  };

  const toggleRow = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  const handleView = (employee: any) => {
    setDetailsEmployee(employee);
  };

  const handleEdit = (employee: any) => {
    setEditEmployee(employee);
  };

  const handleDelete = (employee: any) => {
    setDeleteEmployee(employee);
  };

  const handleConfirmDelete = () => {
    if (!deleteEmployee) return;

    deleteMutation.mutate(deleteEmployee.id, {
      onSuccess: () => {
        setDeleteEmployee(null);
        setSelectedRows((prev) =>
          prev.filter((id) => id !== deleteEmployee.id),
        );
      },
    });
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

  const getNINStatusIcon = (employee: any) => {
    if (employee.nin_verification?.is_nin_verified) return ShieldCheck;
    if (employee.nin_verification?.has_submitted_nin) return Clock;
    return ShieldX;
  };

  const getNINStatusColor = (employee: any) => {
    if (employee.nin_verification?.is_nin_verified) return "text-green-600";
    if (employee.nin_verification?.has_submitted_nin) return "text-yellow-600";
    return "text-red-600";
  };

  const getNINStatusText = (employee: any) => {
    if (employee.nin_verification?.is_nin_verified) return "Verified";
    if (employee.nin_verification?.has_submitted_nin) return "Pending";
    return "Not Submitted";
  };

  const columns = [
    {
      header: (
        <input
          type="checkbox"
          className="rounded border-gray-300"
          checked={
            employees.length > 0 && selectedRows.length === employees.length
          }
          onChange={toggleAllRows}
        />
      ),
      cell: (item: any) => (
        <input
          type="checkbox"
          className="rounded border-gray-300"
          checked={selectedRows.includes(item.id)}
          onChange={() => toggleRow(item.id)}
        />
      ),
      className: "w-12",
    },
    {
      header: "Employee",
      sortable: true,
      cell: (item: any) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border">
            <AvatarFallback className="bg-emerald-100 text-emerald-600">
              {item.first_name?.[0]}
              {item.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">
              {item.first_name} {item.last_name}
            </p>
            <p className="text-xs text-muted-foreground">
              {item.employee_number}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Contact",
      cell: (item: any) => (
        <div>
          <p className="text-sm">{item.email}</p>
          <p className="text-xs text-muted-foreground">{item.phone || "N/A"}</p>
        </div>
      ),
    },
    {
      header: "Department",
      cell: (item: any) => (
        <span className="text-sm">{item.department || "N/A"}</span>
      ),
    },
    {
      header: "Position",
      cell: (item: any) => (
        <span className="text-sm">{item.position || "N/A"}</span>
      ),
    },
    {
      header: "Status",
      sortable: true,
      cell: (item: any) => (
        <Badge
          variant="outline"
          className={cn(
            "font-medium",
            statusStyles[item.employment_status as keyof typeof statusStyles] ||
              "bg-gray-100",
          )}
        >
          {item.employment_status}
        </Badge>
      ),
    },
    {
      header: "NIN",
      cell: (item: any) => {
        const Icon = getNINStatusIcon(item);
        return (
          <div className="flex items-center gap-2">
            <Icon className={cn("h-4 w-4", getNINStatusColor(item))} />
            <span className="text-sm">{getNINStatusText(item)}</span>
          </div>
        );
      },
    },
    {
      header: "Joined",
      sortable: true,
      cell: (item: any) => (
        <span className="text-sm text-muted-foreground">
          {item.created_at
            ? format(new Date(item.created_at), "MMM d, yyyy")
            : "N/A"}
        </span>
      ),
    },
    {
      header: "Beneficiaries",
      cell: (item: any) => (
        <span className="font-medium text-center block">
          {item.beneficiaries_count || 0}
        </span>
      ),
      className: "text-center",
    },
    {
      header: "Actions",
      cell: (item: any) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleView(item)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
            <Edit className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Phone className="mr-2 h-4 w-4" />
                Call
              </DropdownMenuItem>
              <DropdownMenuItem>
                <UserCog className="mr-2 h-4 w-4" />
                Manage Access
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDelete(item)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      className: "w-32",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Select
            value={pageSize.toString()}
            onValueChange={handlePageSizeChange}
          >
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

          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
            title="Refresh"
          >
            <RefreshCw
              className={cn("h-4 w-4", isFetching && "animate-spin")}
            />
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

      {/* Data Table */}
      <div className="rounded-md border bg-white">
        <DataTable
          data={employees}
          columns={columns}
          isLoading={isLoading}
          pagination={
            pagination
              ? {
                  currentPage: pagination.current_page,
                  totalPages: pagination.last_page,
                  totalItems: pagination.total,
                  onPageChange: handlePageChange,
                }
              : undefined
          }
          emptyMessage="No employees found"
        />
      </div>

      {/* Employee Details Drawer */}
      {detailsEmployee && (
        <EmployeeDetailsDrawer
          employee={detailsEmployee}
          open={!!detailsEmployee}
          onOpenChange={() => setDetailsEmployee(null)}
        />
      )}

      {/* Edit Employee Drawer */}
      {editEmployee && (
        <EditEmployeeDrawer
          employee={editEmployee}
          open={!!editEmployee}
          onOpenChange={() => setEditEmployee(null)}
        />
      )}

      {/* Delete Modal */}
      {deleteEmployee && (
        <DeleteEmployeeModal
          employee={deleteEmployee}
          open={!!deleteEmployee}
          onOpenChange={() => setDeleteEmployee(null)}
          onConfirm={handleConfirmDelete}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
