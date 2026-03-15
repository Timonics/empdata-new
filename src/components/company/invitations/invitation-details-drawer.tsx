'use client';

import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Mail,
  User,
  Briefcase,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Copy,
  CheckCheck,
  X,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface InvitationDetailsDrawerProps {
  invitation: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  accepted: 'bg-green-100 text-green-800 border-green-200',
  expired: 'bg-red-100 text-red-800 border-red-200',
};

export function InvitationDetailsDrawer({ invitation, open, onOpenChange }: InvitationDetailsDrawerProps) {
  const [copied, setCopied] = useState(false);

  if (!invitation) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(invitation.inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTimeRemaining = () => {
    const now = new Date();
    const expiry = new Date(invitation.expiresAt);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    
    if (diffTime <= 0) return 'Expired';
    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} remaining`;
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} remaining`;
  };

  const getProgressPercentage = () => {
    const sent = new Date(invitation.sentAt).getTime();
    const expiry = new Date(invitation.expiresAt).getTime();
    const now = new Date().getTime();
    
    const total = expiry - sent;
    const elapsed = now - sent;
    const percentage = (elapsed / total) * 100;
    
    return Math.min(100, Math.max(0, percentage));
  };

  const InfoRow = ({ label, value, icon: Icon }: { label: string; value: string; icon?: any }) => (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      {Icon && <Icon className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium mt-0.5 wrap-break-word">{value || '—'}</p>
      </div>
    </div>
  );

  const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-gray-50 rounded-lg p-5">
      <h3 className="text-sm font-medium text-gray-700 mb-4">{title}</h3>
      <div className="space-y-1">{children}</div>
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-5xl lg:max-w-6xl xl:max-w-7xl max-w-[95vw]! p-0 overflow-y-auto [&>div]:max-w-none data-[side=right]:max-w-none">
        {/* Header */}
        <div className="bg-linear-to-r from-emerald-600 to-emerald-800 text-white p-6 sticky top-0 z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-white">
                <AvatarFallback className="bg-white/20 text-white text-xl">
                  {invitation.email[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <SheetTitle className="text-white text-xl">{invitation.email}</SheetTitle>
                <p className="text-emerald-100 text-sm mt-1">
                  {invitation.firstName} {invitation.lastName} • {invitation.role}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Status badges */}
          <div className="flex items-center gap-3 mt-4">
            <Badge
              variant="outline"
              className={cn(
                "px-3 py-1",
                "bg-white/20 text-white border-white/30",
                statusStyles[invitation.status as keyof typeof statusStyles]
              )}
            >
              {invitation.status}
            </Badge>
            <Badge variant="outline" className="bg-white/20 text-white border-white/30">
              {invitation.department}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Progress for pending invitations */}
          {invitation.status === 'pending' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Invitation expires in</span>
                <span className="font-medium">{getTimeRemaining()}</span>
              </div>
              <Progress value={getProgressPercentage()} className="h-2" />
            </div>
          )}

          <SectionCard title="Invitation Details">
            <InfoRow label="Email" value={invitation.email} icon={Mail} />
            <InfoRow label="Full Name" value={`${invitation.firstName} ${invitation.lastName}`} icon={User} />
            <InfoRow label="Role" value={invitation.role} icon={Briefcase} />
            <InfoRow label="Department" value={invitation.department} icon={Briefcase} />
          </SectionCard>

          <SectionCard title="Timeline">
            <InfoRow 
              label="Sent On" 
              value={new Date(invitation.sentAt).toLocaleString()} 
              icon={Calendar} 
            />
            <InfoRow 
              label="Expires On" 
              value={new Date(invitation.expiresAt).toLocaleString()} 
              icon={Clock} 
            />
            {invitation.acceptedAt && (
              <InfoRow 
                label="Accepted On" 
                value={new Date(invitation.acceptedAt).toLocaleString()} 
                icon={CheckCircle} 
              />
            )}
          </SectionCard>

          <SectionCard title="Invitation Link">
            <div className="space-y-3">
              <div className="flex gap-2">
                <code className="flex-1 p-3 bg-white rounded border text-sm break-all">
                  {invitation.inviteLink}
                </code>
                <Button variant="outline" onClick={copyToClipboard}>
                  {copied ? (
                    <CheckCheck className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Share this link with the employee if they didn't receive the email
              </p>
            </div>
          </SectionCard>
        </div>

        {/* Footer with actions */}
        {invitation.status === 'pending' && (
          <div className="border-t p-6 bg-gray-50 sticky bottom-0">
            <div className="flex items-center gap-3">
              <Button className="flex-1" variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Resend
              </Button>
              <Button className="flex-1" variant="destructive">
                <XCircle className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}