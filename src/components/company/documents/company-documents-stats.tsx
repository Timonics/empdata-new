'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  FileText,
  FileCheck,
  FileWarning,
  Clock,
  HardDrive,
  Upload,
  Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Stat {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ElementType;
  color: string;
  subtitle?: string;
}

const stats: Stat[] = [
  {
    title: 'Total Documents',
    value: '156',
    change: '+12',
    icon: FileText,
    color: 'blue',
    subtitle: 'All uploaded files',
  },
  {
    title: 'Verified',
    value: '98',
    change: '+8',
    icon: FileCheck,
    color: 'green',
    subtitle: 'Approved documents',
  },
  {
    title: 'Pending',
    value: '23',
    change: '-5',
    icon: Clock,
    color: 'yellow',
    subtitle: 'Awaiting verification',
  },
  {
    title: 'This Month',
    value: '24',
    change: '+8',
    icon: Upload,
    color: 'indigo',
    subtitle: 'New uploads',
  },
];

const colorClasses = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', iconBg: 'bg-blue-100' },
  green: { bg: 'bg-green-50', text: 'text-green-600', iconBg: 'bg-green-100' },
  yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600', iconBg: 'bg-yellow-100' },
  red: { bg: 'bg-red-50', text: 'text-red-600', iconBg: 'bg-red-100' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600', iconBg: 'bg-purple-100' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', iconBg: 'bg-indigo-100' },
};

export function CompanyDocumentsStats() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
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

  return (
    <div className="grid gap-4 md:grid-cols-2">
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
              <div className="flex items-center gap-2 mt-1">
                {stat.change && (
                  <span className={cn(
                    "text-xs font-medium",
                    stat.change.startsWith('+') ? "text-green-600" : "text-red-600"
                  )}>
                    {stat.change}
                  </span>
                )}
                <span className="text-xs text-muted-foreground">
                  {stat.subtitle}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}