"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Progress } from "@/components/ui/progress";
import {
  User,
  Mail,
  Phone,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Download,
  Shield,
  MapPin,
  X,
  Clock,
  AlertCircle,
  Hash,
  Building2,
  Heart,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow, format } from "date-fns";
// import {
//   useApproveEmployeeRegistration,
//   useRejectEmployeeRegistration,
//   useSendEmployeeInvitation,
// } from "@/hooks/queries/useGroupLifeEmployees";
import { toast } from "sonner";
import { useApproveEmployeeRegistration, useRejectEmployeeRegistration, useSendEmployeeInvitation } from "@/hooks/queries/useGroupLifeEmployees";

interface IndividualDrawerProps {
  registration: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "view" | "edit";
  onModeChange?: (mode: "view" | "edit") => void;
}

const statusStyles = {
  pending_approval: "bg-yellow-100 text-yellow-800 border-yellow-200",
  approved: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
};

const accountStatusStyles = {
  pending: "bg-gray-100 text-gray-800 border-gray-200",
  invited: "bg-blue-100 text-blue-800 border-blue-200",
  active: "bg-blue-100 text-blue-800 border-blue-200",
};

const verificationStatusStyles = {
  not_verified: "bg-orange-100 text-orange-800 border-orange-200",
  verified: "bg-purple-100 text-purple-800 border-purple-200",
};

export function IndividualDrawer({
  registration,
  open,
  onOpenChange,
  mode,
}: IndividualDrawerProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const approveMutation = useApproveEmployeeRegistration();
  const rejectMutation = useRejectEmployeeRegistration();
  const sendInviteMutation = useSendEmployeeInvitation();

  if (!registration) return null;

  const handleApprove = () => {
    approveMutation.mutate(registration.id, {
      onSuccess: () => {
        toast.success("Registration approved successfully");
        setShowApproveDialog(false);
      },
    });
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    rejectMutation.mutate(
      { id: registration.id, data: { rejection_reason: rejectionReason } },
      {
        onSuccess: () => {
          toast.success("Registration rejected");
          setShowRejectDialog(false);
          setRejectionReason("");
        },
      }
    );
  };

  const handleSendInvite = () => {
    sendInviteMutation.mutate(
      { id: registration.id },
      {
        onSuccess: () => {
          toast.success("Invitation sent successfully");
        },
      }
    );
  };

  const InfoRow = ({
    label,
    value,
    icon: Icon,
  }: {
    label: string;
    value: string | number | null | undefined;
    icon?: any;
  }) => (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      {Icon && <Icon className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium mt-0.5 wrap-break-word">
          {value?.toString() || "—"}
        </p>
      </div>
    </div>
  );

  const SectionCard = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="bg-gray-50 rounded-lg p-5">
      <h3 className="text-sm font-medium text-gray-700 mb-4">{title}</h3>
      <div className="space-y-1">{children}</div>
    </div>
  );

  const DocumentCard = ({
    name,
    date,
    status,
  }: {
    name: string;
    date: string;
    status?: string;
  }) => (
    <div className="flex items-center justify-between p-3 bg-white rounded-lg border hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-3 flex-1">
        <FileText className="h-5 w-5 text-blue-500" />
        <div className="flex-1">
          <p className="text-sm font-medium">{name}</p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs text-gray-500">Uploaded {date}</p>
            {status && (
              <>
                <span className="text-xs text-gray-300">•</span>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs",
                    status === "verified" &&
                      "bg-green-50 text-green-700 border-green-200",
                    status === "not_verified" &&
                      "bg-orange-50 text-orange-700 border-orange-200",
                  )}
                >
                  {status === "verified" ? "Verified" : "Pending"}
                </Badge>
              </>
            )}
          </div>
        </div>
      </div>
      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );

  const TimelineItem = ({
    icon: Icon,
    title,
    date,
    description,
    isLast = false,
  }: {
    icon: any;
    title: string;
    date?: string;
    description?: string;
    isLast?: boolean;
  }) => (
    <div className="flex gap-3">
      <div className="relative">
        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
          <Icon className="h-4 w-4 text-gray-600" />
        </div>
        {!isLast && (
          <div className="absolute top-8 left-4 h-12 w-px bg-gray-200" />
        )}
      </div>
      <div className="flex-1 pb-4">
        <p className="font-medium">{title}</p>
        {date && (
          <p className="text-sm text-gray-500">
            {format(new Date(date), "PPP p")}
          </p>
        )}
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
    </div>
  );

  // Calculate days pending
  const daysPending = Math.ceil(
    (new Date().getTime() - new Date(registration.submitted_at).getTime()) /
      (1000 * 60 * 60 * 24),
  );

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-5xl lg:max-w-6xl xl:max-w-7xl max-w-[95vw]! p-0 overflow-y-auto [&>div]:max-w-none! data-[side=right]:max-w-none!">
          {/* Header */}
          <div className="bg-linear-to-r from-blue-600 to-blue-800 text-white p-8 sticky top-0 z-20">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
                  <User className="h-8 w-8" />
                </div>
                <div>
                  <SheetTitle className="text-white text-2xl">
                    {registration.first_name} {registration.last_name}
                  </SheetTitle>
                  <p className="text-blue-100 text-sm mt-1">
                    {registration.email_address} • Submitted{" "}
                    {formatDistanceToNow(new Date(registration.submitted_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Status badges and actions */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className={cn(
                    "px-3 py-1 text-sm",
                    "bg-white/20 text-white border-white/30",
                    statusStyles[
                      registration.status as keyof typeof statusStyles
                    ],
                  )}
                >
                  {registration.status?.replace("_", " ")}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    "px-3 py-1 text-sm",
                    "bg-white/20 text-white border-white/30",
                    accountStatusStyles[
                      registration.account_status as keyof typeof accountStatusStyles
                    ],
                  )}
                >
                  {registration.account_status}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    "px-3 py-1 text-sm",
                    "bg-white/20 text-white border-white/30",
                    verificationStatusStyles[
                      registration.verification_status as keyof typeof verificationStatusStyles
                    ],
                  )}
                >
                  {registration.verification_status === "not_verified"
                    ? "Not Verified"
                    : "Verified"}
                </Badge>
              </div>

              {registration.status === "pending_approval" && (
                <div className="flex items-center gap-2">
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => setShowApproveDialog(true)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setShowRejectDialog(true)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}

              {registration.status === "approved" &&
                registration.account_status === "pending" && (
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleSendInvite}
                    // disabled={sendInviteMutation.isPending}
                  >
                    {/* {sendInviteMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : ( */}
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Invitation
                    </>
                    {/* )} */}
                  </Button>
                )}
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b px-8 sticky top-45 bg-white z-10">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="w-full justify-start h-auto p-0 bg-transparent">
                <TabsTrigger
                  value="details"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-6 py-4 text-sm font-medium"
                >
                  Details
                </TabsTrigger>
                <TabsTrigger
                  value="documents"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-6 py-4 text-sm font-medium"
                >
                  Documents
                </TabsTrigger>
                <TabsTrigger
                  value="timeline"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-6 py-4 text-sm font-medium"
                >
                  Timeline
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Content */}
          <div className="p-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              {/* Details Tab */}
              <TabsContent value="details" className="mt-0 space-y-6">
                {/* Key Statistics */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <Building2 className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">
                      {registration.company_name || "N/A"}
                    </p>
                    <p className="text-xs text-gray-600">Company</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <FileText className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">3</p>
                    <p className="text-xs text-gray-600">Documents</p>
                  </div>
                  <div className="bg-pink-50 p-4 rounded-lg text-center">
                    <Heart className="h-6 w-6 text-pink-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-xs text-gray-600">Beneficiaries</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg text-center">
                    <Clock className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{daysPending}</p>
                    <p className="text-xs text-gray-600">Days Pending</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <SectionCard title="Personal Information">
                      <InfoRow
                        label="Full Name"
                        value={`${registration.first_name || ""} ${registration.middle_name || ""} ${registration.last_name || ""}`}
                        icon={User}
                      />
                      <InfoRow
                        label="Email"
                        value={registration.email_address}
                        icon={Mail}
                      />
                      <InfoRow
                        label="Phone"
                        value={registration.phone_number}
                        icon={Phone}
                      />
                      <InfoRow
                        label="Date of Birth"
                        value={
                          registration.date_of_birth
                            ? format(
                                new Date(registration.date_of_birth),
                                "PPP",
                              )
                            : "N/A"
                        }
                        icon={Calendar}
                      />
                      <InfoRow
                        label="Gender"
                        value={registration.gender}
                        icon={User}
                      />
                      <InfoRow
                        label="Nationality"
                        value={registration.nationality}
                        icon={Shield}
                      />
                    </SectionCard>

                    <SectionCard title="Company Information">
                      <InfoRow
                        label="Company"
                        value={registration.company_name}
                        icon={Building2}
                      />
                      <InfoRow
                        label="Company ID"
                        value={registration.company_id}
                        icon={Hash}
                      />
                    </SectionCard>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <SectionCard title="Address Details">
                      <InfoRow
                        label="Country"
                        value={registration.country}
                        icon={MapPin}
                      />
                      <InfoRow
                        label="State"
                        value={registration.state}
                        icon={MapPin}
                      />
                      <InfoRow
                        label="City"
                        value={registration.city}
                        icon={MapPin}
                      />
                      <InfoRow
                        label="Address"
                        value={registration.house_address}
                        icon={MapPin}
                      />
                    </SectionCard>

                    <SectionCard title="Identity Information">
                      <InfoRow
                        label="Identity Card Type"
                        value={registration.identity_card_type}
                        icon={Shield}
                      />
                      <InfoRow
                        label="Identity Number"
                        value={registration.identity_card_number}
                        icon={Hash}
                      />
                    </SectionCard>

                    <SectionCard title="Submission Details">
                      <InfoRow
                        label="Submission Type"
                        value={registration.submission_type?.replace("_", " ")}
                        icon={FileText}
                      />
                      <InfoRow
                        label="Submitted On"
                        value={format(
                          new Date(registration.submitted_at),
                          "PPP p",
                        )}
                        icon={Calendar}
                      />
                      {registration.approved_at && (
                        <InfoRow
                          label="Approved On"
                          value={format(
                            new Date(registration.approved_at),
                            "PPP p",
                          )}
                          icon={CheckCircle}
                        />
                      )}
                      {registration.rejected_at && (
                        <InfoRow
                          label="Rejected On"
                          value={format(
                            new Date(registration.rejected_at),
                            "PPP p",
                          )}
                          icon={XCircle}
                        />
                      )}
                      {registration.rejection_reason && (
                        <InfoRow
                          label="Rejection Reason"
                          value={registration.rejection_reason}
                          icon={AlertCircle}
                        />
                      )}
                    </SectionCard>
                  </div>
                </div>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="mt-0">
                <SectionCard title="Uploaded Documents">
                  <div className="space-y-3">
                    <DocumentCard
                      name="Identity Card"
                      date={format(
                        new Date(registration.submitted_at),
                        "MMM d, yyyy",
                      )}
                      status={registration.verification_status}
                    />
                    <DocumentCard
                      name="Passport Photograph"
                      date={format(
                        new Date(registration.submitted_at),
                        "MMM d, yyyy",
                      )}
                      status={registration.verification_status}
                    />
                    <DocumentCard
                      name="Signature"
                      date={format(
                        new Date(registration.submitted_at),
                        "MMM d, yyyy",
                      )}
                      status={registration.verification_status}
                    />
                    {registration.identity_card_type ===
                      "National Identity Number" && (
                      <DocumentCard
                        name="NIN Document"
                        date={format(
                          new Date(registration.submitted_at),
                          "MMM d, yyyy",
                        )}
                        status={registration.verification_status}
                      />
                    )}
                  </div>
                </SectionCard>
              </TabsContent>

              {/* Timeline Tab */}
              <TabsContent value="timeline" className="mt-0">
                <SectionCard title="Application Timeline">
                  <div className="space-y-4">
                    <TimelineItem
                      icon={FileText}
                      title="Application Submitted"
                      date={registration.submitted_at}
                      description={`Via ${registration.submission_type?.replace("_", " ") || "public form"}`}
                    />

                    {registration.approved_at && (
                      <TimelineItem
                        icon={CheckCircle}
                        title="Application Approved"
                        date={registration.approved_at}
                        description={
                          registration.approved_by
                            ? `By Admin #${registration.approved_by}`
                            : undefined
                        }
                      />
                    )}

                    {registration.rejected_at && (
                      <TimelineItem
                        icon={XCircle}
                        title="Application Rejected"
                        date={registration.rejected_at}
                        description={registration.rejection_reason}
                      />
                    )}

                    {registration.account_status === "invited" && (
                      <TimelineItem
                        icon={Mail}
                        title="Invitation Sent"
                        date={registration.approved_at}
                        description="Invitation email sent to employee"
                      />
                    )}

                    {registration.account_status === "active" && (
                      <TimelineItem
                        icon={User}
                        title="Account Activated"
                        description="Employee set up password and activated account"
                        isLast={true}
                      />
                    )}

                    {registration.status === "pending_approval" && (
                      <TimelineItem
                        icon={Clock}
                        title="Awaiting Review"
                        description={`Pending for ${daysPending} days`}
                        isLast={true}
                      />
                    )}
                  </div>
                </SectionCard>
              </TabsContent>
            </Tabs>
          </div>
        </SheetContent>
      </Sheet>

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
                    {registration?.first_name} {registration?.last_name}
                  </span>
                  ?
                </p>
                <p className="text-sm text-gray-600">
                  This will mark the registration as approved. You can then send
                  an invitation to the individual to create their account.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApprove}
              className="bg-green-600 hover:bg-green-700"
            >
              Approve Registration
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
                {registration?.first_name} {registration?.last_name}
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
                setRejectionReason("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectionReason.trim()}
            >
              Reject Registration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
