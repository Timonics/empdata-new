// components/admin/verifications/verification-modal.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  User,
  Calendar,
  MapPin,
  Building2,
  Hash,
  Mail,
  Phone,
  Shield,
  FileText,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
  onReject: (reason: string) => void;
  type: "nin" | "cac";
  verificationData: any;
  userData: any;
  isLoading?: boolean;
  isSubmitting?: boolean;
  error?: string | null;
}

export function VerificationModal({
  isOpen,
  onClose,
  onApprove,
  onReject,
  type,
  verificationData,
  userData,
  isLoading = false,
  isSubmitting = false,
  error,
}: VerificationModalProps) {
  const [activeTab, setActiveTab] = useState<"compare" | "reject">("compare");
  const [rejectionReason, setRejectionReason] = useState("");
  const [matchStatus, setMatchStatus] = useState<{
    nameMatch: boolean;
    dobMatch: boolean;
    emailMatch?: boolean;
    phoneMatch?: boolean;
    companyNameMatch?: boolean;
    rcNumberMatch?: boolean;
  }>({
    nameMatch: false,
    dobMatch: false,
  });

  useEffect(() => {
    if (verificationData && userData) {
      if (type === "nin") {
        // Compare NIN data with user data
        const verificationName = `${verificationData.first_name || ""} ${verificationData.last_name || ""}`.toLowerCase();
        const userName = `${userData.first_name || ""} ${userData.last_name || ""}`.toLowerCase();
        const nameMatch =
          verificationName === userName ||
          verificationData.first_name?.toLowerCase() ===
            userData.first_name?.toLowerCase();

        const verificationDob = verificationData.date_of_birth;
        const userDob = userData.date_of_birth;
        const dobMatch = verificationDob === userDob;

        const emailMatch =
          verificationData.email?.toLowerCase() ===
          userData.email?.toLowerCase();
        const phoneMatch = verificationData.phone === userData.phone;

        setMatchStatus({ nameMatch, dobMatch, emailMatch, phoneMatch });
      } else if (type === "cac") {
        // Compare CAC data with company data
        const companyNameMatch =
          verificationData.company_name?.toLowerCase() ===
          userData.company_name?.toLowerCase();
        const rcNumberMatch = verificationData.rc_number === userData.rc_number;

        setMatchStatus({ companyNameMatch, rcNumberMatch, nameMatch: false, dobMatch: false });
      }
    }
  }, [verificationData, userData, type]);

  const allMatch =
    type === "nin"
      ? matchStatus.nameMatch && matchStatus.dobMatch
      : type === "cac"
      ? matchStatus.companyNameMatch && matchStatus.rcNumberMatch
      : true;

  const hasVerificationData = verificationData !== null && verificationData !== undefined;

  const handleRejectSubmit = () => {
    if (!rejectionReason.trim()) {
      return;
    }
    onReject(rejectionReason);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === "nin" ? (
              <>
                <Shield className="h-5 w-5 text-blue-600" />
                NIN Verification
              </>
            ) : (
              <>
                <Building2 className="h-5 w-5 text-purple-600" />
                CAC Verification
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {type === "nin"
              ? "Review the NIN data against the user's submitted information"
              : "Review the CAC data against the company's submitted information"}
          </DialogDescription>
        </DialogHeader>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="mt-4 text-sm text-gray-600">
              {type === "nin" 
                ? "Fetching official NIN records..." 
                : "Fetching official CAC records..."}
            </p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && !hasVerificationData && (
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Unable to Fetch {type === "nin" ? "NIN" : "CAC"} Record
            </h3>
            <p className="text-sm text-gray-600 text-center max-w-md">{error}</p>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={onApprove}
                className="bg-green-600 hover:bg-green-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Approve Manually
                  </>
                )}
              </Button>
              <Button
                onClick={() => setActiveTab("reject")}
                variant="destructive"
              >
                Reject
              </Button>
            </div>
          </div>
        )}

        {/* Success State - Show Comparison */}
        {!isLoading && hasVerificationData && !error && (
          <>
            {/* Tabs */}
            <div className="flex border-b mb-4">
              <button
                onClick={() => setActiveTab("compare")}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors relative",
                  activeTab === "compare"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                Compare Details
              </button>
              <button
                onClick={() => setActiveTab("reject")}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors relative",
                  activeTab === "reject"
                    ? "text-red-600 border-b-2 border-red-600"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                Reject
              </button>
            </div>

            {/* Compare Tab */}
            {activeTab === "compare" && (
              <>
                {/* Verification Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* Official Records */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-blue-600" />
                      {type === "nin" ? "Official NIN Records" : "Official CAC Records"}
                    </h4>
                    <div className="space-y-2">
                      {type === "nin" ? (
                        <>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Full Name:</span>
                            <span className="font-medium">
                              {verificationData?.first_name} {verificationData?.last_name}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Date of Birth:</span>
                            <span className="font-medium">
                              {verificationData?.date_of_birth}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Gender:</span>
                            <span className="font-medium">
                              {verificationData?.gender || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">NIN:</span>
                            <code className="font-mono text-sm">
                              {verificationData?.nin}
                            </code>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Company Name:</span>
                            <span className="font-medium">
                              {verificationData?.company_name}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">RC Number:</span>
                            <code className="font-mono text-sm">
                              {verificationData?.rc_number}
                            </code>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Address:</span>
                            <span className="font-medium">
                              {verificationData?.address}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Registration Date:</span>
                            <span className="font-medium">
                              {verificationData?.registration_date}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Status:</span>
                            <Badge className="bg-green-100 text-green-800">
                              {verificationData?.status}
                            </Badge>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* User Submitted Data */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <User className="h-4 w-4 text-green-600" />
                      Submitted Information
                    </h4>
                    <div className="space-y-2">
                      {type === "nin" ? (
                        <>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Full Name:</span>
                            <span className="font-medium">
                              {userData?.first_name} {userData?.last_name}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Date of Birth:</span>
                            <span className="font-medium">
                              {userData?.date_of_birth}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Email:</span>
                            <span className="font-medium">{userData?.email}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Phone:</span>
                            <span className="font-medium">{userData?.phone}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Company Name:</span>
                            <span className="font-medium">
                              {userData?.company_name}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">RC Number:</span>
                            <code className="font-mono text-sm">
                              {userData?.rc_number}
                            </code>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Email:</span>
                            <span className="font-medium">{userData?.email}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Phone:</span>
                            <span className="font-medium">{userData?.phone}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Address:</span>
                            <span className="font-medium">
                              {userData?.house_address}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Match Status */}
                <div className="bg-white border rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Verification Match Status
                  </h4>
                  <div className="space-y-3">
                    {type === "nin" ? (
                      <>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Name Match:</span>
                          {matchStatus.nameMatch ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Matches
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="bg-red-100 text-red-800">
                              <XCircle className="h-3 w-3 mr-1" />
                              Mismatch
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Date of Birth Match:</span>
                          {matchStatus.dobMatch ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Matches
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="bg-red-100 text-red-800">
                              <XCircle className="h-3 w-3 mr-1" />
                              Mismatch
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Email Match:</span>
                          {matchStatus.emailMatch ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Matches
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-gray-500">
                              <XCircle className="h-3 w-3 mr-1" />
                              Not Provided
                            </Badge>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Company Name Match:</span>
                          {matchStatus.companyNameMatch ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Matches
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="bg-red-100 text-red-800">
                              <XCircle className="h-3 w-3 mr-1" />
                              Mismatch
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">RC Number Match:</span>
                          {matchStatus.rcNumberMatch ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Matches
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="bg-red-100 text-red-800">
                              <XCircle className="h-3 w-3 mr-1" />
                              Mismatch
                            </Badge>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Warning Message */}
                {!allMatch && (
                  <div className="bg-amber-50 rounded-lg p-3 flex items-start gap-2 mb-6">
                    <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                    <p className="text-sm text-amber-800">
                      {type === "nin"
                        ? "Some information doesn't match the official NIN records. Please verify with the user or reject if the information is incorrect."
                        : "Some company information doesn't match CAC records. Please verify with the company or reject if the information is incorrect."}
                    </p>
                  </div>
                )}

                <DialogFooter className="flex gap-2">
                  <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button
                    onClick={onApprove}
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Approving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Approve & Verify
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </>
            )}

            {/* Reject Tab */}
            {activeTab === "reject" && (
              <>
                <div className="space-y-4 py-4">
                  <div className="bg-red-50 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-800">
                          Rejection Reason
                        </p>
                        <p className="text-xs text-red-700 mt-1">
                          This reason will be sent to the user. Please be
                          specific about what needs to be corrected.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Textarea
                    placeholder="Enter rejection reason (required)..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={5}
                    className="resize-none"
                  />

                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-2">
                      Suggested rejection reasons:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {type === "nin" ? (
                        <>
                          <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-gray-200"
                            onClick={() =>
                              setRejectionReason(
                                "NIN number does not match the provided name"
                              )
                            }
                          >
                            Name mismatch
                          </Badge>
                          <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-gray-200"
                            onClick={() =>
                              setRejectionReason(
                                "Date of birth does not match NIN records"
                              )
                            }
                          >
                            DOB mismatch
                          </Badge>
                          <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-gray-200"
                            onClick={() =>
                              setRejectionReason(
                                "NIN document is unclear or invalid"
                              )
                            }
                          >
                            Unclear document
                          </Badge>
                          <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-gray-200"
                            onClick={() =>
                              setRejectionReason(
                                "NIN verification service unavailable - manual review required"
                              )
                            }
                          >
                            Service unavailable
                          </Badge>
                        </>
                      ) : (
                        <>
                          <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-gray-200"
                            onClick={() =>
                              setRejectionReason(
                                "RC Number does not exist in CAC records"
                              )
                            }
                          >
                            Invalid RC Number
                          </Badge>
                          <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-gray-200"
                            onClick={() =>
                              setRejectionReason(
                                "Company name does not match CAC records"
                              )
                            }
                          >
                            Name mismatch
                          </Badge>
                          <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-gray-200"
                            onClick={() =>
                              setRejectionReason(
                                "CAC document is incomplete or invalid"
                              )
                            }
                          >
                            Invalid document
                          </Badge>
                          <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-gray-200"
                            onClick={() =>
                              setRejectionReason(
                                "CAC verification service unavailable - manual review required"
                              )
                            }
                          >
                            Service unavailable
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <DialogFooter className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("compare")}
                    disabled={isSubmitting}
                  >
                    Back to Compare
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleRejectSubmit}
                    disabled={isSubmitting || !rejectionReason.trim()}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Rejecting...
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}