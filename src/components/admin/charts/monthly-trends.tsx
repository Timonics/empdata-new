'use client';

import { useState, useMemo } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, TrendingUp, Users, Building2, FileText, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMonthlyEmployeeRegistrations, useMonthlyCompanyRegistrations } from '@/hooks/queries/useAnalytics';

const metrics = [
  { key: 'employees', label: 'Employees', color: '#10b981', icon: Users, dataKey: 'employeeCount' },
  { key: 'companies', label: 'Companies', color: '#3b82f6', icon: Building2, dataKey: 'companyCount' },
  { key: 'registrations', label: 'Registrations', color: '#8b5cf6', icon: FileText, dataKey: 'registrationCount' },
  { key: 'verifications', label: 'Verifications', color: '#f59e0b', icon: TrendingUp, dataKey: 'verificationCount' },
];

export function MonthlyTrends() {
  const [chartType, setChartType] = useState<'area' | 'bar' | 'line'>('area');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['employees', 'companies', 'registrations']);
  const [monthsToShow, setMonthsToShow] = useState<string>('12');

  // Fetch real data
  const { 
    data: employeeData, 
    isLoading: isLoadingEmployees,
    error: employeeError 
  } = useMonthlyEmployeeRegistrations();
  
  const { 
    data: companyData, 
    isLoading: isLoadingCompanies,
    error: companyError 
  } = useMonthlyCompanyRegistrations();

  // Combine and transform data for the chart
  const chartData = useMemo(() => {
    if (!employeeData?.data || !companyData?.data) return [];

    // Create a map of month to combined data
    const dataMap = new Map();

    // Add employee data
    employeeData.data.forEach(item => {
      dataMap.set(item.month, {
        month: item.month,
        employeeCount: item.count,
        companyCount: 0,
        registrationCount: 0,
        verificationCount: 0,
      });
    });

    // Add company data with status breakdown
    companyData.data.forEach(item => {
      const existing = dataMap.get(item.month) || {
        month: item.month,
        employeeCount: 0,
        companyCount: 0,
        registrationCount: 0,
        verificationCount: 0,
      };
      
      existing.companyCount = item.total;
      // You can customize these based on your needs
      existing.registrationCount = item.total; // Or use specific status
      existing.verificationCount = item.by_verification_status.verified;
      
      dataMap.set(item.month, existing);
    });

    // Convert to array and sort by month
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = Array.from(dataMap.values());
    
    // Sort by month index
    return data.sort((a, b) => 
      months.indexOf(a.month) - months.indexOf(b.month)
    );
  }, [employeeData, companyData]);

  // Filter data based on selected months
  const filteredData = useMemo(() => {
    const monthsToKeep = parseInt(monthsToShow);
    return chartData.slice(-monthsToKeep);
  }, [chartData, monthsToShow]);

  const toggleMetric = (metric: string) => {
    setSelectedMetrics(prev =>
      prev.includes(metric)
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  const isLoading = isLoadingEmployees || isLoadingCompanies;
  const error = employeeError || companyError;

  if (isLoading) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Monthly Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-100 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">Loading analytics data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Monthly Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-100 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-500 mb-2">Failed to load analytics data</p>
              <p className="text-sm text-muted-foreground">Please try again later</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderChart = () => {
    const ChartComponent = {
      area: AreaChart,
      bar: BarChart,
      line: LineChart,
    }[chartType];

    const commonProps = {
      data: filteredData,
      margin: { top: 10, right: 30, left: 0, bottom: 0 },
    };

    return (
      <ResponsiveContainer width="100%" height={400}>
        <ChartComponent {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
          <XAxis dataKey="month" className="text-xs" />
          <YAxis className="text-xs" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
            formatter={(value: number, name: string) => {
              const metric = metrics.find(m => m.label === name);
              return [value, metric?.label || name];
            }}
          />
          <Legend />
          {selectedMetrics.map(metricKey => {
            const metric = metrics.find(m => m.key === metricKey);
            if (!metric) return null;

            if (chartType === 'area') {
              return (
                <Area
                  key={metric.key}
                  type="monotone"
                  dataKey={metric.dataKey}
                  name={metric.label}
                  stroke={metric.color}
                  fill={metric.color}
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              );
            }
            if (chartType === 'bar') {
              return (
                <Bar
                  key={metric.key}
                  dataKey={metric.dataKey}
                  name={metric.label}
                  fill={metric.color}
                  radius={[4, 4, 0, 0]}
                />
              );
            }
            return (
              <Line
                key={metric.key}
                type="monotone"
                dataKey={metric.dataKey}
                name={metric.label}
                stroke={metric.color}
                strokeWidth={2}
                dot={{ fill: metric.color, r: 4 }}
                activeDot={{ r: 6 }}
              />
            );
          })}
        </ChartComponent>
      </ResponsiveContainer>
    );
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Monthly Trends
          </CardTitle>
          <div className="flex items-center gap-2">
            <Tabs value={chartType} onValueChange={(v: any) => setChartType(v)}>
              <TabsList>
                <TabsTrigger value="area">Area</TabsTrigger>
                <TabsTrigger value="bar">Bar</TabsTrigger>
                <TabsTrigger value="line">Line</TabsTrigger>
              </TabsList>
            </Tabs>
            <Select value={monthsToShow} onValueChange={setMonthsToShow}>
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 months</SelectItem>
                <SelectItem value="6">6 months</SelectItem>
                <SelectItem value="9">9 months</SelectItem>
                <SelectItem value="12">12 months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {metrics.map(metric => (
            <button
              key={metric.key}
              onClick={() => toggleMetric(metric.key)}
              className={cn(
                "flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors",
                selectedMetrics.includes(metric.key)
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              <metric.icon className="h-3 w-3" />
              {metric.label}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
}