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
    <div className="w-full h-screen overflow-hidden bg-white">
      <div className="flex h-full bg-white/90 relative">
        <CompanySidebar />

        <div
          className={cn(
            "w-full transition-all duration-300 ease-in-out flex flex-col bg-sky-50/50",
            isCollapsed ? "md:ml-24" : "md:ml-55",
          )}
        >
          <CompanyHeader />

          <div className="overflow-auto scrollbar">
            <div
              className={`p-6 lg:p-8 ${isCollapsed ? "md:w-[calc(100vw-96px)]" : "md:w-[calc(100vw-220px)]"}`}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
