import { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Employee Forgot Password - EMPDATA",
  description: "Reset your employee portal password",
};

export default function EmployeeForgotPasswordPage() {
  return (
    <>
      <ForgotPasswordForm role="employee" />
    </>
  );
}
