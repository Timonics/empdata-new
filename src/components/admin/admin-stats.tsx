"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building2,
  Users,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { cn, toFiniteNumber } from "@/lib/utils";
import { useRegistrationStatusSummary } from "@/hooks/queries/useAnalytics";

const colorClasses = {
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    iconBg: "bg-blue-100",
  },
  green: {
    bg: "bg-green-50",
    text: "text-green-600",
    iconBg: "bg-green-100",
  },
  yellow: {
    bg: "bg-yellow-50",
    text: "text-yellow-600",
    iconBg: "bg-yellow-100",
  },
  purple: {
    bg: "bg-purple-50",
    text: "text-purple-600",
    iconBg: "bg-purple-100",
  },
};

export function AdminStats() {
  const { data: summary, isLoading } = useRegistrationStatusSummary();

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
              <Skeleton className="h-3 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const company = summary?.company_registrations;
  const employee = summary?.employee_registrations;

  const pendingTotal =
    toFiniteNumber(company?.by_status?.pending_approval) +
    toFiniteNumber(employee?.by_status?.pending_approval);

  const verifiedTotal =
    toFiniteNumber(company?.by_verification_status?.verified) +
    toFiniteNumber(employee?.by_verification_status?.verified);

  const stats = [
    {
      title: "Total Companies",
      value: toFiniteNumber(company?.total),
      icon: Building2,
      color: "blue" as const,
    },
    {
      title: "Total Employees",
      value: toFiniteNumber(employee?.total),
      icon: Users,
      color: "green" as const,
    },
    {
      title: "Pending Registrations",
      value: pendingTotal,
      icon: Clock,
      color: "yellow" as const,
    },
    {
      title: "Verified",
      value: verifiedTotal,
      icon: ShieldCheck,
      color: "purple" as const,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const colors = colorClasses[stat.color];

        return (
          <Card key={stat.title} className={cn("transition-shadow hover:shadow-lift")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[13px] font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={cn("rounded-lg p-2", colors.iconBg)}>
                <stat.icon className={cn("h-4 w-4", colors.text)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="font-display text-[28px] font-semibold leading-none tracking-tight">
                {stat.value.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
