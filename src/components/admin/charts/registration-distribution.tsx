'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart as PieChartIcon, Loader2 } from 'lucide-react';
import { useRegistrationStatusSummary } from '@/hooks/queries/useAnalytics';

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export function RegistrationDistribution() {
  const { data, isLoading, error } = useRegistrationStatusSummary();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5 text-blue-600" />
            Registration Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-75 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">Loading registration data...</p>
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
            <PieChartIcon className="h-5 w-5 text-blue-600" />
            Registration Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-75 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-500 mb-2">Failed to load registration data</p>
              <p className="text-sm text-muted-foreground">Please try again later</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Combine company and employee data for the pie chart
  const chartData = [
    { 
      name: 'Pending', 
      value: data.company_registrations.by_status.pending_approval + 
             data.employee_registrations.by_status.pending_approval,
      color: '#f59e0b' 
    },
    { 
      name: 'Approved', 
      value: data.company_registrations.by_status.approved + 
             data.employee_registrations.by_status.approved,
      color: '#10b981' 
    },
    { 
      name: 'Verified', 
      value: data.company_registrations.by_verification_status.verified + 
             data.employee_registrations.by_verification_status.verified,
      color: '#3b82f6' 
    },
    { 
      name: 'Rejected', 
      value: data.company_registrations.by_status.rejected + 
             data.employee_registrations.by_status.rejected,
      color: '#ef4444' 
    },
  ].filter(item => item.value > 0); // Only show items with values > 0

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="h-5 w-5 text-blue-600" />
          Registration Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-75">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [
                  `${value} (${((value / total) * 100).toFixed(1)}%)`, 
                  'Count'
                ]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-xs text-blue-600 font-medium">Companies</p>
            <p className="text-2xl font-bold text-blue-700">
              {data.company_registrations.total}
            </p>
          </div>
          <div className="bg-emerald-50 p-3 rounded-lg">
            <p className="text-xs text-emerald-600 font-medium">Employees</p>
            <p className="text-2xl font-bold text-emerald-700">
              {data.employee_registrations.total}
            </p>
          </div>
        </div>

        {/* Legend with values */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm flex-1">{item.name}</span>
              <span className="text-sm font-medium">{item.value}</span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-4 pt-4 border-t flex items-center justify-between">
          <span className="text-sm font-medium">Total Registrations</span>
          <span className="text-xl font-bold text-gray-900">{total}</span>
        </div>
      </CardContent>
    </Card>
  );
}