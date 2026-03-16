"use client";

import { useState } from "react";
import { format, subDays } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

// Dummy data for audit logs
const generateDummyAuditLogs = (page: number, perPage: number) => {
  const actions = [
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
  ];

  const actorTypes = ["admin", "portal_user", "system", "public"];
  const recordTypes = [
    "CompanyRegistration",
    "EmployeeRegistration",
    "IndividualRegistration",
    "CompanyEmployee",
    "PortalUser",
    null,
  ];
  const statuses = ["SUCCESS", "FAILED", "PENDING"];
  const emails = [
    "admin@josbiz.com",
    "john.doe@company.com",
    "jane.smith@insurance.com",
    "info@acme.com",
    "hr@techcorp.com",
    null,
  ];

  const logs = [];
  const startId = (page - 1) * perPage + 1;

  for (let i = 0; i < perPage; i++) {
    const id = startId + i;
    const action = actions[Math.floor(Math.random() * actions.length)];
    const status = action.includes("FAILED")
      ? "FAILED"
      : action.includes("SUCCESS")
        ? "SUCCESS"
        : statuses[Math.floor(Math.random() * statuses.length)];
    const actorType = actorTypes[Math.floor(Math.random() * actorTypes.length)];
    const actorEmail = emails[Math.floor(Math.random() * emails.length)];
    const recordType =
      recordTypes[Math.floor(Math.random() * recordTypes.length)];
    const recordId = recordType ? Math.floor(Math.random() * 100) + 1 : null;

    // Generate random date within last 30 days
    const date = subDays(new Date(), Math.floor(Math.random() * 30));

    logs.push({
      id,
      timestamp: date.toISOString(),
      action,
      actor_type: actorType,
      actor_email: actorEmail,
      record_type: recordType,
      record_id: recordId,
      status,
      ip_address: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      metadata: action.includes("NIN")
        ? { report_id: `NIN-${Math.floor(Math.random() * 10000)}` }
        : null,
    });
  }

  return logs;
};

// Generate pagination metadata
const getPaginationData = (page: number, perPage: number) => {
  const total = 157; // Fixed total for dummy data
  const lastPage = Math.ceil(total / perPage);

  return {
    current_page: page,
    last_page: lastPage,
    per_page: perPage,
    total: total,
    from: (page - 1) * perPage + 1,
    to: Math.min(page * perPage, total),
  };
};

interface AuditLogsPageProps {
  role: "admin" | "company" | "employee";
}

export default function AuditLogsPage({ role }: AuditLogsPageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(15);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isAdmin = role === "admin";
  const theme = isAdmin ? "blue" : "emerald";

  // Get dummy data
  const auditLogs = generateDummyAuditLogs(currentPage, perPage);
  const pagination = getPaginationData(currentPage, perPage);

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

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      SUCCESS: "bg-green-100 text-green-800 border-green-200",
      FAILED: "bg-red-100 text-red-800 border-red-200",
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };

    return (
      <Badge
        variant="outline"
        className={cn(
          "font-medium",
          variants[status] || "bg-gray-100 text-gray-800",
        )}
      >
        {status}
      </Badge>
    );
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleExport = () => {
    // Simulate export
    alert("Export started. Your download will begin shortly.");
  };

  const clearFilters = () => {
    setSearchTerm("");
    setActionFilter("");
    setStatusFilter("");
    setCurrentPage(1);
  };

  // Filter logs based on search and filters
  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      searchTerm === "" ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.actor_email?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false) ||
      log.id.toString().includes(searchTerm);

    const matchesAction =
      actionFilter === "" || log.action.includes(actionFilter);
    const matchesStatus = statusFilter === "" || log.status === statusFilter;

    return matchesSearch && matchesAction && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className={cn(
              "text-3xl font-bold tracking-tight bg-linear-to-r bg-clip-text text-transparent from-blue-600 to-blue-800",
            )}
          >
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
            className="hover:bg-blue-600 hover:text-blue-700"
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
            placeholder="Search by action, email, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All actions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All actions</SelectItem>
                    <SelectItem value="LOGIN">Login</SelectItem>
                    <SelectItem value="REGISTRATION">Registration</SelectItem>
                    <SelectItem value="VERIFICATION">Verification</SelectItem>
                    <SelectItem value="APPROVAL">Approval</SelectItem>
                    <SelectItem value="NIN">NIN</SelectItem>
                    <SelectItem value="DOCUMENT">Document</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All status</SelectItem>
                    <SelectItem value="SUCCESS">Success</SelectItem>
                    <SelectItem value="FAILED">Failed</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button type="button" variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Audit Logs Table */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow
                className="bg-blue-50"
              >
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
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No audit logs found
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
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
                      {log.ip_address}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {pagination.last_page > 1 && (
          <CardFooter className="flex justify-center border-t p-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={cn(
                      currentPage === 1 && "pointer-events-none opacity-50",
                    )}
                  />
                </PaginationItem>

                {Array.from({ length: pagination.last_page }, (_, i) => i + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === pagination.last_page ||
                      Math.abs(page - currentPage) <= 2,
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
                            setCurrentPage(page);
                          }}
                          isActive={currentPage === page}
                          className={cn(
                            currentPage === page &&
                              (isAdmin
                                ? "bg-blue-600 text-white"
                                : "bg-emerald-600 text-white"),
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
                      if (currentPage < pagination.last_page) {
                        setCurrentPage(currentPage + 1);
                      }
                    }}
                    className={cn(
                      currentPage === pagination.last_page &&
                        "pointer-events-none opacity-50",
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardFooter>
        )}
      </Card>

      {/* Summary Card */}
      <Card
        className={cn(
          "border-0 shadow-lg",
          isAdmin ? "bg-blue-50" : "bg-emerald-50",
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm">
            <History
              className={cn(
                "h-4 w-4",
                isAdmin ? "text-blue-600" : "text-emerald-600",
              )}
            />
            <span
              className={cn(
                "font-medium",
                isAdmin ? "text-blue-800" : "text-emerald-800",
              )}
            >
              Total Records: {pagination.total}
            </span>
            <span className="text-muted-foreground mx-2">•</span>
            <span className="text-muted-foreground">
              Showing {pagination.from} to {pagination.to} of {pagination.total}{" "}
              entries
            </span>
            {(searchTerm || actionFilter || statusFilter) && (
              <>
                <span className="text-muted-foreground mx-2">•</span>
                <span className="text-muted-foreground">
                  Filtered: {filteredLogs.length} results
                </span>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
