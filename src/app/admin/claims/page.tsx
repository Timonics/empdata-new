// app/admin/claims/page.tsx
"use client";

import { useState } from "react";
import { Column, DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, CheckCircle, XCircle, Clock, CalendarIcon, DollarSign, FileText, User } from "lucide-react";
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
import { toast } from "sonner";
import { Claim, ClaimStatus } from "@/types/claim.types";

// ---------- Dummy Data ----------
const dummyClaims: Claim[] = [
  {
    id: 1,
    claim_number: "CLM-2024-001",
    policy_id: 1,
    policy_number: "POL-2024-001",
    employee_name: "John Doe",
    amount: 1500000,
    status: "submitted",
    incident_date: "2024-06-10",
    description: "Medical expenses after accident",
    documents: ["/docs/claim1.pdf"],
    submitted_at: "2024-06-12T09:00:00Z",
    rejection_reason: null,
  },
  {
    id: 2,
    claim_number: "CLM-2024-002",
    policy_id: 2,
    policy_number: "POL-2024-002",
    employee_name: "Jane Smith",
    amount: 500000,
    status: "under_review",
    incident_date: "2024-06-05",
    description: "Theft of personal belongings",
    documents: ["/docs/claim2.pdf", "/docs/police_report.pdf"],
    submitted_at: "2024-06-06T14:20:00Z",
    rejection_reason: null,
  },
  {
    id: 3,
    claim_number: "CLM-2024-003",
    policy_id: 3,
    policy_number: "POL-2024-003",
    employee_name: "Mark Johnson",
    amount: 2500000,
    status: "approved",
    incident_date: "2024-05-20",
    description: "Hospitalisation due to illness",
    documents: ["/docs/claim3.pdf"],
    submitted_at: "2024-05-21T11:00:00Z",
    rejection_reason: null,
  },
  {
    id: 4,
    claim_number: "CLM-2024-004",
    policy_id: 1,
    policy_number: "POL-2024-001",
    employee_name: "Sarah Lee",
    amount: 800000,
    status: "rejected",
    incident_date: "2024-06-01",
    description: "Damage to property",
    documents: ["/docs/claim4.pdf"],
    submitted_at: "2024-06-02T08:30:00Z",
    rejection_reason: "Insufficient evidence",
  },
];

const statusColors: Record<ClaimStatus, string> = {
  submitted: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  under_review: 'bg-blue-100 text-blue-800 border-blue-200',
  approved: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
  paid: 'bg-purple-100 text-purple-800 border-purple-200',
};

const statusIcons = {
  submitted: '⏳',
  under_review: '🔍',
  approved: '✅',
  rejected: '❌',
  paid: '💰',
};

export default function ClaimsPage() {
  const [page, setPage] = useState(1);
  const [claims, setClaims] = useState<Claim[]>(dummyClaims);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [showDetailSheet, setShowDetailSheet] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState<ClaimStatus>("submitted");
  const [rejectionReason, setRejectionReason] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter data
  const filteredData = claims.filter(
    (c) =>
      c.claim_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.employee_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.policy_number.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleStatusUpdate = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setClaims(
        claims.map((c) =>
          c.id === selectedClaim?.id
            ? {
                ...c,
                status: newStatus,
                rejection_reason:
                  newStatus === "rejected" ? rejectionReason : null,
              }
            : c,
        ),
      );
      setShowStatusDialog(false);
      setRejectionReason("");
      setIsUpdating(false);
      toast.success(`Claim ${newStatus.replace("_", " ")}`);
    }, 800);
  };

  const openStatusDialog = (claim: Claim, status: ClaimStatus) => {
    setSelectedClaim(claim);
    setNewStatus(status);
    setRejectionReason(claim.rejection_reason || "");
    setShowStatusDialog(true);
  };

  const columns: Column<Claim>[] = [
    { header: 'Claim #', accessorKey: 'claim_number' },
    { header: 'Policy #', accessorKey: 'policy_number' },
    { header: 'Employee', accessorKey: 'employee_name' },
    {
      header: 'Amount (₦)',
      accessorKey: 'amount',
    },
    {
      header: 'Status',
      cell: (item) => (
        <Badge className={`${statusColors[item.status as ClaimStatus]} border`}>
          {statusIcons[item.status as ClaimStatus]} {item.status.replace('_', ' ')}
        </Badge>
      ),
    },
    { header: 'Submitted', accessorKey: 'submitted_at' },
    {
      header: 'Actions',
      cell: (item) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => { setSelectedClaim(item); setShowDetailSheet(true); }}>
            <Eye className="h-4 w-4" />
          </Button>
          {item.status === 'submitted' && (
            <Button variant="ghost" size="icon" onClick={() => openStatusDialog(item, 'under_review')}>
              <Clock className="h-4 w-4 text-blue-500" />
            </Button>
          )}
          {['submitted', 'under_review'].includes(item.status) && (
            <>
              <Button variant="ghost" size="icon" onClick={() => openStatusDialog(item, 'approved')}>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => openStatusDialog(item, 'rejected')}>
                <XCircle className="h-4 w-4 text-red-500" />
              </Button>
            </>
          )}
          {item.status === 'approved' && (
            <Button variant="ghost" size="icon" onClick={() => openStatusDialog(item, 'paid')}>
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
        data={filteredData}
        columns={columns}
        isLoading={false}
        onSearch={setSearchQuery}
        searchPlaceholder="Search by claim, policy, or employee..."
        pagination={{
          currentPage: page,
          totalPages: Math.ceil(filteredData.length / 15),
          onPageChange: setPage,
        }}
      />

      {/* Detail Sheet */}
      <Sheet open={showDetailSheet} onOpenChange={setShowDetailSheet}>
        <SheetContent className="w-[560px] sm:w-[600px] overflow-y-auto p-0 bg-gradient-to-b from-white to-gray-50/80">
          <div className="p-6 border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
            <SheetHeader>
              <SheetTitle className="text-2xl font-bold tracking-tight">Claim Details</SheetTitle>
              <SheetDescription>Full claim information</SheetDescription>
            </SheetHeader>
          </div>
          <div className="p-6">
            {selectedClaim && (
              <div className="space-y-6">
                {/* Header with status */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Claim Number</p>
                    <p className="text-2xl font-semibold tracking-tight">{selectedClaim.claim_number}</p>
                  </div>
                  <Badge className={`${statusColors[selectedClaim.status as ClaimStatus]} border text-sm px-3 py-1`}>
                    {statusIcons[selectedClaim.status as ClaimStatus]} {selectedClaim.status.replace('_', ' ')}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <FileText className="h-3 w-3" /> Policy
                    </p>
                    <p className="font-medium">{selectedClaim.policy_number}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <User className="h-3 w-3" /> Employee
                    </p>
                    <p className="font-medium">{selectedClaim.employee_name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <DollarSign className="h-3 w-3" /> Amount
                    </p>
                    <p className="font-medium">₦{selectedClaim.amount.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" /> Incident Date
                    </p>
                    <p className="font-medium">{selectedClaim.incident_date}</p>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <p className="text-sm text-muted-foreground">Submitted</p>
                    <p className="font-medium">{new Date(selectedClaim.submitted_at).toLocaleString()}</p>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="font-medium">{selectedClaim.description}</p>
                  </div>
                  {selectedClaim.rejection_reason && (
                    <div className="col-span-2 space-y-1 p-3 bg-red-50 rounded-lg border border-red-100">
                      <p className="text-sm text-red-600 font-medium">Rejection Reason</p>
                      <p className="text-red-700">{selectedClaim.rejection_reason}</p>
                    </div>
                  )}
                  {selectedClaim.documents.length > 0 && (
                    <div className="col-span-2 space-y-1">
                      <p className="text-sm text-muted-foreground">Documents</p>
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        {selectedClaim.documents.map((doc, i) => (
                          <li key={i}>
                            <a href={doc} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              Document {i+1}
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
              Change status to <strong>{newStatus?.replace("_", " ")}</strong>{" "}
              for claim #{selectedClaim?.claim_number}
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
              disabled={
                isUpdating ||
                (newStatus === "rejected" && !rejectionReason.trim())
              }
            >
              {isUpdating ? "Updating..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
