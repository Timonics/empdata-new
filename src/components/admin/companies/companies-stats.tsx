"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building2,
  Users,
  Clock,
  ShieldX,
} from "lucide-react";
import { cn, toFiniteNumber } from "@/lib/utils";
import { useCompanies } from "@/hooks/queries/useCompanies";
import { useRegistrationStatusSummary } from "@/hooks/queries/useAnalytics";

const colorClasses = {
  blue: { bg: "bg-blue-50", text: "text-blue-600", iconBg: "bg-blue-100" },
  green: { bg: "bg-green-50", text: "text-green-600", iconBg: "bg-green-100" },
  purple: {
    bg: "bg-purple-50",
    text: "text-purple-600",
    iconBg: "bg-purple-100",
  },
  yellow: {
    bg: "bg-yellow-50",
    text: "text-yellow-600",
    iconBg: "bg-yellow-100",
  },
  indigo: {
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    iconBg: "bg-indigo-100",
  },
  red: { bg: "bg-red-50", text: "text-red-600", iconBg: "bg-red-100" },
};

export function CompaniesStats() {
  // Single fetch; counts are computed from the returned records so we
  // don't depend on pagination meta that the API may not provide.
  const { data, isLoading } = useCompanies({ per_page: 100, page: 1 });
  const { data: summary } = useRegistrationStatusSummary();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
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

  const companies: Array<{ status?: string }> = data?.data || [];

  // Prefer server-side total when the API paginates; otherwise count records
  const totalCompanies = toFiniteNumber(
    data?.pagination?.total ?? companies.length,
  );
  const activeCompanies = companies.filter(
    (c) => c?.status === "active",
  ).length;
  const pendingCompanies = companies.filter(
    (c) => c?.status === "pending" || c?.status === "pending_approval",
  ).length;
  const suspendedCompanies = companies.filter(
    (c) => c?.status === "suspended",
  ).length;
  const totalEmployees = toFiniteNumber(
    summary?.employee_registrations?.total,
  );

  const stats = [
    {
      title: "Total Companies",
      value: totalCompanies,
      icon: Building2,
      color: "blue" as const,
      subtitle: "Registered corporate clients",
    },
    {
      title: "Active Companies",
      value: activeCompanies,
      icon: Users,
      color: "green" as const,
      subtitle: "Currently active",
    },
    {
      title: "Pending Approval",
      value: pendingCompanies,
      icon: Clock,
      color: "yellow" as const,
      subtitle: "Awaiting activation",
    },
    {
      title: "Suspended",
      value: suspendedCompanies,
      icon: ShieldX,
      color: "red" as const,
      subtitle: `${totalEmployees.toLocaleString()} employees enrolled`,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const colors = colorClasses[stat.color];

        return (
          <Card
            key={stat.title}
            className={cn("transition-shadow hover:shadow-lift")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={cn("rounded-lg p-2", colors.iconBg)}>
                <stat.icon className={cn("h-4 w-4", colors.text)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stat.value.toLocaleString()}
              </div>
              <div className="flex items-center gap-2 mt-1">
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
