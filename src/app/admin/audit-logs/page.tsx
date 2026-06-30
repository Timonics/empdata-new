// app/admin/audit-logs/page.tsx
"use client";

import { useState, useCallback } from "react";
import { format } from "date-fns";
import { useAuditLogs } from "@/hooks/queries/useAuditLogs";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Calendar,
  User,
  FileText,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  RefreshCw,
  AlertCircle,
  History,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AuditLogFilters } from "@/types/audit-log.types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";

const statusColors = {
  SUCCESS: "bg-green-100 text-green-800 border-green-200",
  FAILED: "bg-red-100 text-red-800 border-red-200",
};

const actorTypeOptions = [
  { value: "", label: "All actors" },
  { value: "admin", label: "Admin" },
  { value: "portal_user", label: "Portal User" },
  { value: "system", label: "System" },
  { value: "public", label: "Public" },
];

const actionOptions: { value: string; label: string }[] = [
  { value: "", label: "All actions" },
  ...[
    "LOGIN_SUCCESS",
    "LOGIN_FAILED",
    "LOGOUT",
    "2FA_VERIFIED",
    "2FA_FAILED",
    "COMPANY_REGISTRATION_SUBMITTED",
    "COMPANY_REGISTRATION_APPROVED",
    "COMPANY_REGISTRATION_REJECTED",
    "EMPLOYEE_REGISTRATION_SUBMITTED",
    "EMPLOYEE_REGISTRATION_APPROVED",
    "EMPLOYEE_REGISTRATION_VERIFIED",
    "INDIVIDUAL_REGISTRATION_SUBMITTED",
    "INDIVIDUAL_REGISTRATION_APPROVED",
    "INDIVIDUAL_REGISTRATION_REJECTED",
    "NIN_SUBMITTED",
    "NIN_VERIFICATION_SUCCESS",
    "NIN_VERIFICATION_FAILED",
    "NIN_VALIDATED",
    "DOCUMENT_UPLOADED",
    "DOCUMENT_DOWNLOADED",
    "DOCUMENT_DELETED",
    "PASSWORD_RESET_REQUESTED",
    "PASSWORD_RESET_COMPLETED",
    "INVITATION_SENT",
  ].map((a) => ({ value: a, label: a })),
];

const statusOptions = [
  { value: "", label: "All status" },
  { value: "SUCCESS", label: "Success" },
  { value: "FAILED", label: "Failed" },
];

export default function AuditLogsPage() {
  const [filters, setFilters] = useState<AuditLogFilters>({
    page: 1,
    per_page: 15,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data, isLoading, error, refetch } = useAuditLogs(filters);
  const logs = data?.data || [];
  const pagination = data; // contains current_page, total, last_page, etc.

  const handleFilterChange = (key: keyof AuditLogFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setFilters((prev) => ({ ...prev, actor_email: term || undefined }));
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const clearFilters = () => {
    setFilters({ page: 1, per_page: 15 });
    setSearchTerm("");
    setShowFilters(false);
  };

  // Export CSV (frontend export based on current filtered data)
  const handleExport = () => {
    if (!data?.data) return;
    const logs = data.data;
    if (logs.length === 0) {
      alert("No data to export");
      return;
    }
    // Build CSV
    const headers = [
      "ID",
      "Timestamp",
      "Action",
      "Actor Type",
      "Actor Email",
      "Record Type",
      "Record ID",
      "Status",
      "IP Address",
    ];
    const rows = logs.map((log) => [
      log.id,
      log.timestamp,
      log.action,
      log.actor_type,
      log.actor_email || "",
      log.record_type || "",
      log.record_id || "",
      log.status,
      log.ip_address || "",
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `audit-logs-${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const getActionIcon = (action: string) => {
    if (
      action.includes("SUCCESS") ||
      action.includes("VERIFIED") ||
      action.includes("VALIDATED")
    ) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    if (action.includes("FAILED") || action.includes("REJECTED")) {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    if (action.includes("VIEWED")) {
      return <Eye className="h-4 w-4 text-blue-500" />;
    }
    if (action.includes("NIN")) {
      return <FileText className="h-4 w-4 text-purple-500" />;
    }
    return <FileText className="h-4 w-4 text-gray-500" />;
  };

  const getStatusBadge = (status: string) => (
    <Badge
      variant="outline"
      className={cn(
        "font-medium",
        statusColors[status as keyof typeof statusColors] ||
          "bg-gray-100 text-gray-800",
      )}
    >
      {status}
    </Badge>
  );

  // Columns for DataTable (if using DataTable component) or manual table
  // We'll keep the manual table from the original code for consistency.
  // We'll just replace the data source and add loading/error states.

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Audit Logs
          </h1>
          <p className="text-muted-foreground mt-2">
            Track all activities and changes in the system
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="hover:bg-blue-50 hover:text-blue-600"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="hover:bg-blue-50 hover:text-blue-600"
          >
            <RefreshCw
              className={cn("mr-2 h-4 w-4", isRefreshing && "animate-spin")}
            />
            Refresh
          </Button>
          <Button
            onClick={handleExport}
            disabled={!logs.length}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by actor email or ID..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Filters Card */}
      {showFilters && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Filter Audit Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="action">Action Type</Label>
                <Select
                  value={filters.action || ""}
                  onValueChange={(val) =>
                    handleFilterChange("action", val || undefined)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All actions" />
                  </SelectTrigger>
                  <SelectContent>
                    {actionOptions.map((opt) => (
                      <SelectItem
                        key={opt.value as any}
                        value={opt.value as any}
                      >
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="actor_type">Actor Type</Label>
                <Select
                  value={filters.actor_type || ""}
                  onValueChange={(val) =>
                    handleFilterChange("actor_type", val || undefined)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All actors" />
                  </SelectTrigger>
                  <SelectContent>
                    {actorTypeOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={filters.status || ""}
                  onValueChange={(val) =>
                    handleFilterChange("status", val || undefined)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="record_type">Record Type</Label>
                <Input
                  id="record_type"
                  placeholder="e.g., CompanyRegistration"
                  value={filters.record_type || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "record_type",
                      e.target.value || undefined,
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="record_id">Record ID</Label>
                <Input
                  id="record_id"
                  type="number"
                  placeholder="e.g., 123"
                  value={filters.record_id || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "record_id",
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_from">From Date</Label>
                <Input
                  id="date_from"
                  type="date"
                  value={filters.date_from || ""}
                  onChange={(e) =>
                    handleFilterChange("date_from", e.target.value || undefined)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_to">To Date</Label>
                <Input
                  id="date_to"
                  type="date"
                  value={filters.date_to || ""}
                  onChange={(e) =>
                    handleFilterChange("date_to", e.target.value || undefined)
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading / Error / Empty States */}
      {isLoading && (
        <Card className="border-0 shadow-lg">
          <CardContent className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-0 shadow-lg border-red-200">
          <CardContent className="flex flex-col items-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <p className="text-lg font-medium text-gray-900">
              Failed to load audit logs
            </p>
            <p className="text-sm text-muted-foreground">{error.message}</p>
            <Button variant="outline" onClick={handleRefresh} className="mt-4">
              Try again
            </Button>
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && logs.length === 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="flex flex-col items-center py-12">
            <History className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900">
              No audit logs found
            </p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters or search terms.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Audit Logs Table */}
      {!isLoading && !error && logs.length > 0 && (
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-50">
                  <TableHead className="w-16">ID</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Record Type</TableHead>
                  <TableHead>Record ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-gray-50">
                    <TableCell className="font-mono text-xs">
                      {log.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>
                          {format(
                            new Date(log.timestamp),
                            "MMM d, yyyy HH:mm:ss",
                          )}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getActionIcon(log.action)}
                        <span className="font-medium text-sm">
                          {log.action}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="text-sm">
                            {log.actor_email || "System"}
                          </div>
                          <div className="text-xs text-muted-foreground capitalize">
                            {log.actor_type}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {log.record_type ? (
                        <Badge variant="outline" className="bg-gray-100">
                          {log.record_type}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {log.record_id || "-"}
                    </TableCell>
                    <TableCell>{getStatusBadge(log.status)}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {log.ip_address || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination && pagination.last_page > 1 && (
            <CardFooter className="flex justify-center border-t p-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (filters.page && filters.page > 1)
                          handlePageChange(filters.page - 1);
                      }}
                      className={cn(
                        filters.page === 1 && "pointer-events-none opacity-50",
                      )}
                    />
                  </PaginationItem>

                  {Array.from({ length: pagination.last_page }, (_, i) => i + 1)
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === pagination.last_page ||
                        Math.abs(page - (filters.page || 1)) <= 2,
                    )
                    .map((page, index, array) => {
                      if (index > 0 && page - array[index - 1] > 1) {
                        return (
                          <PaginationItem key={`ellipsis-${page}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(page);
                            }}
                            isActive={page === (filters.page || 1)}
                            className={cn(
                              page === (filters.page || 1) &&
                                "bg-blue-600 text-white",
                            )}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (filters.page && filters.page < pagination.last_page)
                          handlePageChange(filters.page + 1);
                      }}
                      className={cn(
                        filters.page === pagination.last_page &&
                          "pointer-events-none opacity-50",
                      )}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardFooter>
          )}
        </Card>
      )}

      {/* Summary Card */}
      {pagination && (
        <Card className="border-0 shadow-lg bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm">
              <History className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800">
                Total Records: {pagination.total}
              </span>
              <span className="text-muted-foreground mx-2">•</span>
              <span className="text-muted-foreground">
                Showing {pagination.from} to {pagination.to} of{" "}
                {pagination.total} entries
              </span>
              {(filters.action ||
                filters.actor_type ||
                filters.status ||
                searchTerm) && (
                <>
                  <span className="text-muted-foreground mx-2">•</span>
                  <span className="text-muted-foreground">
                    Filtered: {logs.length} results
                  </span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
