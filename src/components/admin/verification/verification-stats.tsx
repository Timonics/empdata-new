'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Shield,
  ShieldCheck,
  ShieldX,
  Clock,
  FileCheck,
  FileX,
  Users,
  Building2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRegistrationStatusSummary } from '@/hooks/queries/useAnalytics';

export function VerificationStats() {
  const { data, isLoading, error } = useRegistrationStatusSummary();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
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

  if (error || !data) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle className="text-sm text-red-500">Error loading stats</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  // Calculate stats from the data
  const totalCompanies = data.company_registrations?.total || 0;
  const totalEmployees = data.employee_registrations?.total || 0;
  
  const pendingCompanies = data.company_registrations?.by_status?.pending_approval || 0;
  const pendingEmployees = data.employee_registrations?.by_status?.pending_approval || 0;
  const totalPending = pendingCompanies + pendingEmployees;
  
  const verifiedCompanies = data.company_registrations?.by_verification_status?.verified || 0;
  const verifiedEmployees = data.employee_registrations?.by_verification_status?.verified || 0;
  const totalVerified = verifiedCompanies + verifiedEmployees;
  
  const rejectedCompanies = data.company_registrations?.by_status?.rejected || 0;
  const rejectedEmployees = data.employee_registrations?.by_status?.rejected || 0;
  const totalRejected = rejectedCompanies + rejectedEmployees;
  
  const notVerifiedCompanies = data.company_registrations?.by_verification_status?.not_verified || 0;
  const notVerifiedEmployees = data.employee_registrations?.by_verification_status?.not_verified || 0;
  const totalNotVerified = notVerifiedCompanies + notVerifiedEmployees;

  const successRate = totalVerified + totalRejected > 0 
    ? Math.round((totalVerified / (totalVerified + totalRejected)) * 100)
    : 0;

  const stats = [
    {
      title: 'Pending Verifications',
      value: totalPending.toLocaleString(),
      icon: Clock,
      color: 'yellow',
      subtitle: 'Awaiting review',
    },
    {
      title: 'Verified',
      value: totalVerified.toLocaleString(),
      icon: CheckCircle2,
      color: 'green',
      subtitle: 'Successfully verified',
    },
    {
      title: 'Failed Verifications',
      value: totalRejected.toLocaleString(),
      icon: ShieldX,
      color: 'red',
      subtitle: 'Needs attention',
    },
    {
      title: 'Success Rate',
      value: `${successRate}%`,
      icon: ShieldCheck,
      color: 'blue',
      subtitle: 'Last 30 days',
    },
    {
      title: 'Companies',
      value: totalCompanies.toLocaleString(),
      icon: Building2,
      color: 'purple',
      subtitle: 'Total registered',
    },
    {
      title: 'Employees',
      value: totalEmployees.toLocaleString(),
      icon: Users,
      color: 'indigo',
      subtitle: 'Total registered',
    },
  ];

  const colorClasses = {
    yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600', iconBg: 'bg-yellow-100' },
    green: { bg: 'bg-green-50', text: 'text-green-600', iconBg: 'bg-green-100' },
    red: { bg: 'bg-red-50', text: 'text-red-600', iconBg: 'bg-red-100' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', iconBg: 'bg-blue-100' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', iconBg: 'bg-purple-100' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', iconBg: 'bg-indigo-100' },
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => {
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
              {stat.subtitle && (
                <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}