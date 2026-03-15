import { Metadata } from "next";
import { Suspense } from "react";
import { PortalVerify2FAForm } from "@/components/auth/portal-verify-2fa-form";

export const metadata: Metadata = {
  title: "Verify 2FA - Portal",
  description: "Complete two-factor authentication",
};

export default function PortalVerify2FAPage() {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight bg-linear-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
          Two-Factor Authentication
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter the verification code sent to your email
        </p>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <PortalVerify2FAForm />
      </Suspense>
    </div>
  );
}
