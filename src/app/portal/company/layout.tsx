"use client"

import { CompanyHeader } from "@/components/company/company-header";
import { CompanySidebar } from "@/components/company/company-sidebar";
import { useSidebar } from "@/contexts/sidebar-context";
import { cn } from "@/lib/utils";

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // requireRole("company")
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex h-screen overflow-hidden bg-muted/40">
      <CompanySidebar />

      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col transition-[margin] duration-300 ease-in-out",
          isCollapsed ? "md:ml-16" : "md:ml-64",
        )}
      >
        <CompanyHeader />

        <main className="flex-1 overflow-y-auto scrollbar">
          <div className="mx-auto w-full max-w-[1440px] p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
