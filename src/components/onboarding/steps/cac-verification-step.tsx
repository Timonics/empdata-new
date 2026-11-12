"use client";

import { useState } from "react";
import {
  Hash,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { VerificationModal } from "../verification-modal";
import { VerificationService } from "@/services/verification.service";

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

const COMPANY_TYPES = [
  { value: "COMPANY", label: "Company" },
  { value: "BUSINESS_NAME", label: "Business Name" },
  { value: "INCORPORATED_TRUSTEES", label: "Incorporated Trustees" },
  { value: "LIMITED_PARTNERSHIP", label: "Limited Partnership" },
  { value: "LIMITED_LIABILITY_PARTNERSHIP", label: "LLP" },
];

export function CacVerificationStep({
  rcNumber,
  onRcNumberChange,
  onCompanyNameChange,
  onVerificationComplete,
  verificationStatus,
}: CacVerificationStepProps) {
  const [companyType, setCompanyType] = useState("COMPANY");
  const [isVerifying, setIsVerifying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tempVerificationData, setTempVerificationData] = useState<any>(null);
  const [verificationError, setVerificationError] = useState<string | null>(
    null,
  );

  const handleVerify = async () => {
    // Backend expects digits only — strip any "RC" prefix and non-digits
    const digitsOnly = rcNumber.replace(/\D/g, "");
    if (!digitsOnly) {
      setVerificationError("Please enter a valid RC number.");
      return;
    }
    if (digitsOnly !== rcNumber) {
      onRcNumberChange(digitsOnly);
    }

    setIsVerifying(true);
    setVerificationError(null);

    try {
      const response = await VerificationService.verifyPublicCAC({
        rc_number: digitsOnly,
        company_type: companyType,
      });

      if (response.success && response.data) {
        setTempVerificationData(response.data);
        setShowModal(true);
      } else {
        setVerificationError(
          response.message ||
            "Company not found. Please check the RC number and company type.",
        );
      }
    } catch (error: any) {
      const body = error?.response?.data;
      setVerificationError(
        body?.message ||
          "CAC verification service is currently unavailable. You can continue and an admin will verify your details.",
      );
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
    verificationStatus === "verified" ||
    verificationStatus === "pending_admin";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-foreground">CAC Verification</h4>
        {getVerificationBadge()}
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">
              Company Type <span className="text-red-500">*</span>
            </label>
            <Select value={companyType} onValueChange={setCompanyType}>
              <SelectTrigger>
                <SelectValue placeholder="Select company type" />
              </SelectTrigger>
              <SelectContent>
                {COMPANY_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">
              RC Number <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70" />
                <input
                  type="text"
                  value={rcNumber}
                  onChange={(e) => {
                    onRcNumberChange(e.target.value.replace(/\D/g, ""));
                    if (verificationStatus) {
                      onVerificationComplete(null as any, null);
                    }
                    setVerificationError(null);
                  }}
                  placeholder="Digits only, e.g. 1261103"
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
                disabled={
                  isVerifying || verificationStatus === "verified" || !rcNumber
                }
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
        </div>
      </div>

      {verificationError && !isVerificationComplete && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            {verificationError}
            {verificationError.includes("company type") && (
              <span className="block mt-1 text-xs">
                Tip: if the RC number is correct, try a different company type
                above and verify again.
              </span>
            )}
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

      <p className="text-xs text-muted-foreground">
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
