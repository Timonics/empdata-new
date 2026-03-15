"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building2,
  Users,
  StickyNote,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Stat {
  title: string;
  value: string | number;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: React.ElementType;
  color: string;
}

const stats: Stat[] = [
  {
    title: "Total Companies",
    value: "156",
    change: "+12.5%",
    changeType: "positive",
    icon: Building2,
    color: "blue",
  },
  {
    title: "Total Employees",
    value: "2,345",
    change: "+23.1%",
    changeType: "positive",
    icon: Users,
    color: "green",
  },
  {
    title: "Pending Registrations",
    value: "28",
    change: "-4.3%",
    changeType: "negative",
    icon: Clock,
    color: "yellow",
  },
  {
    title: "Verifications Today",
    value: "142",
    change: "+8.2%",
    changeType: "positive",
    icon: ShieldCheck,
    color: "purple",
  },
];

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

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

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const colors = colorClasses[stat.color as keyof typeof colorClasses];

        return (
          <Card
            key={stat.title}
            className={cn("hover:shadow-lg transition-shadow", colors.bg)}
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
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span
                  className={cn(
                    "inline-flex items-center font-medium",
                    stat.changeType === "positive" && "text-green-600",
                    stat.changeType === "negative" && "text-red-600",
                  )}
                >
                  {stat.changeType === "positive" && (
                    <TrendingUp className="mr-1 h-3 w-3" />
                  )}
                  {stat.changeType === "negative" && (
                    <TrendingUp className="mr-1 h-3 w-3 rotate-180" />
                  )}
                  {stat.change}
                </span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
