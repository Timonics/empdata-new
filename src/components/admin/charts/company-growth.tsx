"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Loader2 } from "lucide-react";
import { useMonthlyCompanyRegistrations } from "@/hooks/queries/useAnalytics";
import { toFiniteNumber } from "@/lib/utils";

export function CompanyGrowth() {
  const { data, isLoading, error } = useMonthlyCompanyRegistrations();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Company Growth
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-50 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">
                Loading company data...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Company Growth
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-50 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-500 mb-2">Failed to load company data</p>
              <p className="text-sm text-muted-foreground">
                Please try again later
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Transform data for the chart
  const chartData = (data?.data || []).map((item) => ({
    month: item.month,
    new: item.total, // Total new registrations for the month
    total: item.total,
    approved: item.by_status?.approved ?? 0,
    pending: item.by_status?.pending_approval ?? 0,
    rejected: item.by_status?.rejected ?? 0,
  }));

  // Use the last month that actually has registrations — the calendar
  // last month is usually empty and produced 0 totals and NaN rates
  const monthsWithData = chartData.filter((m) => toFiniteNumber(m.total) > 0);
  const lastMonth = monthsWithData[monthsWithData.length - 1] ?? null;
  const previousMonth = monthsWithData[monthsWithData.length - 2] ?? null;
  const totalCompanies = chartData.reduce(
    (sum, m) => sum + toFiniteNumber(m.total),
    0,
  );

  // Growth rate vs the previous month that had registrations;
  // null (rendered as —) when there is no prior month to compare
  const growthRate =
    lastMonth && previousMonth && toFiniteNumber(previousMonth.total) > 0
      ? (
          ((toFiniteNumber(lastMonth.total) - toFiniteNumber(previousMonth.total)) /
            toFiniteNumber(previousMonth.total)) *
          100
        ).toFixed(1)
      : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          Company Growth
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-50">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-gray-200"
              />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                formatter={
                  ((value: any, name: any) => {
                    let val = value;

                    if (Array.isArray(val)) {
                      val = val[0];
                    }

                    const num = Number(val) || 0;

                    if (name === "new") {
                      return [`${num} companies`, "New Registrations"];
                    }

                    return [num, name ?? ""];
                  }) as any
                }
              />
              <Bar dataKey="new" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.new > 10 ? "#10b981" : "#3b82f6"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Breakdown */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Approved</div>
            <div className="text-sm font-semibold text-green-600">
              {lastMonth?.approved || 0}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Pending</div>
            <div className="text-sm font-semibold text-yellow-600">
              {lastMonth?.pending || 0}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Rejected</div>
            <div className="text-sm font-semibold text-red-600">
              {lastMonth?.rejected || 0}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t pt-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Companies</p>
            <p className="text-2xl font-bold">{totalCompanies}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Growth Rate</p>
            <p
              className={`text-2xl font-bold ${Number(growthRate) >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {growthRate !== null ? `${Number(growthRate) >= 0 ? "+" : ""}${growthRate}%` : "—"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
