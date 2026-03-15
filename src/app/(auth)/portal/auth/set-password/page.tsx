import { Metadata } from "next";
import { Suspense } from "react";
import { SetPasswordForm } from "@/components/auth/set-password-form";

export const metadata: Metadata = {
  title: "Set Password - EMPDATA",
  description: "Set your password to activate your account",
};

export default function SetPasswordPage() {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight bg-linear-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
          Set Your Password
        </h1>
        <p className="text-sm text-muted-foreground">
          Create a secure password to activate your account
        </p>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <SetPasswordForm />
      </Suspense>
    </div>
  );
}
