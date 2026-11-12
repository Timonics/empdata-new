"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  UserCheck,
  UserX,
  ShieldCheck,
} from "lucide-react";
import { cn, toFiniteNumber } from "@/lib/utils";
import { useAdminEmployees } from "@/hooks/queries/useEmployees";

const colorClasses = {
  blue: { bg: "bg-blue-50", text: "text-blue-600", iconBg: "bg-blue-100" },
  green: { bg: "bg-green-50", text: "text-green-600", iconBg: "bg-green-100" },
  yellow: {
    bg: "bg-yellow-50",
    text: "text-yellow-600",
    iconBg: "bg-yellow-100",
  },
  red: { bg: "bg-red-50", text: "text-red-600", iconBg: "bg-red-100" },
};

export function EmployeesStats() {
  // Single fetch; counts computed from returned records so the cards
  // work whether or not the API provides pagination meta.
  const { data: allData, isLoading } = useAdminEmployees({
    per_page: 100,
    page: 1,
  });

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

  interface EmployeeRecord {
    employment_status?: string;
    nin_verification?: { is_nin_verified?: boolean };
  }
  const employees: EmployeeRecord[] = allData?.data || [];

  const total = toFiniteNumber(
    allData?.pagination?.total ?? employees.length,
  );
  const verified = employees.filter(
    (e) => e?.nin_verification?.is_nin_verified,
  ).length;
  const inactive = employees.filter(
    (e) => e?.employment_status === "inactive",
  ).length;
  const active = employees.filter(
    (e) => e?.employment_status === "active",
  ).length;
  const pending = Math.max(0, total - verified);

  const stats = [
    {
      title: "Total Employees",
      value: total,
      icon: Users,
      color: "blue" as const,
      subtitle: "Across all companies",
    },
    {
      title: "Verified NIN",
      value: verified,
      icon: UserCheck,
      color: "green" as const,
      subtitle:
        total > 0
          ? `${((verified / total) * 100).toFixed(1)}% verification rate`
          : "No employees yet",
    },
    {
      title: "Pending Verification",
      value: pending,
      icon: ShieldCheck,
      color: "yellow" as const,
      subtitle: "Awaiting NIN verification",
    },
    {
      title: "Inactive",
      value: inactive,
      icon: UserX,
      color: "red" as const,
      subtitle: `${active.toLocaleString()} active employees`,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
