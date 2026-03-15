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
import { Input } from "@/components/ui/input";
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
  User,
  Shield,
  ShieldCheck,
  Search,
  Filter,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useIndividualRegistrations,
  useApproveIndividualRegistration,
  useRejectIndividualRegistration,
  useSendIndividualInvitation,
  useVerifyIndividualRegistration,
} from "@/hooks/queries/useIndividualRegistrations";
import { formatDistanceToNow } from "date-fns";
import { IndividualRegistrationFilters, IndividualStatus } from "@/types/individual.types";
import { IndividualDrawer } from "./individual-drawer";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  approved: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
  verified: "bg-purple-100 text-purple-800 border-purple-200",
};

const accountStatusStyles = {
  pending: "bg-gray-100 text-gray-800 border-gray-200",
  invited: "bg-blue-100 text-blue-800 border-blue-200",
  active: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

export function IndividualRegistrations() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // Selection state
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  // Drawer state
  const [drawerRegistration, setDrawerRegistration] = useState<any | null>(
    null,
  );
  const [drawerMode, setDrawerMode] = useState<"view" | "edit">("view");

  // Filter state
  const [filters, setFilters] = useState<IndividualRegistrationFilters>({
    status: undefined,
    account_status: undefined,
    verification_status: undefined,
    search: "",
    per_page: pageSize,
    page: currentPage,
  });

  // Search input state (for debouncing)
  const [searchInput, setSearchInput] = useState("");

  // Modal states
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<any | null>(
    null,
  );
  const [rejectionReason, setRejectionReason] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        search: searchInput,
        page: 1, // Reset to first page on search
      }));
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Update filters when page or pageSize changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      page: currentPage,
      per_page: pageSize,
    }));
  }, [currentPage, pageSize]);

  // Fetch data with pagination
  const { data, isLoading, refetch, isFetching } = useIndividualRegistrations(
    filters,
  );

  const approveMutation = useApproveIndividualRegistration();
  const rejectMutation = useRejectIndividualRegistration();
  const verifyMutation = useVerifyIndividualRegistration();
  const sendInviteMutation = useSendIndividualInvitation();

  const handleApproveClick = (registration: any) => {
    setSelectedRegistration(registration);
    setShowApproveDialog(true);
  };

  const handleRejectClick = (registration: any) => {
    setSelectedRegistration(registration);
    setShowRejectDialog(true);
    setRejectionReason("");
  };

  const handleVerifyClick = (registration: any) => {
    setSelectedRegistration(registration);
    setShowVerifyDialog(true);
  };

  const handleInviteClick = (registration: any) => {
    setSelectedRegistration(registration);
    setShowInviteDialog(true);
    setInviteEmail("");
  };

  const handleApproveConfirm = () => {
    if (!selectedRegistration) return;

    approveMutation.mutate(selectedRegistration.id, {
      onSuccess: () => {
        setShowApproveDialog(false);
        setSelectedRegistration(null);
        refetch();
      },
    });
  };

  const handleRejectConfirm = () => {
    if (!selectedRegistration || !rejectionReason.trim()) return;

    rejectMutation.mutate(
      {
        id: selectedRegistration.id,
        data: { rejection_reason: rejectionReason },
      },
      {
        onSuccess: () => {
          setShowRejectDialog(false);
          setSelectedRegistration(null);
          setRejectionReason("");
          refetch();
        },
      },
    );
  };

  const handleVerifyConfirm = () => {
    if (!selectedRegistration) return;

    verifyMutation.mutate(selectedRegistration.id, {
      onSuccess: () => {
        setShowVerifyDialog(false);
        setSelectedRegistration(null);
        refetch();
      },
    });
  };

  const handleInviteConfirm = () => {
    if (!selectedRegistration) return;

    sendInviteMutation.mutate(
      { id: selectedRegistration.id, email: inviteEmail || undefined },
      {
        onSuccess: () => {
          setShowInviteDialog(false);
          setSelectedRegistration(null);
          setInviteEmail("");
          refetch();
        },
      },
    );
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

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "all" ? undefined : value,
      page: 1,
    }));
    setCurrentPage(1);
    setSelectedRows([]);
  };

  const handleStatusFilter = (status: string | undefined) => {
    setFilters((prev) => ({
      ...prev,
      status: status as IndividualStatus | undefined,
      page: 1,
    }));
    setCurrentPage(1);
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
      header: "Individual",
      sortable: true,
      cell: (item: any) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border">
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {`${item.first_name?.[0] || ""}${item.last_name?.[0] || ""}`}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">
              {item.first_name} {item.last_name}
            </p>
            <p className="text-xs text-muted-foreground">
              {item.email_address}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Contact",
      cell: (item: any) => (
        <div>
          <p className="text-sm">{item.phone_number || "N/A"}</p>
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
            {item.status}
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
            {item.account_status}
          </Badge>
        </div>
      ),
    },
    {
      header: "ID Type",
      cell: (item: any) => (
        <span className="text-sm">{item.identity_card_type}</span>
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
          {item.status === "pending" && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                onClick={() => handleApproveClick(item)}
                title="Approve"
                disabled={approveMutation.isPending}
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleRejectClick(item)}
                title="Reject"
                disabled={rejectMutation.isPending}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </>
          )}

          {item.status === "approved" && (
            <Button
              variant="ghost"
              size="icon"
              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
              onClick={() => handleVerifyClick(item)}
              title="Verify"
              disabled={verifyMutation.isPending}
            >
              <ShieldCheck className="h-4 w-4" />
            </Button>
          )}

          {item.status === "approved" && item.account_status === "pending" && (
            <Button
              variant="ghost"
              size="icon"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={() => handleInviteClick(item)}
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
      {/* Search and Filter Bar */}
      <div className="flex flex-col gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search individuals by name, email, or phone..."
            className="pl-10"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        {/* Filter and Controls Bar */}
        <div className="flex items-center justify-between">
          {/* Filter tabs */}
          <div className="flex items-center gap-2 border-b pb-2">
            <Button
              variant={!filters.status ? "default" : "ghost"}
              size="sm"
              onClick={() => handleStatusFilter(undefined)}
            >
              All
            </Button>
            <Button
              variant={
                filters.status === "pending" ? "default" : "ghost"
              }
              size="sm"
              onClick={() => handleStatusFilter("pending")}
              className="data-[variant=default]:bg-yellow-600"
            >
              Pending
            </Button>
            <Button
              variant={filters.status === "approved" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleStatusFilter("approved")}
              className="data-[variant=default]:bg-green-600"
            >
              Approved
            </Button>
            <Button
              variant={filters.status === "verified" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleStatusFilter("verified")}
              className="data-[variant=default]:bg-purple-600"
            >
              Verified
            </Button>
            <Button
              variant={filters.status === "rejected" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleStatusFilter("rejected")}
              className="data-[variant=default]:bg-red-600"
            >
              Rejected
            </Button>
          </div>

          {/* Refresh and Page Size Controls */}
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
            >
              <RefreshCw
                className={cn("h-4 w-4", isFetching && "animate-spin")}
              />
            </Button>
          </div>
        </div>

        {/* Advanced Filters Row */}
        <div className="flex items-center gap-2">
          <Select
            value={filters.verification_status || "all"}
            onValueChange={(value) => handleFilterChange("verification_status", value)}
          >
            <SelectTrigger className="w-40">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Verification Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Verification</SelectItem>
              <SelectItem value="not_verified">Not Verified</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.account_status || "all"}
            onValueChange={(value) => handleFilterChange("account_status", value)}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Account Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Accounts</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="invited">Invited</SelectItem>
              <SelectItem value="active">Active</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Data Table with Pagination */}
      <div className="rounded-md border bg-white">
        <DataTable
          data={data?.data || []}
          columns={columns}
          isLoading={isLoading}
          pagination={
            data?.pagination
              ? {
                  currentPage: data.pagination.current_page,
                  totalPages: data.pagination.last_page,
                  totalItems: data.pagination.total,
                  onPageChange: handlePageChange,
                }
              : undefined
          }
          emptyMessage="No individual registrations found"
        />
      </div>

      {/* Selection Info Bar */}
      {selectedRows.length > 0 && (
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
          <span className="text-sm text-blue-700">
            <span className="font-semibold">{selectedRows.length}</span> item(s)
            selected
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
        <IndividualDrawer
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
              Approve Individual Registration
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>
                  Are you sure you want to approve{" "}
                  <span className="font-semibold">
                    {selectedRegistration?.first_name} {selectedRegistration?.last_name}
                  </span>
                  ?
                </p>
                <p className="text-sm text-gray-600">
                  This will mark the registration as approved. You can then send an invitation to the individual to create their account.
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
              className="bg-green-600 hover:bg-green-700"
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
              Reject Individual Registration
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting{" "}
              <span className="font-semibold">
                {selectedRegistration?.first_name} {selectedRegistration?.last_name}
              </span>
              .
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

      {/* Verify Dialog */}
      <AlertDialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-purple-600">
              <Shield className="h-5 w-5" />
              Verify Individual Registration
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>
                  Are you sure you want to verify{" "}
                  <span className="font-semibold">
                    {selectedRegistration?.first_name} {selectedRegistration?.last_name}
                  </span>
                  ?
                </p>
                <p className="text-sm text-gray-600">
                  This will mark the identity documents as verified.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={verifyMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleVerifyConfirm}
              disabled={verifyMutation.isPending}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {verifyMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Registration'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Send Invitation Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-blue-600">
              <Mail className="h-5 w-5" />
              Send Invitation
            </DialogTitle>
            <DialogDescription>
              Send an invitation email to{" "}
              <span className="font-semibold">
                {selectedRegistration?.first_name} {selectedRegistration?.last_name}
              </span>
              .
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address (Optional)</label>
              <input
                type="email"
                placeholder={selectedRegistration?.email_address}
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-muted-foreground">
                If left blank, the invitation will be sent to {selectedRegistration?.email_address}
              </p>
            </div>
          </div>

          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setShowInviteDialog(false);
                setSelectedRegistration(null);
                setInviteEmail("");
              }}
              disabled={sendInviteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleInviteConfirm}
              disabled={sendInviteMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {sendInviteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Invitation'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}