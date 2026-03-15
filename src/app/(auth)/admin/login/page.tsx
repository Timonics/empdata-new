import { Metadata } from "next";
import { AdminLoginForm } from "@/components/auth/admin-login-form";

export const metadata: Metadata = {
  title: "Admin Login - EMPDATA",
  description: "Sign in to your administrator account",
};

export default function AdminLoginPage() {
  return (
    <>
      <AdminLoginForm />
    </>
  );
}
