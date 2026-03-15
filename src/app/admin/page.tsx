import { Metadata } from "next";
import { AdminStats } from "@/components/admin/admin-stats";
import { MonthlyTrends } from "@/components/admin/charts/monthly-trends";
import { RegistrationDistribution } from "@/components/admin/charts/registration-distribution";
import { CompanyGrowth } from "@/components/admin/charts/company-growth";
import { VerificationPerformance } from "@/components/admin/charts/verification-performance";
import { RecentRegistrations } from "@/components/admin/recent-registrations";
import { QuickActions } from "@/components/admin/quick-actions";

export const metadata: Metadata = {
  title: "Dashboard - EMPDATA Admin",
  description: "Admin dashboard overview with analytics",
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome back, Admin
        </h2>
        <p className="text-muted-foreground">
          Here's what's happening with your platform today.
        </p>
      </div>

      {/* Stats Cards */}
      <AdminStats />

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-3">
        <MonthlyTrends />
        <RegistrationDistribution />
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <CompanyGrowth />
        <VerificationPerformance />
      </div>

      {/* Charts Row 3 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* <TopIndustries /> */}
        <RecentRegistrations />
        <QuickActions />
      </div>
    </div>
  );
}
