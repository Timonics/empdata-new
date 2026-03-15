"use client";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { useSidebar } from "@/contexts/sidebar-context";
import { cn } from "@/lib/utils";
// import { requireRole } from "@/lib/auth.guard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // requireRole("admin");
  const { isCollapsed } = useSidebar();

  return (
    <div className="w-full h-screen overflow-hidden bg-white">
      <div className="flex h-full bg-white/90 relative">
        <AdminSidebar />

        <div
          className={cn(
            "w-full transition-all duration-300 ease-in-out flex flex-col bg-sky-50/50",
            isCollapsed ? "md:ml-24" : "md:ml-55",
          )}
        >
          <AdminHeader />

          <div className="h-[calc(100vh-73px)] overflow-auto scrollbar">
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
