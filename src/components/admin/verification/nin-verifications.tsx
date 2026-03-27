// components/admin/verifications/nin-verifications.tsx
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  ShieldAlert,
  Download,
  Building2,
  User,
  Users,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VerificationDrawer } from "./verification-drawer";
import { VerificationModal } from "./verification-modal";
import {
  useAllNINVerifications,
  usePublicVerifyNIN,
} from "@/hooks/queries/useVerifications";
import { useCurrentAdmin } from "@/hooks/queries/useAdminRoles";
import { formatDistanceToNow } from "date-fns";
import { EncryptionService } from "@/lib/encryption";
import { toast } from "sonner";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  pending_approval: "bg-yellow-100 text-yellow-800 border-yellow-200",
  pending_admin: "bg-orange-100 text-orange-800 border-orange-200",
  approved: "bg-green-100 text-green-800 border-green-200",
  verified: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
  in_progress: "bg-blue-100 text-blue-800 border-blue-200",
};

const typeIcons = {
  company: Building2,
  employee: Users,
  individual: User,
};

const typeLabels = {
  company: "Director",
  employee: "Employee",
  individual: "Individual",
};

export function NINVerifications() {
  const queryClient = useQueryClient();
  const [drawerVerification, setDrawerVerification] = useState<any | null>(null);
  const [filter, setFilter] = useState<"all" | "pending_admin" | "pending" | "verified" | "rejected">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "company" | "employee" | "individual">("all");
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [selectedVerification, setSelectedVerification] = useState<any | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [ninVerificationData, setNinVerificationData] = useState<any | null>(null);

  const { data: currentAdmin } = useCurrentAdmin();
  const canVerify = currentAdmin?.data?.all_permissions?.includes("verify_employee_registrations") ||
                    currentAdmin?.data?.all_permissions?.includes("verify_company_registrations") ||
                    currentAdmin?.data?.all_permissions?.includes("verify_individual_registrations") ||
                    currentAdmin?.data?.roles?.includes("super-admin");
  const canView = currentAdmin?.data?.all_permissions?.includes("view_employee_registrations") ||
                  currentAdmin?.data?.all_permissions?.includes("view_company_registrations") ||
                  currentAdmin?.data?.all_permissions?.includes("view_individual_registrations") ||
                  currentAdmin?.data?.roles?.includes("super-admin");

  // Fetch all NIN verifications
  const { data, isLoading, refetch, isFetching } = useAllNINVerifications({
    status: filter === "all" ? undefined : filter,
  });

  // Public verify mutation to fetch official NIN record
  const publicVerifyMutation = usePublicVerifyNIN();

  // Filter by type
  const verifications = (data?.data || []).filter((item: any) => {
    if (typeFilter === "all") return true;
    return item.type === typeFilter;
  });

  const handleOpenModal = async (verification: any) => {
    setSelectedVerification(verification);
    setIsVerifying(true);
    setNinVerificationData(null);
    
    try {
      // Step 1: Get public key
      const publicKey = await EncryptionService.getPublicKey();
      if (!publicKey) {
        throw new Error("Could not retrieve encryption key");
      }
      
      // Step 2: Encrypt the NIN
      const encryptedNIN = await EncryptionService.encryptNin(publicKey, verification.nin_value);
      
      // Step 3: Call public verify endpoint to fetch official NIN record
      const response = await publicVerifyMutation.mutateAsync(encryptedNIN);
      
      if (response.success && response.data) {
        // Official NIN record retrieved
        setNinVerificationData({
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          date_of_birth: response.data.date_of_birth,
          gender: response.data.gender,
          nin: verification.nin_value,
          // verification_id: response.data.verification_id,
          verified_at: new Date().toISOString(),
        });
        setShowVerificationModal(true);
      } else {
        // If verification fails, still show modal with error state
        setNinVerificationData(null);
        setShowVerificationModal(true);
        toast.error(response.message || "Could not fetch official NIN record");
      }
    } catch (error: any) {
      console.error("NIN verification fetch failed:", error);
      setNinVerificationData(null);
      setShowVerificationModal(true);
      toast.error(error.message || "Failed to fetch NIN details");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedVerification) return;
    
    // Here you would call your admin approval endpoint
    // For now, we'll just show success and refetch
    toast.success("NIN verified successfully");
    setShowVerificationModal(false);
    setSelectedVerification(null);
    setNinVerificationData(null);
    refetch();
    queryClient.invalidateQueries({ queryKey: ["verifications"] });
  };

  const handleReject = async (reason: string) => {
    if (!selectedVerification) return;
    
    // Here you would call your admin reject endpoint
    toast.success("NIN rejected");
    setShowVerificationModal(false);
    setSelectedVerification(null);
    setNinVerificationData(null);
    refetch();
    queryClient.invalidateQueries({ queryKey: ["verifications"] });
  };

  if (!canView && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <ShieldAlert className="h-12 w-12 text-red-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900">Access Denied</h3>
        <p className="text-sm text-muted-foreground mt-1">
          You don't have permission to view NIN verifications.
        </p>
      </div>
    );
  }

  const columns = [
    {
      header: "Type",
      cell: (item: any) => {
        const Icon = typeIcons[item.type as keyof typeof typeIcons];
        return (
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-gray-500" />
            <Badge variant="outline" className="text-xs">
              {typeLabels[item.type as keyof typeof typeLabels]}
            </Badge>
          </div>
        );
      },
    },
    {
      header: "Name",
      cell: (item: any) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border">
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {item.name?.[0] || item.first_name?.[0]}
              {item.name?.split(" ")[1]?.[0] || item.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{item.name || `${item.first_name} ${item.last_name}`}</p>
            <p className="text-xs text-muted-foreground">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Company/Entity",
      cell: (item: any) => (
        <div>
          <p className="text-sm">{item.company_name || "Individual"}</p>
          <p className="text-xs text-muted-foreground">
            {item.type === "company" && "Director"}
            {item.type === "employee" && "Employee"}
            {item.type === "individual" && "Individual"}
          </p>
        </div>
      ),
    },
    {
      header: "NIN",
      cell: (item: any) => (
        <code className="rounded bg-gray-100 px-2 py-1 text-xs font-mono">
          {item.nin_value || "•••••••••••"}
        </code>
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
                item.nin_verification_status as keyof typeof statusStyles
              ] || "bg-gray-100"
            )}
          >
            {item.nin_verification_status || item.status || "pending"}
          </Badge>
          <Progress
            value={item.nin_verification_status === "verified" ? 100 : 30}
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
            title="Review & Verify"
            disabled={publicVerifyMutation.isPending}
          >
            {publicVerifyMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
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
              <DropdownMenuItem onClick={() => handleOpenModal(item)}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Review & Verify
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDrawerVerification(item)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              {item.nin_document_url && (
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  Download NIN Slip
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
            variant={typeFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setTypeFilter("all")}
          >
            All
          </Button>
          <Button
            variant={typeFilter === "company" ? "default" : "outline"}
            size="sm"
            onClick={() => setTypeFilter("company")}
            className="bg-purple-50 text-purple-700 hover:bg-purple-100"
          >
            Directors
          </Button>
          <Button
            variant={typeFilter === "employee" ? "default" : "outline"}
            size="sm"
            onClick={() => setTypeFilter("employee")}
            className="bg-blue-50 text-blue-700 hover:bg-blue-100"
          >
            Employees
          </Button>
          <Button
            variant={typeFilter === "individual" ? "default" : "outline"}
            size="sm"
            onClick={() => setTypeFilter("individual")}
            className="bg-green-50 text-green-700 hover:bg-green-100"
          >
            Individuals
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
          emptyMessage={
            filter === "pending_admin"
              ? "No pending admin verifications. All NINs have been processed."
              : "No NIN verifications found"
          }
        />
      </div>

      {drawerVerification && (
        <VerificationDrawer
          verification={drawerVerification}
          type="nin"
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
            setNinVerificationData(null);
          }}
          onApprove={handleApprove}
          onReject={handleReject}
          type="nin"
          verificationData={ninVerificationData}
          userData={{
            first_name: selectedVerification.first_name,
            last_name: selectedVerification.last_name,
            date_of_birth: selectedVerification.date_of_birth,
            email: selectedVerification.email,
            phone: selectedVerification.phone,
          }}
          isLoading={isVerifying}
          isSubmitting={publicVerifyMutation.isPending}
        />
      )}
    </div>
  );
}