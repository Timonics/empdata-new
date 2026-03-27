"use client";

import { useState } from "react";
import {
  Building2,
  Hash,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { VerificationModal } from "../verification-modal";

interface CacVerificationStepProps {
  rcNumber: string;
  onRcNumberChange: (value: string) => void;
  onCompanyNameChange: (value: string) => void;
  onVerificationComplete: (
    status: "verified" | "pending_admin",
    data?: any,
  ) => void;
  verificationStatus?: "verified" | "pending_admin" | null;
  verificationData?: any;
}

export function CacVerificationStep({
  rcNumber,
  onRcNumberChange,
  onCompanyNameChange,
  onVerificationComplete,
  verificationStatus,
  verificationData,
}: CacVerificationStepProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tempVerificationData, setTempVerificationData] = useState<any>(null);
  const [verificationError, setVerificationError] = useState<string | null>(
    null,
  );
  const [hasAttemptedVerification, setHasAttemptedVerification] =
    useState(false);

  const handleVerify = async () => {
    if (!rcNumber) {
      alert("Please enter RC Number");
      return;
    }

    setIsVerifying(true);
    setVerificationError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const isSuccess = Math.random() > 0.3;

      if (isSuccess) {
        const dummyVerificationData = {
          company_name: "ABC Company Ltd",
          rc_number: rcNumber,
          address: "123 Business Avenue, Lagos, Nigeria",
          registration_date: "2020-01-15",
          status: "Active",
          verification_id: `CAC-${Date.now()}`,
        };
        setTempVerificationData(dummyVerificationData);
        setShowModal(true);
      } else {
        setVerificationError(
          "Unable to verify RC Number. The CAC verification service is currently unavailable.",
        );
        setHasAttemptedVerification(true);
      }
    } catch (error) {
      console.error("CAC verification failed:", error);
      setVerificationError(
        "Verification service is unavailable. Please continue and an admin will verify your details.",
      );
      setHasAttemptedVerification(true);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleConfirmVerification = () => {
    if (tempVerificationData?.company_name) {
      onCompanyNameChange(tempVerificationData.company_name);
    }
    onVerificationComplete("verified", tempVerificationData);
    setShowModal(false);
  };

  const handleSkipVerification = () => {
    onVerificationComplete("pending_admin", { rc_number: rcNumber });
  };

  const getVerificationBadge = () => {
    if (verificationStatus === "verified") {
      return (
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Verified
        </Badge>
      );
    }
    if (verificationStatus === "pending_admin") {
      return (
        <Badge className="bg-yellow-100 text-yellow-800">
          <AlertCircle className="h-3 w-3 mr-1" />
          Pending Admin Review
        </Badge>
      );
    }
    return null;
  };

  const isVerificationComplete =
    verificationStatus === "verified" || verificationStatus === "pending_admin";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">CAC Verification</h4>
        {getVerificationBadge()}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            RC Number <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={rcNumber}
                onChange={(e) => {
                  onRcNumberChange(e.target.value);
                  if (verificationStatus) {
                    onVerificationComplete(null as any, null);
                  }
                  setVerificationError(null);
                  setHasAttemptedVerification(false);
                }}
                placeholder="Enter RC Number"
                className={cn(
                  "w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                  verificationStatus === "verified" &&
                    "border-green-500 bg-green-50",
                  verificationStatus === "pending_admin" &&
                    "border-yellow-500 bg-yellow-50",
                )}
              />
            </div>

            <Button
              onClick={handleVerify}
              disabled={isVerifying || verificationStatus === "verified"}
              variant="outline"
              className="px-6 my-auto"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : verificationStatus === "verified" ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Verified
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Verify
                </>
              )}
            </Button>
          </div>
        </div>
        {/* Note about auto-fill */}
        {/* <div className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-lg">
          <Building2 className="h-4 w-4 inline mr-2 text-gray-500" />
          Company name will be automatically filled after successful verification
        </div> */}
      </div>

      {verificationError && !isVerificationComplete && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            {verificationError}
            <Button
              variant="link"
              size="sm"
              onClick={handleSkipVerification}
              className="text-yellow-800 underline p-0 h-auto ml-2"
            >
              Continue anyway
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <p className="text-xs text-gray-500">
        Your RC Number will be verified against CAC records. If verification
        fails, an admin will review your details.
      </p>

      <VerificationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmVerification}
        type="cac"
        verificationData={tempVerificationData}
        userData={{ company_name: "" }}
        isLoading={isVerifying}
      />
    </div>
  );
}
