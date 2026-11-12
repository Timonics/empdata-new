"use client";

import { QuickActions } from "@/components/admin/quick-actions";
import { CompanyOverview } from "@/components/company/company-overview";
import { CompanyStats } from "@/components/company/company-stats";
import { PendingInvitations } from "@/components/company/pending-invitations";
import { RecentEmployees } from "@/components/company/recent-employees";
import { useCompanyProfile } from "@/hooks/queries/usePortalDashboard";
import { tokenManager } from "@/lib/token-manager";

export default function CompanyDashboardPage() {
  const name = tokenManager.getUserData().name
  const today = new Date().toLocaleDateString("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Welcome band */}
      <div className="relative overflow-hidden rounded-2xl bg-navy-900 text-white shadow-lift">
        <div className="bg-grid-faint-dark absolute inset-0 [mask-image:radial-gradient(ellipse_80%_120%_at_20%_0%,black,transparent)]" />
        <div className="absolute -top-16 right-10 size-64 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-6 px-7 py-7">
          <div>
            <p className="text-[11px] font-medium tracking-[0.18em] text-white/40 uppercase">
              {today}
            </p>
            <h2 className="mt-1.5 font-display text-2xl font-semibold tracking-tight">
              Welcome back, {name || "Company"}
            </h2>
            <p className="mt-1 text-sm text-white/50">
              Here&apos;s what&apos;s happening with your organization today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
              3 invitations pending
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <CompanyStats />

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentEmployees />
        <PendingInvitations />
      </div>

      {/* Three Column Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-full">
          <CompanyOverview />
        </div>
        <div>
          {/* <QuickActions /> */}
        </div>
      </div>
    </div>
  );
}
