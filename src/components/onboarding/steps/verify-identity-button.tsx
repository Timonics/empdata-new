"use client";

import { useState } from "react";
import { ShieldCheck, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EncryptionService } from "@/lib/encryption";
import { usePublicVerifyNIN } from "@/hooks/queries/useVerifications";
import { VerificationService } from "@/services/verification.service";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface VerifyIdentityButtonProps {
  type: "nin" | "bvn";
  /** The raw 11-digit value from the input */
  value: string;
  /** Called with the verification record on success */
  onVerified?: (data: Record<string, any>) => void;
  className?: string;
}

interface VerifyResult {
  ok: boolean;
  title: string;
  lines: string[];
}

/**
 * Verify button for NIN / BVN fields on the onboarding form.
 * Encrypts the value with the server's RSA public key and calls the
 * public verification endpoint (nothing is stored server-side).
 * Verification is optional — the user can always continue and an
 * admin verifies later.
 */
export function VerifyIdentityButton({
  type,
  value,
  onVerified,
  className,
}: VerifyIdentityButtonProps) {
  const verifyNIN = usePublicVerifyNIN();
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const label = type === "nin" ? "NIN" : "BVN";

  const handleVerify = async () => {
    if (!value || value.length !== 11) {
      toast.error(`Please enter a valid 11-digit ${label}`);
      return;
    }

    setIsVerifying(true);
    setResult(null);

    try {
      const publicKey = await EncryptionService.getPublicKey();
      if (!publicKey) throw new Error("Could not retrieve encryption key");

      if (type === "nin") {
        const { encrypted_nin } = await EncryptionService.encryptNin(
          publicKey,
          value,
        );
        const response = await verifyNIN.mutateAsync({ encrypted_nin });

        if (response.success && response.data) {
          const d = response.data;
          setResult({
            ok: true,
            title: `${label} verified`,
            lines: [
              [d.first_name, d.middle_name, d.last_name]
                .filter(Boolean)
                .join(" "),
              d.date_of_birth ? `DOB: ${d.date_of_birth}` : "",
              d.gender ? `Gender: ${d.gender}` : "",
            ].filter(Boolean),
          });
          onVerified?.(d);
        } else {
          setResult({
            ok: false,
            title: `${label} could not be verified`,
            lines: [
              response.message ||
                "This record was not found. You can continue and our team will verify it during review.",
            ],
          });
        }
      } else {
        const { encrypted_bvn } = await EncryptionService.encryptBvn(
          publicKey,
          value,
        );
        const response = await VerificationService.verifyPublicBVN({
          encrypted_bvn,
        });

        if (response.success && response.data) {
          const d = response.data;
          setResult({
            ok: true,
            title: `${label} verified`,
            lines: [
              [d.first_name, d.middle_name, d.last_name]
                .filter(Boolean)
                .join(" "),
              d.date_of_birth ? `DOB: ${d.date_of_birth}` : "",
              d.phone_number1 ? `Phone: ${d.phone_number1}` : "",
            ].filter(Boolean),
          });
          onVerified?.(d);
        } else {
          setResult({
            ok: false,
            title: `${label} could not be verified`,
            lines: [
              response.message ||
                "This record was not found. You can continue and our team will verify it during review.",
            ],
          });
        }
      }
    } catch (error: any) {
      const serviceDown = error?.response?.data?.service_down;
      setResult({
        ok: false,
        title: serviceDown
          ? "Verification service unavailable"
          : "Verification failed",
        lines: [
          error?.response?.data?.message ||
            "Please check your connection and try again, or continue and our team will verify during review.",
        ],
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Button
        type="button"
        variant="outline"
        onClick={handleVerify}
        disabled={isVerifying || !value || value.length !== 11}
        className="whitespace-nowrap"
      >
        {isVerifying ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : result?.ok ? (
          <>
            <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
            Verified
          </>
        ) : (
          <>
            <ShieldCheck className="mr-2 h-4 w-4" />
            Verify
          </>
        )}
      </Button>

      {result && (
        <div
          className={cn(
            "rounded-lg border p-3 text-xs",
            result.ok
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-yellow-200 bg-yellow-50 text-yellow-800",
          )}
        >
          <div className="flex items-start gap-2">
            {result.ok ? (
              <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            )}
            <div>
              <p className="font-medium">{result.title}</p>
              {result.lines.map((line, i) => (
                <p key={i} className="mt-0.5">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
