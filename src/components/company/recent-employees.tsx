'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRecentEmployees } from '@/hooks/queries/usePortalDashboard';
import { formatDistanceToNow } from 'date-fns';

const statusStyles = {
  verified: 'bg-green-100 text-green-800 border-green-200',
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  inactive: 'bg-gray-100 text-gray-800 border-gray-200',
};

export function RecentEmployees() {
  const { data: employees, isLoading, error } = useRecentEmployees();

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-20" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error || !employees) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Employees</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-500">Failed to load recent employees</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Employees</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/portal/company/employees" className="gap-1">
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {employees.map((employee) => (
            <div
              key={employee.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {employee.first_name[0]}{employee.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{employee.first_name} {employee.last_name}</p>
                  <p className="text-xs text-muted-foreground">{employee.email}</p>
                  {employee.department && (
                    <p className="text-xs text-muted-foreground mt-1">{employee.department}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <Badge
                  variant="outline"
                  className={cn(
                    "font-medium",
                    statusStyles[employee.status as keyof typeof statusStyles]
                  )}
                >
                  {employee.status}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(employee.joined_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}

          {employees.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">
              No employees found
            </p>
          )}
        </div>

        <Button className="w-full mt-4" variant="outline" asChild>
          <Link href="/portal/company/employees/add">
            <UserPlus className="h-4 w-4 mr-2" />
            Add New Employee
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}