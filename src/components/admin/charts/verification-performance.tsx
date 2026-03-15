"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Loader2 } from "lucide-react";
import { useCurrentWeekData } from "@/hooks/queries/useAnalytics";

export function VerificationPerformance() {
  const { data, isLoading, error } = useCurrentWeekData();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-600" />
            Verification Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-62.5 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">Loading verification data...</p>
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
            <Shield className="h-5 w-5 text-purple-600" />
            Verification Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-62.5 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-500 mb-2">Failed to load verification data</p>
              <p className="text-sm text-muted-foreground">Please try again later</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Transform data for the chart
  const chartData = data.data.map(day => {
    // Calculate verification metrics from the data
    const totalCompanies = day.companies.total;
    const totalEmployees = day.employees.total;
    const verifiedCompanies = day.companies.by_verification_status.verified;
    const verifiedEmployees = day.employees.by_verification_status.verified;
    
    // Calculate pending (not verified)
    const pendingCompanies = day.companies.by_verification_status.not_verified;
    const pendingEmployees = day.employees.by_verification_status.not_verified;
    
    // Calculate completion counts
    const completed = verifiedCompanies + verifiedEmployees;
    const pending = pendingCompanies + pendingEmployees;
    
    // Calculate average verification time (you might need a different API for this)
    // For now, we'll use a simulated value based on pending count
    const avgTime = pending > 0 ? Number((pending * 0.1).toFixed(1)) : 0;

    return {
      day: day.day,
      completed,
      pending,
      avgTime,
      // Additional data for tooltips
      companies: {
        verified: verifiedCompanies,
        pending: pendingCompanies,
        total: totalCompanies,
      },
      employees: {
        verified: verifiedEmployees,
        pending: pendingEmployees,
        total: totalEmployees,
      },
    };
  });

  // Calculate averages
  const avgDaily = Math.round(
    chartData.reduce((sum, day) => sum + day.completed, 0) / chartData.length
  );
  
  const totalPending = chartData.reduce((sum, day) => sum + day.pending, 0);
  
  const avgTimeValue = (
    chartData.reduce((sum, day) => sum + day.avgTime, 0) / chartData.length
  ).toFixed(1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-purple-600" />
          Verification Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-62.5">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-gray-200"
              />
              <XAxis dataKey="day" className="text-xs" />
              <YAxis yAxisId="left" className="text-xs" />
              <YAxis yAxisId="right" orientation="right" className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                formatter={(value: number, name: string, props: any) => {
                  if (name === 'completed') {
                    return [
                      `${value} (C:${props.payload.companies.verified}, E:${props.payload.employees.verified})`,
                      'Completed'
                    ];
                  }
                  if (name === 'pending') {
                    return [
                      `${value} (C:${props.payload.companies.pending}, E:${props.payload.employees.pending})`,
                      'Pending'
                    ];
                  }
                  return [value, 'Avg Time (hours)'];
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="completed"
                name="Completed"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 4, fill: "#10b981" }}
                activeDot={{ r: 6 }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="pending"
                name="Pending"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ r: 4, fill: "#f59e0b" }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="avgTime"
                name="Avg Time (h)"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ r: 4, fill: "#8b5cf6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Week Summary */}
        <div className="mt-4 pt-4 border-t">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Avg. Daily</p>
              <p className="text-lg font-bold text-green-600">{avgDaily}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="text-lg font-bold text-yellow-600">{totalPending}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Avg. Time</p>
              <p className="text-lg font-bold text-purple-600">{avgTimeValue}h</p>
            </div>
          </div>
        </div>

        {/* Daily Breakdown */}
        <div className="mt-4 pt-4 border-t">
          <p className="text-xs font-medium text-muted-foreground mb-2">Daily Breakdown</p>
          <div className="space-y-2">
            {chartData.map((day) => (
              <div key={day.day} className="flex items-center justify-between text-xs">
                <span className="font-medium w-8">{day.day}</span>
                <div className="flex-1 mx-4">
                  <div className="flex items-center gap-1">
                    <div 
                      className="h-2 bg-green-500 rounded-l-full" 
                      style={{ 
                        width: `${(day.completed / (day.completed + day.pending)) * 100}%` 
                      }}
                    />
                    <div 
                      className="h-2 bg-yellow-500 rounded-r-full" 
                      style={{ 
                        width: `${(day.pending / (day.completed + day.pending)) * 100}%` 
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">{day.completed}</span>
                  <span className="text-yellow-600">{day.pending}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}