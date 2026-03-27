// components/onboarding/nin-verification-step.tsx
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
import { VerificationModal } from "../verification-modal";
import { cn } from "@/lib/utils";
import { usePublicVerifyNIN } from "@/hooks/queries/useVerifications";
import { EncryptionService } from "@/lib/encryption";

interface NinVerificationStepProps {
  value: string;
  onChange: (value: string) => void;
  onVerificationComplete: (
    status: "verified" | "pending_admin",
    data?: any,
  ) => void;
  userData: any;
  verificationStatus?: "verified" | "pending_admin" | null;
  verificationData?: any;
  label?: string;
}

export function NinVerificationStep({
  value,
  onChange,
  onVerificationComplete,
  userData,
  verificationStatus,
  verificationData,
  label = "NIN (National Identification Number)",
}: NinVerificationStepProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tempVerificationData, setTempVerificationData] = useState<any>(null);
  const [verificationError, setVerificationError] = useState<string | null>(
    null,
  );

  const verifyMutation = usePublicVerifyNIN();

  const handleVerify = async () => {
    if (!value || value.length !== 11) {
      alert("Please enter a valid 11-digit NIN");
      return;
    }

    setIsVerifying(true);
    setVerificationError(null);

    try {
      const publicKey = await EncryptionService.getPublicKey();

      if (!publicKey) {
        throw new Error("Could not retrieve encryption key");
      }

      const encryptedNIN = await EncryptionService.encryptNin(publicKey, value);

      const response = await verifyMutation.mutateAsync(encryptedNIN);

      if (response.success && response.data) {
        // SUCCESS: Verification passed
        const verificationData = {
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          date_of_birth: response.data.date_of_birth,
          gender: response.data.gender,
          nin: value,
        };

        setTempVerificationData(verificationData);
        setShowModal(true);
      } else {
        // FAILURE: Verification failed - store as pending_admin
        setVerificationError(
          response.message ||
            "Unable to verify NIN. You can continue and an admin will verify your details later.",
        );
        // Auto-mark as pending_admin so user can continue
        onVerificationComplete("pending_admin", { nin: value });
      }
    } catch (error: any) {
      console.error("Verification failed:", error);

      let errorMessage =
        "Verification service is unavailable. Please continue and an admin will verify your details.";

      if (
        error.message?.includes("public key") ||
        error.message?.includes("encryption")
      ) {
        errorMessage =
          "Unable to encrypt NIN. Please check your connection and try again.";
      } else if (error.message?.includes("timeout")) {
        errorMessage =
          "Verification request timed out. Please check your internet connection and try again.";
      }

      setVerificationError(errorMessage);
      // Auto-mark as pending_admin so user can continue
      onVerificationComplete("pending_admin", { nin: value });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleConfirmVerification = () => {
    onVerificationComplete("verified", tempVerificationData);
    setShowModal(false);
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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          {label} <span className="text-red-500">*</span>
        </label>
        {getVerificationBadge()}
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            maxLength={11}
            value={value}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "");
              onChange(val);
              if (verificationStatus) {
                onVerificationComplete(null as any, null);
              }
              setVerificationError(null);
            }}
            placeholder="Enter 11-digit NIN"
            className={cn(
              "w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              verificationStatus === "verified" &&
                "border-green-500 bg-green-50",
              verificationStatus === "pending_admin" &&
                "border-yellow-500 bg-yellow-50",
            )}
            disabled={verificationStatus === "verified"}
          />
        </div>

        <Button
          onClick={handleVerify}
          disabled={isVerifying || verificationStatus === "verified"}
          variant="outline"
          className="px-6 my-auto min-w-[100px]"
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

      {/* Error Message without "Continue anyway" button - auto-continue */}
      {verificationError && !isVerificationComplete && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            {verificationError}
          </AlertDescription>
        </Alert>
      )}

      <p className="text-xs text-gray-500">
        Your NIN will be encrypted and verified against official records. If
        verification fails, an admin will review your details.
      </p>

      <VerificationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmVerification}
        type="nin"
        verificationData={tempVerificationData}
        userData={userData}
        isLoading={isVerifying}
      />
    </div>
  );
}
