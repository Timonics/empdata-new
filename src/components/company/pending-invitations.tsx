'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Mail, ArrowRight, RefreshCw, XCircle } from 'lucide-react';
import { usePendingInvitations } from '@/hooks/queries/usePortalDashboard';
import { formatDistanceToNow } from 'date-fns';

export function PendingInvitations() {
  const { data: invitations, isLoading, error } = usePendingInvitations();

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-20" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error || !invitations) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Invitations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-500">Failed to load invitations</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Pending Invitations</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/portal/company/invitations" className="gap-1">
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {invitations.map((invitation) => (
            <div
              key={invitation.id}
              className="p-3 rounded-lg border hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium">{invitation.email}</span>
                </div>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  {invitation.role}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Sent {formatDistanceToNow(new Date(invitation.sent_at), { addSuffix: true })}</span>
                <span>Expires {formatDistanceToNow(new Date(invitation.expires_at), { addSuffix: true })}</span>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Button variant="ghost" size="sm" className="h-8 text-xs">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Resend
                </Button>
                <Button variant="ghost" size="sm" className="h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50">
                  <XCircle className="h-3 w-3 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ))}

          {invitations.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">
              No pending invitations
            </p>
          )}
        </div>

        <Button className="w-full mt-4" size="sm" asChild>
          <Link href="/portal/company/invitations/send">
            <Mail className="h-4 w-4 mr-2" />
            Send New Invitation
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}