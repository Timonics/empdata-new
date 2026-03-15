'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Mail,
  MailCheck,
  MailX,
  Clock,
  UserPlus,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Stat {
  title: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ElementType;
  color: string;
  subtitle?: string;
}

const stats: Stat[] = [
  {
    title: 'Total Sent',
    value: '156',
    change: '+23',
    changeType: 'positive',
    icon: Mail,
    color: 'blue',
    subtitle: 'All time invitations',
  },
  {
    title: 'Pending',
    value: '28',
    change: '-5',
    changeType: 'positive',
    icon: Clock,
    color: 'yellow',
    subtitle: 'Awaiting response',
  },
  {
    title: 'Accepted',
    value: '112',
    change: '+18',
    changeType: 'positive',
    icon: MailCheck,
    color: 'green',
    subtitle: 'Successfully joined',
  },
  {
    title: 'Expired',
    value: '16',
    change: '+3',
    changeType: 'negative',
    icon: MailX,
    color: 'red',
    subtitle: 'Not responded',
  },
  {
    title: 'Acceptance Rate',
    value: '72%',
    change: '+5%',
    changeType: 'positive',
    icon: TrendingUp,
    color: 'purple',
    subtitle: 'Last 30 days',
  },
  {
    title: 'Pending Today',
    value: '8',
    change: '+2',
    changeType: 'negative',
    icon: UserPlus,
    color: 'orange',
    subtitle: 'Sent in last 24h',
  },
];

const colorClasses = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', iconBg: 'bg-blue-100' },
  yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600', iconBg: 'bg-yellow-100' },
  green: { bg: 'bg-green-50', text: 'text-green-600', iconBg: 'bg-green-100' },
  red: { bg: 'bg-red-50', text: 'text-red-600', iconBg: 'bg-red-100' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600', iconBg: 'bg-purple-100' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-600', iconBg: 'bg-orange-100' },
};

export function InvitationsStats() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

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
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={cn(
                    "text-xs font-medium",
                    stat.changeType === 'positive' && "text-green-600",
                    stat.changeType === 'negative' && "text-red-600",
                    stat.changeType === 'neutral' && "text-gray-600"
                  )}
                >
                  {stat.changeType === 'positive' && '+'}
                  {stat.change}
                </span>
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