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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
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
  CheckCircle,
  XCircle,
  Calendar,
  FileText,
  Mail,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useCompanyRegistrations,
  useApproveCompanyRegistration,
  useRejectCompanyRegistration,
  useSendCompanyInvitation,
} from "@/hooks/queries/useGroupLifeCompanies";
import { formatDistanceToNow } from "date-fns";
import { RegistrationFilters } from "@/types/grouplife.types";
import { GroupLifeDrawer } from "./group-life-drawer";
import { GroupLifeStats } from "./grouplife-stats";

const statusStyles = {
  pending_approval: "bg-yellow-100 text-yellow-800 border-yellow-200",
  approved: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
};

const accountStatusStyles = {
  pending: "bg-gray-100 text-gray-800 border-gray-200",
  invited: "bg-blue-100 text-blue-800 border-blue-200",
  active: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

const verificationStatusStyles = {
  not_verified: "bg-orange-100 text-orange-800 border-orange-200",
  verified: "bg-purple-100 text-purple-800 border-purple-200",
};

export function GroupLifeRegistrations() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  
  // Selection state
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  
  // Drawer state
  const [drawerRegistration, setDrawerRegistration] = useState<any | null>(null);
  const [drawerMode, setDrawerMode] = useState<"view" | "edit">("view");
  
  // Filter state
  const [filters, setFilters] = useState<RegistrationFilters>({
    status: undefined,
    account_status: undefined,
    verification_status: undefined,
    per_page: pageSize,
    page: currentPage,
  });
  
  // Modal states
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Update filters when page or pageSize changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      page: currentPage,
      per_page: pageSize,
    }));
  }, [currentPage, pageSize]);

  // Fetch data with pagination
  const { data, isLoading, refetch, isFetching } = useCompanyRegistrations(filters, currentPage);

  console.log(data);
  
  const approveMutation = useApproveCompanyRegistration();
  const rejectMutation = useRejectCompanyRegistration();
  const sendInviteMutation = useSendCompanyInvitation();

  const handleApproveClick = (registration: any) => {
    setSelectedRegistration(registration);
    setShowApproveDialog(true);
  };

  const handleRejectClick = (registration: any) => {
    setSelectedRegistration(registration);
    setShowRejectDialog(true);
    setRejectionReason("");
  };

  const handleApproveConfirm = () => {
    if (!selectedRegistration) return;
    
    approveMutation.mutate(selectedRegistration.id, {
      onSuccess: () => {
        setShowApproveDialog(false);
        setSelectedRegistration(null);
        refetch(); // Refresh data after action
      },
    });
  };

  const handleRejectConfirm = () => {
    if (!selectedRegistration || !rejectionReason.trim()) return;
    
    rejectMutation.mutate(
      { id: selectedRegistration.id, data: { rejection_reason: rejectionReason } },
      {
        onSuccess: () => {
          setShowRejectDialog(false);
          setSelectedRegistration(null);
          setRejectionReason("");
          refetch(); // Refresh data after action
        },
      }
    );
  };

  const handleSendInvite = (id: number, email?: string) => {
    sendInviteMutation.mutate(
      { id, data: email ? { email } : undefined },
      {
        onSuccess: () => {
          refetch(); // Refresh data after action
        },
      }
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedRows([]); // Clear selection when changing pages
  };

  const handlePageSizeChange = (size: string) => {
    setPageSize(Number(size));
    setCurrentPage(1); // Reset to first page when changing page size
    setSelectedRows([]);
  };

  const toggleAllRows = () => {
    if (data?.data && selectedRows.length === data.data.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(data?.data?.map((r: any) => r.id) || []);
    }
  };

  const toggleRow = (id: number) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const columns = [
    {
      header: (
        <input
          type="checkbox"
          className="rounded border-gray-300"
          checked={data?.data && selectedRows.length === data.data.length}
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
      header: "Company",
      sortable: true,
      cell: (item: any) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border">
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {item.company_name
                ?.split(" ")
                .map((n: string) => n[0])
                .join("")
                .slice(0, 2) || "CO"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{item.company_name}</p>
            <p className="text-xs text-muted-foreground">{item.rc_number}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Contact",
      cell: (item: any) => (
        <div>
          <p className="text-sm">{item.email_address}</p>
          <p className="text-xs text-muted-foreground">{item.phone_number}</p>
        </div>
      ),
    },
    {
      header: "Status",
      sortable: true,
      cell: (item: any) => (
        <div className="space-y-1">
          <Badge
            variant="outline"
            className={cn(
              "font-medium",
              statusStyles[item.status as keyof typeof statusStyles] ||
                "bg-gray-100",
            )}
          >
            {item.status?.replace("_", " ") || "N/A"}
          </Badge>
          <Badge
            variant="outline"
            className={cn(
              "font-medium ml-1",
              accountStatusStyles[
                item.account_status as keyof typeof accountStatusStyles
              ] || "bg-gray-100",
            )}
          >
            {item.account_status || "N/A"}
          </Badge>
        </div>
      ),
    },
    {
      header: "Submitted",
      sortable: true,
      cell: (item: any) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <div>
            <span className="text-sm">
              {item.submitted_at
                ? new Date(item.submitted_at).toLocaleDateString()
                : "N/A"}
            </span>
            <p className="text-xs text-muted-foreground">
              {item.submitted_at
                ? formatDistanceToNow(new Date(item.submitted_at), {
                    addSuffix: true,
                  })
                : ""}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Actions",
      cell: (item: any) => (
        <div className="flex items-center gap-2">
          {item.status === "pending_approval" && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                onClick={() => handleApproveClick(item)}
                title="Approve"
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleRejectClick(item)}
                title="Reject"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </>
          )}

          {item.status === "approved" && item.account_status === "pending" && (
            <Button
              variant="ghost"
              size="icon"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={() => handleSendInvite(item.id)}
              title="Send Invitation"
              disabled={sendInviteMutation.isPending}
            >
              {sendInviteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Mail className="h-4 w-4" />
              )}
            </Button>
          )}

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
                  setDrawerRegistration(item);
                  setDrawerMode("view");
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                View Documents
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
      <GroupLifeStats />

      {/* Filter and Controls Bar */}
      <div className="flex items-center justify-between">
        {/* Filter tabs */}
        <div className="flex items-center gap-2 border-b pb-2">
          <Button
            variant={!filters.status ? "default" : "ghost"}
            size="sm"
            onClick={() => {
              setFilters({ ...filters, status: undefined });
              setCurrentPage(1);
            }}
          >
            All
          </Button>
          <Button
            variant={filters.status === "pending_approval" ? "default" : "ghost"}
            size="sm"
            onClick={() => {
              setFilters({ ...filters, status: "pending_approval" });
              setCurrentPage(1);
            }}
            className="data-[variant=default]:bg-yellow-600"
          >
            Pending
          </Button>
          <Button
            variant={filters.status === "approved" ? "default" : "ghost"}
            size="sm"
            onClick={() => {
              setFilters({ ...filters, status: "approved" });
              setCurrentPage(1);
            }}
            className="data-[variant=default]:bg-green-600"
          >
            Approved
          </Button>
          <Button
            variant={filters.status === "rejected" ? "default" : "ghost"}
            size="sm"
            onClick={() => {
              setFilters({ ...filters, status: "rejected" });
              setCurrentPage(1);
            }}
            className="data-[variant=default]:bg-red-600"
          >
            Rejected
          </Button>
        </div>

        {/* Refresh and Page Size Controls */}
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
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} />
          </Button>
        </div>
      </div>

      {/* Data Table with Pagination */}
      <div className="rounded-md border bg-white">
        <DataTable
          data={data?.data || []}
          columns={columns}
          isLoading={isLoading}
          pagination={data?.pagination ? {
            currentPage: data.pagination.current_page,
            totalPages: data.pagination.last_page,
            totalItems: data.pagination.total,
            onPageChange: handlePageChange,
          } : undefined}
          emptyMessage="No group life registrations found"
          // onRowClick={(item) => {
          //   setDrawerRegistration(item);
          //   setDrawerMode("view");
          // }}
        />
      </div>

      {/* Selection Info Bar */}
      {selectedRows.length > 0 && (
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
          <span className="text-sm text-blue-700">
            <span className="font-semibold">{selectedRows.length}</span> item(s) selected
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedRows([])}
            className="text-blue-700 hover:text-blue-800 hover:bg-blue-100"
          >
            Clear selection
          </Button>
        </div>
      )}

      {drawerRegistration && (
        <GroupLifeDrawer
          registration={drawerRegistration}
          open={!!drawerRegistration}
          onOpenChange={() => setDrawerRegistration(null)}
          mode={drawerMode}
          onModeChange={(mode) => setDrawerMode(mode)}
        />
      )}

      {/* Approve Confirmation Dialog */}
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Approve Registration
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>
                  Are you sure you want to approve{' '}
                  <span className="font-semibold">{selectedRegistration?.company_name}</span>?
                </p>
                <p className="text-sm text-gray-600">
                  This will mark the registration as approved. You can then send an invitation to the company to create their account.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={approveMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApproveConfirm}
              disabled={approveMutation.isPending}
              className="bg-green-600 hover:bg-green-700 focus:ring-green-600"
            >
              {approveMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Approving...
                </>
              ) : (
                'Approve Registration'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" />
              Reject Registration
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting{' '}
              <span className="font-semibold">{selectedRegistration?.company_name}</span>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              This reason will be sent to the applicant via email.
            </p>
          </div>

          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false);
                setSelectedRegistration(null);
                setRejectionReason("");
              }}
              disabled={rejectMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectConfirm}
              disabled={rejectMutation.isPending || !rejectionReason.trim()}
            >
              {rejectMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rejecting...
                </>
              ) : (
                'Reject Registration'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}