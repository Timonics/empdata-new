"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Building2,
  ShieldCheck,
  ShieldX,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRegistrationStatusSummary } from "@/hooks/queries/useAnalytics";

export function GroupLifeStats() {
  const { data, isLoading, error } = useRegistrationStatusSummary();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
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

  // Safely extract company registration data with optional chaining
  const companyData = data?.company_registrations;
  const total = companyData?.total ?? 0;
  const pending = companyData?.by_status?.pending_approval ?? 0;
  const approved = companyData?.by_status?.approved ?? 0;
  const rejected = companyData?.by_status?.rejected ?? 0;
  const verified = companyData?.by_verification_status?.verified ?? 0;
  const notVerified = companyData?.by_verification_status?.not_verified ?? 0;

  // Calculate change safely
  const employeeTotal = data?.employee_registrations?.total ?? 0;
  const changeValue = total - employeeTotal;
  const change = (changeValue / 100).toFixed(1);
  const changePrefix = Number(change) >= 0 ? "+" : "";

  const statCards = [
    {
      title: "Total Companies",
      value: total,
      icon: Building2,
      color: "blue",
      change: total > 0 ? `${changePrefix}${change}%` : "0%",
    },
    {
      title: "Pending Approval",
      value: pending,
      icon: Clock,
      color: "yellow",
    },
    {
      title: "Approved",
      value: approved,
      icon: CheckCircle2,
      color: "green",
    },
    {
      title: "Rejected",
      value: rejected,
      icon: XCircle,
      color: "red",
    },
    {
      title: "Verified Documents",
      value: verified,
      icon: ShieldCheck,
      color: "purple",
    },
    {
      title: "Pending Verification",
      value: notVerified,
      icon: ShieldX,
      color: "orange",
    },
  ];

  const colorClasses = {
    blue: { bg: "bg-blue-50", text: "text-blue-600", iconBg: "bg-blue-100" },
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
    red: { bg: "bg-red-50", text: "text-red-600", iconBg: "bg-red-100" },
    purple: {
      bg: "bg-purple-50",
      text: "text-purple-600",
      iconBg: "bg-purple-100",
    },
    orange: {
      bg: "bg-orange-50",
      text: "text-orange-600",
      iconBg: "bg-orange-100",
    },
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {statCards.map((stat) => {
        const colors = colorClasses[stat.color as keyof typeof colorClasses];

        return (
          <Card key={stat.title} className={cn("hover:shadow-lg transition-shadow", colors.bg)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={cn("rounded-lg p-1.5", colors.iconBg)}>
                <stat.icon className={cn("h-3.5 w-3.5", colors.text)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">
                {typeof stat.value === "number"
                  ? stat.value.toLocaleString()
                  : stat.value}
              </div>
              {stat.title === "Total Companies" && stat.change && (
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600 font-medium">
                    {stat.change}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    vs last month
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
