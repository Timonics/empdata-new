"use client";

import Image from "next/image";
import Logo from "@/components/logo";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50">
      <div className="container relative min-h-screen items-center justify-center grid max-w-none lg:grid-cols-2 lg:px-0">
        {/* Left side - Brand/Info */}
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={isAdmin ? "/auth/admin-sidebar.png" : "/auth/portal-sidebar.png"}
              alt={isAdmin ? "Admin Background" : "Portal Background"}
              fill
              className="object-cover"
              priority
            />
            {/* Different overlays based on path */}
            <div 
              className={cn(
                "absolute inset-0",
                isAdmin ? "bg-blue-900/60" : "bg-emerald-900/60"
              )} 
            />
          </div>

          <div className="relative z-20 flex items-center text-lg font-medium">
            <Logo />
          </div>
          
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                "Streamline your employee data management with our comprehensive
                platform. Secure, efficient, and built for modern businesses."
              </p>
              <footer className="text-sm text-blue-100">
                Enterprise Grade Solution
              </footer>
            </blockquote>
          </div>
        </div>

        {/* Right side - Auth forms */}
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-87.5 p-4 sm:p-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}