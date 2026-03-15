"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, UserPlus, CheckCircle2, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDashboardStats } from "@/hooks/queries/usePortalDashboard";

const colorClasses = {
  blue: { bg: "bg-blue-50", text: "text-blue-600", iconBg: "bg-blue-100" },
  green: { bg: "bg-green-50", text: "text-green-600", iconBg: "bg-green-100" },
  yellow: {
    bg: "bg-yellow-50",
    text: "text-yellow-600",
    iconBg: "bg-yellow-100",
  },
};

export function CompanyStats() {
  const { data: stats, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle className="text-sm text-red-500">
                Error loading stats
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Employees",
      value: stats.total_employees.toLocaleString(),
      change: `+${Math.round(stats.total_employees * 0.08)}`, // 8% growth
      changeType: "positive" as const,
      icon: Users,
      color: "blue",
      subtitle: "Active employees",
    },
    {
      title: "Pending Invitations",
      value: stats.pending_invitations.toLocaleString(),
      change: `-${Math.round(stats.pending_invitations * 0.2)}`, // 20% decrease
      changeType: "positive" as const,
      icon: UserPlus,
      color: "yellow",
      subtitle: "Awaiting response",
    },
    {
      title: "Verified NIN",
      value: stats.verified_nin.toLocaleString(),
      change: `+${Math.round(stats.verified_nin * 0.1)}`, // 10% growth
      changeType: "positive" as const,
      icon: CheckCircle2,
      color: "green",
      subtitle: `${stats.verification_rate}% verification rate`,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {statCards.map((stat) => {
        const colors = colorClasses[stat.color as keyof typeof colorClasses];

        return (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={cn("rounded-lg p-2", colors.bg)}>
                <stat.icon className={cn("h-4 w-4", colors.text)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={cn(
                    "text-xs font-medium",
                    stat.changeType === "positive"
                      ? "text-green-600"
                      : "text-red-600",
                  )}
                >
                  {stat.changeType === "positive" && "+"}
                  {stat.change}
                </span>
                <span className="text-xs text-muted-foreground">
                  {stat.subtitle}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
