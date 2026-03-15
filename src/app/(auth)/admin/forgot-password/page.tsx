import { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Admin Forgot Password - EMPDATA",
  description: "Reset your administrator password",
};

export default function AdminForgotPasswordPage() {
  return (
    <>
      <ForgotPasswordForm role="admin" />
    </>
  );
}
