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
  Edit,
  Trash2,
  UserPlus,
  Mail,
  FileText,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { cn, toFiniteNumber } from "@/lib/utils";
import { CompanyDrawer } from "./company-drawer";
import { DeleteCompanyModal } from "./delete-company-modal";
import {
  useCompanies,
  useDeleteCompany,
  useUpdateCompany,
} from "@/hooks/queries/useCompanies";
import { format } from "date-fns";
import { CompanyStatus } from "@/types/company.types";

interface CompaniesTableProps {
  onSelectionChange?: (selectedIds: number[]) => void;
  onCountsChange?: (total: number, filtered: number) => void;
  filters?: {
    status?: string;
    insurance_type?: string;
    search?: string;
  };
}

const statusStyles = {
  active: "bg-green-100 text-green-800 border-green-200",
  inactive: "bg-muted text-foreground border-border",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  suspended: "bg-red-100 text-red-800 border-red-200",
};

export function CompaniesTable({ 
  onSelectionChange, 
  onCountsChange,
  filters: externalFilters = {} 
}: CompaniesTableProps) {
  // Pagination and filter state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [internalFilters, setInternalFilters] = useState({
    status: externalFilters.status,
    insurance_type: externalFilters.insurance_type,
    search: externalFilters.search || "",
  });

  // Selection state
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  // Drawer state
  const [drawerCompany, setDrawerCompany] = useState<any | null>(null);
  const [drawerMode, setDrawerMode] = useState<"view" | "edit">("view");

  // Delete modal state
  const [deleteCompany, setDeleteCompany] = useState<any | null>(null);

  // Sync external filters
  useEffect(() => {
    setInternalFilters({
      status: externalFilters.status,
      insurance_type: externalFilters.insurance_type,
      search: externalFilters.search || "",
    });
    setCurrentPage(1);
  }, [externalFilters]);

  // Fetch real data
  const { data, isLoading, refetch, isFetching } = useCompanies({
    ...internalFilters,
    status: internalFilters.status as CompanyStatus | undefined,
    page: currentPage,
    per_page: pageSize,
  });

  const deleteMutation = useDeleteCompany();
  const updateMutation = useUpdateCompany();

  const companies = data?.data || [];
  const pagination = data?.pagination;



  // Client-side pager fallback when the API returns no pagination meta
  const client = useClientPagination(companies, pageSize, !pagination);

  // Notify parent of counts (guarded against value-only changes)
  useEffect(() => {
    if (pagination) {
      onCountsChange?.(pagination.total, companies.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination?.total, companies.length]);

  // Notify parent of selection changes
  useEffect(() => {
    onSelectionChange?.(selectedRows);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRows]);

  // Handle row selection
  const toggleAllRows = () => {
    if (selectedRows.length === companies.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(companies.map((c: any) => c.id));
    }
  };

  const toggleRow = (id: number) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleView = (company: any) => {
    setDrawerCompany(company);
    setDrawerMode("view");
  };

  const handleEdit = (company: any) => {
    setDrawerCompany(company);
    setDrawerMode("edit");
  };

  const handleDelete = (company: any) => {
    setDeleteCompany(company);
  };

  const handleConfirmDelete = () => {
    if (!deleteCompany) return;

    deleteMutation.mutate(deleteCompany.id, {
      onSuccess: () => {
        setDeleteCompany(null);
        // Clear selection if the deleted items were selected
        if (selectedRows.includes(deleteCompany.id)) {
          setSelectedRows(selectedRows.filter((id) => id !== deleteCompany.id));
        }
      },
    });
  };

  const handleSaveCompany = async (data: any) => {
    if (!drawerCompany?.id) return;
    await updateMutation.mutateAsync({ id: drawerCompany.id, data });
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

  const handleSearch = (query: string) => {
    setInternalFilters((prev) => ({ ...prev, search: query }));
    setCurrentPage(1);
    setSelectedRows([]);
  };

  // Define columns for the DataTable
  const columns = [
    {
      header: (
        <Checkbox
          checked={
            companies.length > 0 && selectedRows.length === companies.length
          }
          onCheckedChange={toggleAllRows}
        />
      ),
      cell: (item: any) => (
        <Checkbox
          checked={selectedRows.includes(item.id)}
          onCheckedChange={() => toggleRow(item.id)}
        />
      ),
      className: "w-12",
    },
    {
      header: "Company",
      sortable: true,
      cell: (item: any) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border">
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {(item.company_name || item.name || "CO")
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{item.company_name || item.name}</p>
            <p className="text-xs text-muted-foreground">
              {item.admin_name || "—"}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "RC Number",
      cell: (item: any) => (
        <code className="rounded bg-muted px-2 py-1 text-xs">
          {item.rc_number}
        </code>
      ),
    },
    {
      header: "Contact",
      cell: (item: any) => (
        <div>
          <p className="text-sm">{item.email}</p>
          <p className="text-xs text-muted-foreground">{item.phone}</p>
        </div>
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
            statusStyles[item.status as keyof typeof statusStyles] ||
              "bg-muted",
          )}
        >
          {item.status}
        </Badge>
      ),
    },
    {
      header: "Employees",
      sortable: true,
      cell: (item: any) => {
        const count =
          item.employees_count ??
          (Array.isArray(item.employees) ? item.employees.length : undefined);
        return (
          <span className="font-medium text-center block">
            {count !== undefined ? toFiniteNumber(count).toLocaleString() : "—"}
          </span>
        );
      },
      className: "text-center",
    },
    {
      header: "Joined",
      sortable: true,
      cell: (item: any) => (
        <span className="text-sm text-muted-foreground">
          {item.joined_date || item.created_at
            ? format(new Date(item.joined_date || item.created_at), "MMM d, yyyy")
            : "N/A"}
        </span>
      ),
    },
    {
      header: "",
      cell: (item: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleView(item)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEdit(item)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Company
            </DropdownMenuItem>
            <DropdownMenuItem>
              <UserPlus className="mr-2 h-4 w-4" />
              View Employees
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Mail className="mr-2 h-4 w-4" />
              Send Message
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
      ),
      className: "w-12",
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
      <DataTable
        data={client.rows}
        columns={columns}
        isLoading={isLoading}
        onSearch={handleSearch}
        searchPlaceholder="Search companies by name, email, or RC number..."
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
        emptyMessage="No companies found"
        // onRowClick={(item) => handleView(item)}
      />

      {/* Company Drawer for View/Edit */}
      {drawerCompany && (
        <CompanyDrawer
          company={drawerCompany}
          open={!!drawerCompany}
          onOpenChange={() => setDrawerCompany(null)}
          mode={drawerMode}
          onModeChange={(mode) => setDrawerMode(mode)}
          onSave={handleSaveCompany}
        />
      )}

      {/* Delete Modal */}
      {deleteCompany && (
        <DeleteCompanyModal
          company={deleteCompany}
          open={!!deleteCompany}
          onOpenChange={() => setDeleteCompany(null)}
          // onConfirm={handleConfirmDelete}
          // isDeleting={deleteMutation.isPending}
        />
      )}
    </div>
  );
}