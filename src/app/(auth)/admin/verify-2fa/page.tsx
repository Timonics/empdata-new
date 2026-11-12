import { Metadata } from "next";
import { Suspense } from "react";
import { AdminVerify2FAForm } from "@/components/auth/admin-verify-2fa-form";

export const metadata: Metadata = {
  title: "Verify 2FA - Admin",
  description: "Complete two-factor authentication",
};

export default function AdminVerify2FAPage() {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
          Two-Factor Authentication
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter the verification code sent to your email
        </p>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <AdminVerify2FAForm />
      </Suspense>
    </div>
  );
}
