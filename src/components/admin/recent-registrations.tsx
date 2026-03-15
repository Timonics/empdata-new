'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, Building2, User, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRecentRegistrations } from '@/hooks/queries/useAnalytics';
import { formatDistanceToNow } from 'date-fns';

const statusColors = {
  pending_approval: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  approved: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
  verified: 'bg-blue-100 text-blue-800 border-blue-200',
};

export function RecentRegistrations() {
  const [hours, setHours] = useState(24);
  const { data, isLoading, error } = useRecentRegistrations(hours);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Registrations</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/registrations" className="gap-1">
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg animate-pulse">
                <div className="h-10 w-10 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Registrations</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/registrations" className="gap-1">
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-500 mb-2">Failed to load registrations</p>
            <p className="text-sm text-muted-foreground">Please try again later</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Registrations</CardTitle>
        <div className="flex items-center gap-2">
          <Select value={hours.toString()} onValueChange={(v) => setHours(parseInt(v))}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="24h" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">6h</SelectItem>
              <SelectItem value="12">12h</SelectItem>
              <SelectItem value="24">24h</SelectItem>
              <SelectItem value="48">2d</SelectItem>
              <SelectItem value="72">3d</SelectItem>
              <SelectItem value="168">7d</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/registrations" className="gap-1">
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.data.map((registration) => (
            <div
              key={`${registration.type}-${registration.id}`}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border">
                  <AvatarFallback className={cn(
                    registration.type === 'company' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-emerald-100 text-emerald-600'
                  )}>
                    {registration.type === 'company' 
                      ? <Building2 className="h-5 w-5" /> 
                      : <User className="h-5 w-5" />
                    }
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{registration.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-xs capitalize",
                        statusColors[registration.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
                      )}
                    >
                      {registration.status.replace('_', ' ')}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {registration.type}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(registration.submitted_at), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span>Status: {registration.account_status}</span>
                    <span>•</span>
                    <span>Verification: {registration.verification_status}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {data.data.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No registrations in the last {hours} hours
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            Showing {data.data.length} of {data.total} total registrations in the last {data.hours} hours
          </p>
        </div>
      </CardContent>
    </Card>
  );
}