"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Building2,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RegistrationStatsProps {
  type: "group-life" | "individual" | "corporate";
  stats?: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    change: string;
  };
}

const defaultStats = {
  "group-life": {
    total: 156,
    pending: 28,
    approved: 112,
    rejected: 16,
    change: "+12.5%",
  },
  individual: {
    total: 342,
    pending: 45,
    approved: 267,
    rejected: 30,
    change: "+18.2%",
  },
  corporate: {
    total: 89,
    pending: 12,
    approved: 68,
    rejected: 9,
    change: "+8.3%",
  },
};

const icons = {
  "group-life": Users,
  individual: User,
  corporate: Building2,
};

const titles = {
  "group-life": "Group Life",
  individual: "Individual",
  corporate: "Corporate",
};

export function RegistrationStats({
  type,
  stats = defaultStats[type],
}: RegistrationStatsProps) {
  const Icon = icons[type];
  const title = titles[type];

  const statCards = [
    {
      title: `Total ${title}`,
      value: stats.total,
      icon: Icon,
      color: "blue",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "yellow",
    },
    {
      title: "Approved",
      value: stats.approved,
      icon: CheckCircle2,
      color: "green",
    },
    {
      title: "Rejected",
      value: stats.rejected,
      icon: XCircle,
      color: "red",
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
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
              {stat.title === `Total ${title}` && (
                <div className="flex items-center gap-2 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600 font-medium">
                    {stats.change}
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
