// app/admin/policies/page.tsx
"use client";

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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import { toast } from "sonner";
import { Policy, PolicyStatus } from "@/types/policy.types";
import { DetailSheet } from "@/components/ui/detail-sheet";

// ---------- Dummy Data ----------
const dummyPolicies: Policy[] = [
  {
    id: 1,
    policy_number: "POL-2024-001",
    company_id: 1,
    company_name: "Acme Corp",
    type: "group_life",
    status: "active",
    start_date: "2024-01-01",
    end_date: "2024-12-31",
    premium_amount: 50000,
    sum_assured: 5000000,
    beneficiaries: "John Doe (50%), Jane Doe (50%)",
    created_at: "2024-01-01T10:00:00Z",
  },
  {
    id: 2,
    policy_number: "POL-2024-002",
    company_id: 2,
    company_name: "TechCorp",
    type: "health",
    status: "draft",
    start_date: "2024-03-01",
    end_date: "2025-02-28",
    premium_amount: 120000,
    sum_assured: 2000000,
    beneficiaries: "Company Staff",
    created_at: "2024-02-15T14:30:00Z",
  },
  {
    id: 3,
    policy_number: "POL-2024-003",
    company_id: 3,
    company_name: "FinServe",
    type: "motor",
    status: "expired",
    start_date: "2023-06-01",
    end_date: "2024-05-31",
    premium_amount: 30000,
    sum_assured: 800000,
    beneficiaries: "Driver Only",
    created_at: "2023-05-20T09:00:00Z",
  },
];

const statusColors: Record<PolicyStatus, string> = {
  draft: "bg-gray-100 text-gray-800",
  active: "bg-green-100 text-green-800",
  expired: "bg-yellow-100 text-yellow-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function PoliciesPage() {
  const [page, setPage] = useState(1);
  const [policies, setPolicies] = useState<Policy[]>(dummyPolicies);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailSheet, setShowDetailSheet] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const statusColors: Record<PolicyStatus, string> = {
    draft: "bg-gray-100 text-gray-800 border-gray-200",
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

  // Filter data based on search (policy number or company name)
  const filteredData = policies.filter(
    (p) =>
      p.policy_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.company_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCreate = (values: any) => {
    setIsSubmitting(true);
    setTimeout(() => {
      const newPolicy: Policy = {
        id: Date.now(),
        policy_number: `POL-${new Date().getFullYear()}-${String(policies.length + 1).padStart(3, "0")}`,
        ...values,
        status: "draft",
        created_at: new Date().toISOString(),
      };
      setPolicies([newPolicy, ...policies]);
      setShowCreateModal(false);
      setIsSubmitting(false);
      toast.success("Policy created");
    }, 800);
  };

  const handleUpdate = (values: any) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setPolicies(
        policies.map((p) =>
          p.id === selectedPolicy?.id ? { ...p, ...values } : p,
        ),
      );
      setShowEditModal(false);
      setIsSubmitting(false);
      toast.success("Policy updated");
    }, 800);
  };

  const handleDelete = () => {
    if (deleteId) {
      setPolicies(policies.filter((p) => p.id !== deleteId));
      setDeleteId(null);
      toast.success("Policy deleted");
    }
  };

  const columns: Column<Policy>[] = [
    { header: "Policy #", accessorKey: "policy_number" },
    { header: "Company", accessorKey: "company_name" },
    { header: "Type", accessorKey: "type" },
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
    { header: "Start", accessorKey: "start_date" },
    { header: "End", accessorKey: "end_date" },
    {
      header: "Premium (₦)",
      accessorKey: "premium_amount",
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
            <PolicyForm onSubmit={handleCreate} isSubmitting={isSubmitting} />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        data={filteredData}
        columns={columns}
        isLoading={false}
        onSearch={setSearchQuery}
        searchPlaceholder="Search by policy number or company..."
        pagination={{
          currentPage: page,
          totalPages: Math.ceil(filteredData.length / 15),
          onPageChange: setPage,
        }}
      />

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Policy</DialogTitle>
          </DialogHeader>
          {selectedPolicy && (
            <PolicyForm
              defaultValues={selectedPolicy}
              onSubmit={handleUpdate}
              isSubmitting={isSubmitting}
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
                <p className="font-medium">{selectedPolicy.company_name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="font-medium capitalize">
                  {selectedPolicy.type.replace("_", " ")}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Start Date
                </p>
                <p className="font-medium">{selectedPolicy.start_date}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> End Date
                </p>
                <p className="font-medium">{selectedPolicy.end_date}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Wallet className="h-3 w-3" /> Premium
                </p>
                <p className="font-medium">
                  ₦{selectedPolicy.premium_amount.toLocaleString()}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Shield className="h-3 w-3" /> Sum Assured
                </p>
                <p className="font-medium">
                  ₦{selectedPolicy.sum_assured.toLocaleString()}
                </p>
              </div>
              <div className="col-span-2 space-y-1">
                <p className="text-sm text-muted-foreground">Beneficiaries</p>
                <p className="font-medium">
                  {selectedPolicy.beneficiaries || "—"}
                </p>
              </div>
              <div className="col-span-2 space-y-1 pt-2 border-t border-gray-100">
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="text-sm">
                  {new Date(selectedPolicy.created_at).toLocaleString()}
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
            <AlertDialogAction onClick={handleDelete} className="bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
