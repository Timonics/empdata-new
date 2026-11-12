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
    <div className="flex h-screen overflow-hidden bg-muted/40">
      <AdminSidebar />

      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col transition-[margin] duration-300 ease-in-out",
          isCollapsed ? "md:ml-16" : "md:ml-64",
        )}
      >
        <AdminHeader />

        <main className="flex-1 overflow-y-auto scrollbar">
          <div className="mx-auto w-full max-w-[1440px] p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
