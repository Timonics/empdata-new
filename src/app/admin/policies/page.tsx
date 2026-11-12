// app/admin/policies/page.tsx
"use client";

import { useClientPagination } from "@/hooks/useClientPagination";

import { useState } from "react";
import { Column, DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  Building2,
  Calendar,
  Shield,
  Wallet,
} from "lucide-react";
import { PolicyForm } from "@/components/policies/policy-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Policy, PolicyStatus, CreatePolicyData } from "@/types/policy.types";
import {
  usePolicies,
  useCreatePolicy,
  useUpdatePolicy,
  useDeletePolicy,
} from "@/hooks/queries/usePolicies";
import { DetailSheet } from "@/components/ui/detail-sheet";
import { formatDateSafe } from "@/lib/utils";

const statusColors: Record<PolicyStatus, string> = {
  draft: "bg-muted text-foreground border-border",
  active: "bg-green-100 text-green-800 border-green-200",
  expired: "bg-yellow-100 text-yellow-800 border-yellow-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

const statusIcons = {
  draft: "📄",
  active: "✅",
  expired: "⏰",
  cancelled: "🚫",
};

export default function PoliciesPage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(15);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailSheet, setShowDetailSheet] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = usePolicies({
    page,
    per_page: pageSize,
    search: searchQuery || undefined,
  });

  const createMutation = useCreatePolicy();
  const updateMutation = useUpdatePolicy();
  const deleteMutation = useDeletePolicy();

  const policies = data?.data || [];
  const pagination = data?.pagination;

  // Client-side pager fallback when the API returns no pagination meta
  const client = useClientPagination(policies, pageSize, !pagination);

  const handleCreate = async (values: CreatePolicyData) => {
    await createMutation.mutateAsync(values);
    setShowCreateModal(false);
  };

  const handleUpdate = async (values: CreatePolicyData) => {
    if (!selectedPolicy) return;
    await updateMutation.mutateAsync({ id: selectedPolicy.id, data: values });
    setShowEditModal(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteMutation.mutateAsync(deleteId);
    setDeleteId(null);
  };

  const columns: Column<Policy>[] = [
    { header: "Policy #", accessorKey: "policy_number" },
    {
      header: "Company",
      cell: (item) => <span>{item.company_name || "—"}</span>,
    },
    {
      header: "Type",
      cell: (item) => (
        <span className="capitalize">{item.type?.replace("_", " ")}</span>
      ),
    },
    {
      header: "Status",
      cell: (item) => (
        <Badge
          className={`${statusColors[item.status as PolicyStatus]} border`}
        >
          {statusIcons[item.status as PolicyStatus]} {item.status}
        </Badge>
      ),
    },
    {
      header: "Start",
      cell: (item) => <span>{formatDateSafe(item.start_date)}</span>,
    },
    {
      header: "End",
      cell: (item) => <span>{formatDateSafe(item.end_date)}</span>,
    },
    {
      header: "Premium (₦)",
      cell: (item) => (
        <span>{Number(item.premium_amount || 0).toLocaleString()}</span>
      ),
    },
    {
      header: "Actions",
      cell: (item) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedPolicy(item);
              setShowDetailSheet(true);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedPolicy(item);
              setShowEditModal(true);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteId(item.id)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Policies</h1>
          <p className="text-muted-foreground">Manage all insurance policies</p>
        </div>
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create Policy
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Policy</DialogTitle>
            </DialogHeader>
            <PolicyForm
              onSubmit={handleCreate}
              isSubmitting={createMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        data={client.rows}
        columns={columns}
        isLoading={isLoading}
        onSearch={setSearchQuery}
        searchPlaceholder="Search by policy number or company..."
        pagination={
          pagination
            ? {
                currentPage: pagination.current_page,
                totalPages: pagination.last_page,
                totalItems: pagination.total,
                onPageChange: setPage,
              }
            : client.pagination
        }
        onRowClick={(item) => {
          setSelectedPolicy(item);
          setShowDetailSheet(true);
        }}
        emptyMessage="No policies found"
      />

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Policy</DialogTitle>
          </DialogHeader>
          {selectedPolicy && (
            <PolicyForm
              defaultValues={{
                company_id: selectedPolicy.company_id,
                type: selectedPolicy.type,
                start_date: selectedPolicy.start_date,
                end_date: selectedPolicy.end_date,
                premium_amount: selectedPolicy.premium_amount,
                sum_assured: selectedPolicy.sum_assured,
                beneficiaries: selectedPolicy.beneficiaries,
              }}
              onSubmit={handleUpdate}
              isSubmitting={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Detail Sheet */}
      <DetailSheet
        open={showDetailSheet}
        onOpenChange={setShowDetailSheet}
        title="Policy Details"
        description="Full policy information"
      >
        {selectedPolicy && (
          <div className="space-y-6">
            {/* Header with status */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Policy Number</p>
                <p className="text-2xl font-semibold tracking-tight">
                  {selectedPolicy.policy_number}
                </p>
              </div>
              <Badge
                className={`${statusColors[selectedPolicy.status as PolicyStatus]} border text-sm px-3 py-1`}
              >
                {statusIcons[selectedPolicy.status as PolicyStatus]}{" "}
                {selectedPolicy.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Building2 className="h-3 w-3" /> Company
                </p>
                <p className="font-medium">
                  {selectedPolicy.company_name || "—"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="font-medium capitalize">
                  {selectedPolicy.type?.replace("_", " ")}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Start Date
                </p>
                <p className="font-medium">
                  {formatDateSafe(selectedPolicy.start_date)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> End Date
                </p>
                <p className="font-medium">
                  {formatDateSafe(selectedPolicy.end_date)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Wallet className="h-3 w-3" /> Premium
                </p>
                <p className="font-medium">
                  ₦{Number(selectedPolicy.premium_amount || 0).toLocaleString()}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Shield className="h-3 w-3" /> Sum Assured
                </p>
                <p className="font-medium">
                  ₦{Number(selectedPolicy.sum_assured || 0).toLocaleString()}
                </p>
              </div>
              <div className="col-span-2 space-y-1">
                <p className="text-sm text-muted-foreground">Beneficiaries</p>
                <p className="font-medium">
                  {selectedPolicy.beneficiaries || "—"}
                </p>
              </div>
              <div className="col-span-2 space-y-1 pt-2 border-t border-border/70">
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="text-sm">
                  {formatDateSafe(selectedPolicy.created_at, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        )}
      </DetailSheet>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Policy</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              policy.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-600"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
