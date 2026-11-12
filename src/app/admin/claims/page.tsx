// app/admin/claims/page.tsx
"use client";

import { useState } from "react";
import { Column, DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  CalendarIcon,
  DollarSign,
  FileText,
  User,
  ShieldCheck,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useClientPagination } from "@/hooks/useClientPagination";
import { Claim, ClaimStatus } from "@/types/claim.types";

// No claims endpoint exists in the backend API yet. The page renders from
// an empty dataset and shows an honest empty state; when the API ships,
// swap `claims` for a real query and everything below works as-is.
const statusColors: Record<ClaimStatus, string> = {
  submitted: "bg-yellow-100 text-yellow-800 border-yellow-200",
  under_review: "bg-blue-100 text-blue-800 border-blue-200",
  approved: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
  paid: "bg-purple-100 text-purple-800 border-purple-200",
};

const statusIcons: Record<ClaimStatus, string> = {
  submitted: "⏳",
  under_review: "🔍",
  approved: "✅",
  rejected: "❌",
  paid: "💰",
};

export default function ClaimsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  // Empty until the claims API is available
  const claims: Claim[] = [];
  const client = useClientPagination(claims);

  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [showDetailSheet, setShowDetailSheet] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState<ClaimStatus>("submitted");
  const [rejectionReason, setRejectionReason] = useState("");

  const filteredData = claims.filter(
    (c) =>
      c.claim_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.employee_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.policy_number.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleStatusUpdate = () => {
    // No-op until the claims API ships — there is nothing real to update.
    setShowStatusDialog(false);
    setRejectionReason("");
  };

  const openStatusDialog = (claim: Claim, status: ClaimStatus) => {
    setSelectedClaim(claim);
    setNewStatus(status);
    setRejectionReason(claim.rejection_reason || "");
    setShowStatusDialog(true);
  };

  const columns: Column<Claim>[] = [
    { header: "Claim #", accessorKey: "claim_number" },
    { header: "Policy #", accessorKey: "policy_number" },
    { header: "Employee", accessorKey: "employee_name" },
    { header: "Amount (₦)", accessorKey: "amount" },
    {
      header: "Status",
      cell: (item) => (
        <Badge className={`${statusColors[item.status as ClaimStatus]} border`}>
          {statusIcons[item.status as ClaimStatus]}{" "}
          {item.status.replace("_", " ")}
        </Badge>
      ),
    },
    { header: "Submitted", accessorKey: "submitted_at" },
    {
      header: "Actions",
      cell: (item) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedClaim(item);
              setShowDetailSheet(true);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          {item.status === "submitted" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => openStatusDialog(item, "under_review")}
            >
              <Clock className="h-4 w-4 text-blue-500" />
            </Button>
          )}
          {["submitted", "under_review"].includes(item.status) && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => openStatusDialog(item, "approved")}
              >
                <CheckCircle className="h-4 w-4 text-green-500" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => openStatusDialog(item, "rejected")}
              >
                <XCircle className="h-4 w-4 text-red-500" />
              </Button>
            </>
          )}
          {item.status === "approved" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => openStatusDialog(item, "paid")}
            >
              <CheckCircle className="h-4 w-4 text-purple-500" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4 p-6">
      <div>
        <h1 className="text-3xl font-bold">Claims</h1>
        <p className="text-muted-foreground">
          Review and process insurance claims
        </p>
      </div>

      <DataTable
        data={client.rows}
        columns={columns}
        isLoading={false}
        onSearch={claims.length > 0 ? setSearchQuery : undefined}
        searchPlaceholder="Search by claim, policy, or employee..."
        pagination={client.pagination}
        emptyMessage="No claims yet. Submitted claims will appear here once the claims API is available."
      />

      {claims.length === 0 && (
        <div className="rounded-lg border border-dashed bg-muted/30 p-10 text-center">
          <ShieldCheck className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="font-medium">Claims management is ready</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            The backend API does not expose claims endpoints yet, so there is
            no fabricated data here. When claims support ships, this table
            will populate automatically.
          </p>
        </div>
      )}

      {/* Detail Sheet */}
      <Sheet open={showDetailSheet} onOpenChange={setShowDetailSheet}>
        <SheetContent className="w-[560px] sm:w-[600px] overflow-y-auto p-0 bg-gradient-to-b from-white to-gray-50/80">
          <div className="sticky top-0 z-10 border-b bg-white/80 p-6 backdrop-blur-sm">
            <SheetHeader>
              <SheetTitle className="text-2xl font-bold tracking-tight">
                Claim Details
              </SheetTitle>
              <SheetDescription>Full claim information</SheetDescription>
            </SheetHeader>
          </div>
          <div className="p-6">
            {selectedClaim && (
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Claim Number
                    </p>
                    <p className="text-2xl font-semibold tracking-tight">
                      {selectedClaim.claim_number}
                    </p>
                  </div>
                  <Badge
                    className={`${statusColors[selectedClaim.status as ClaimStatus]} border px-3 py-1 text-sm`}
                  >
                    {statusIcons[selectedClaim.status as ClaimStatus]}{" "}
                    {selectedClaim.status.replace("_", " ")}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                      <FileText className="h-3 w-3" /> Policy
                    </p>
                    <p className="font-medium">{selectedClaim.policy_number}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                      <User className="h-3 w-3" /> Employee
                    </p>
                    <p className="font-medium">{selectedClaim.employee_name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                      <DollarSign className="h-3 w-3" /> Amount
                    </p>
                    <p className="font-medium">
                      ₦{selectedClaim.amount.toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                      <CalendarIcon className="h-3 w-3" /> Incident Date
                    </p>
                    <p className="font-medium">{selectedClaim.incident_date}</p>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <p className="text-sm text-muted-foreground">Submitted</p>
                    <p className="font-medium">
                      {new Date(selectedClaim.submitted_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="font-medium">{selectedClaim.description}</p>
                  </div>
                  {selectedClaim.rejection_reason && (
                    <div className="col-span-2 space-y-1 rounded-lg border border-red-100 bg-red-50 p-3">
                      <p className="text-sm font-medium text-red-600">
                        Rejection Reason
                      </p>
                      <p className="text-red-700">
                        {selectedClaim.rejection_reason}
                      </p>
                    </div>
                  )}
                  {selectedClaim.documents.length > 0 && (
                    <div className="col-span-2 space-y-1">
                      <p className="text-sm text-muted-foreground">Documents</p>
                      <ul className="mt-1 list-disc space-y-1 pl-5">
                        {selectedClaim.documents.map((doc, i) => (
                          <li key={i}>
                            <a
                              href={doc}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Document {i + 1}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Status Update Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Claim Status</DialogTitle>
            <DialogDescription>
              Change status to{" "}
              <strong>{newStatus?.replace("_", " ")}</strong> for claim #
              {selectedClaim?.claim_number}
            </DialogDescription>
          </DialogHeader>
          {newStatus === "rejected" && (
            <div className="py-2">
              <label className="text-sm font-medium">Rejection Reason</label>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Why is this claim being rejected?"
                rows={3}
              />
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowStatusDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleStatusUpdate}
              disabled={newStatus === "rejected" && !rejectionReason.trim()}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
