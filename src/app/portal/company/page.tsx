"use client";

import { QuickActions } from "@/components/admin/quick-actions";
import { CompanyOverview } from "@/components/company/company-overview";
import { CompanyStats } from "@/components/company/company-stats";
import { PendingInvitations } from "@/components/company/pending-invitations";
import { RecentEmployees } from "@/components/company/recent-employees";
import { useCompanyProfile } from "@/hooks/queries/usePortalDashboard";

export default function CompanyDashboardPage() {
  const { data: company, isLoading } = useCompanyProfile();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome back, {isLoading ? "..." : company?.name || "Company"}
        </h2>
        <p className="text-muted-foreground">
          Here's what's happening with your organization today.
        </p>
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
        <div className="lg:col-span-2">
          <CompanyOverview />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
