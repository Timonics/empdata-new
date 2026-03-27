// components/admin/verifications/cac-verifications.tsx
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  CheckCircle,
  RefreshCw,
  Loader2,
  ShieldAlert,
  Download,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VerificationDrawer } from "./verification-drawer";
import { VerificationModal } from "./verification-modal";
import {
  useEmployeeVerifications,
  useRejectEmployeeRegistration,
  useVerifyEmployeeRegistration,
} from "@/hooks/queries/useVerifications";
import { useCurrentAdmin } from "@/hooks/queries/useAdminRoles";
import { formatDistanceToNow } from "date-fns";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  pending_admin: "bg-orange-100 text-orange-800 border-orange-200",
  verified: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
  in_progress: "bg-blue-100 text-blue-800 border-blue-200",
};

export function CACVerifications() {
  const [drawerVerification, setDrawerVerification] = useState<any | null>(
    null,
  );
  const [filter, setFilter] = useState<
    "all" | "pending_admin" | "pending" | "verified" | "rejected"
  >("all");
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [selectedVerification, setSelectedVerification] = useState<any | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: currentAdmin } = useCurrentAdmin();
  const canVerify =
    currentAdmin?.data?.all_permissions?.includes(
      "verify_company_registrations",
    ) || currentAdmin?.data?.roles?.includes("super-admin");
  const canReject =
    currentAdmin?.data?.all_permissions?.includes(
      "reject_company_registrations",
    ) || currentAdmin?.data?.roles?.includes("super-admin");
  const canView =
    currentAdmin?.data?.all_permissions?.includes(
      "view_company_registrations",
    ) || currentAdmin?.data?.roles?.includes("super-admin");

  const { data, isLoading, refetch, isFetching } = useEmployeeVerifications({
    status: filter === "all" ? undefined : filter,
  });

  const verifyMutation = useVerifyEmployeeRegistration();
  const rejectMutation = useRejectEmployeeRegistration();

  const verifications = data?.data || [];
  const pagination = data?.pagination;

  const handleOpenModal = (verification: any) => {
    setSelectedVerification(verification);
    setShowVerificationModal(true);
  };

  const handleApprove = async () => {
    if (!selectedVerification) return;
    setIsSubmitting(true);
    try {
      await verifyMutation.mutateAsync(selectedVerification.id);
      setShowVerificationModal(false);
      setSelectedVerification(null);
      refetch();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async (reason: string) => {
    if (!selectedVerification) return;
    setIsSubmitting(true);
    try {
      await rejectMutation.mutateAsync({ id: selectedVerification.id, reason });
      setShowVerificationModal(false);
      setSelectedVerification(null);
      refetch();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!canView && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <ShieldAlert className="h-12 w-12 text-red-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900">Access Denied</h3>
        <p className="text-sm text-muted-foreground mt-1">
          You don't have permission to view CAC verifications.
        </p>
      </div>
    );
  }

  const columns = [
    {
      header: "Company",
      cell: (item: any) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border">
            <AvatarFallback className="bg-purple-100 text-purple-600">
              {item.company_name?.[0] || "C"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{item.company_name}</p>
            <p className="text-xs text-muted-foreground">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "RC Number",
      cell: (item: any) => (
        <code className="rounded bg-gray-100 px-2 py-1 text-xs font-mono">
          {item.rc_number}
        </code>
      ),
    },
    {
      header: "Director",
      cell: (item: any) => (
        <div>
          <p className="text-sm">{item.director_name}</p>
          <p className="text-xs text-muted-foreground">{item.director_phone}</p>
        </div>
      ),
    },
    {
      header: "Status",
      cell: (item: any) => (
        <div className="space-y-2">
          <Badge
            variant="outline"
            className={cn(
              "font-medium",
              statusStyles[
                item.cac_verification_status as keyof typeof statusStyles
              ] ||
                statusStyles[item.status as keyof typeof statusStyles] ||
                "bg-gray-100",
            )}
          >
            {item.cac_verification_status || item.status || "pending"}
          </Badge>
          <Progress
            value={item.cac_verification_status === "verified" ? 100 : 30}
            className="h-1 w-20"
          />
        </div>
      ),
    },
    {
      header: "Submitted",
      cell: (item: any) => (
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
      ),
    },
    {
      header: "Actions",
      cell: (item: any) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            onClick={() => handleOpenModal(item)}
            title="Review"
          >
            <Eye className="h-4 w-4" />
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
              <DropdownMenuItem onClick={() => setDrawerVerification(item)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleOpenModal(item)}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Review & Verify
              </DropdownMenuItem>
              {item.cac_document_url && (
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  Download CAC Document
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      className: "w-32",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant={filter === "pending_admin" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("pending_admin")}
            className="bg-orange-50 text-orange-700 hover:bg-orange-100 border-orange-200"
          >
            Pending Admin
          </Button>
          <Button
            variant={filter === "pending" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("pending")}
            className="bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-200"
          >
            Pending
          </Button>
          <Button
            variant={filter === "verified" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("verified")}
            className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
          >
            Verified
          </Button>
          <Button
            variant={filter === "rejected" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("rejected")}
            className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
          >
            Rejected
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw
            className={cn("h-4 w-4 mr-2", isFetching && "animate-spin")}
          />
          Refresh
        </Button>
      </div>

      <div className="rounded-md border bg-white">
        <DataTable
          data={verifications}
          columns={columns}
          isLoading={isLoading}
          pagination={
            pagination
              ? {
                  currentPage: pagination.current_page,
                  totalPages: pagination.last_page,
                  totalItems: pagination.total,
                  onPageChange: () => {},
                }
              : undefined
          }
          emptyMessage={
            filter === "pending_admin"
              ? "No pending admin verifications. All CACs have been processed."
              : "No CAC verifications found"
          }
        />
      </div>

      {drawerVerification && (
        <VerificationDrawer
          verification={drawerVerification}
          type="cac"
          open={!!drawerVerification}
          onOpenChange={() => setDrawerVerification(null)}
        />
      )}

      {selectedVerification && (
        <VerificationModal
          isOpen={showVerificationModal}
          onClose={() => {
            setShowVerificationModal(false);
            setSelectedVerification(null);
          }}
          onApprove={handleApprove}
          onReject={handleReject}
          type="cac"
          verificationData={{
            company_name: selectedVerification.cac_data?.company_name,
            rc_number: selectedVerification.cac_data?.rc_number,
            address: selectedVerification.cac_data?.address,
            registration_date: selectedVerification.cac_data?.registration_date,
            status: selectedVerification.cac_data?.status,
          }}
          userData={{
            company_name: selectedVerification.company_name,
            rc_number: selectedVerification.rc_number,
            email: selectedVerification.email,
            phone: selectedVerification.phone,
            house_address: selectedVerification.house_address,
          }}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
