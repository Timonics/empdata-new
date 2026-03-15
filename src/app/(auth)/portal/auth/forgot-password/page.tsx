import { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Company Forgot Password - EMPDATA",
  description: "Reset your company portal password",
};

export default function CompanyForgotPasswordPage() {
  return (
    <>
      <ForgotPasswordForm role="company" />
    </>
  );
}
