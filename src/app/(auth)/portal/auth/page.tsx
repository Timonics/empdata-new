import { Metadata } from "next";
import { PortalLoginForm } from "@/components/auth/portal-login-form";

export const metadata: Metadata = {
  title: "Portal Login - EMPDATA",
  description: "Sign in to your company or employee portal",
};

export default function PortalLoginPage() {
  return (
    <>
      <PortalLoginForm />
    </>
  );
}
