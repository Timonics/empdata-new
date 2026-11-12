'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Building2,
  UserPlus,
  FileText,
  Download,
  Mail,
  Settings,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const actions = [
  {
    label: 'Add Company',
    icon: Building2,
    color: 'bg-blue-50 text-blue-700',
    href: '/admin/companies/add',
  },
  {
    label: 'Add Employee',
    icon: UserPlus,
    color: 'bg-emerald-50 text-emerald-700',
    href: '/admin/employees/add',
  },
  {
    label: 'New Registration',
    icon: FileText,
    color: 'bg-violet-50 text-violet-700',
    href: '/admin/registrations/new',
  },
  {
    label: 'Export Data',
    icon: Download,
    color: 'bg-amber-50 text-amber-700',
    href: '/admin/export',
  },
  {
    label: 'Send Invites',
    icon: Mail,
    color: 'bg-sky-50 text-sky-700',
    href: '/admin/invitations',
  },
  {
    label: 'Verification',
    icon: Shield,
    color: 'bg-slate-100 text-slate-700',
    href: '/admin/verification',
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              className="h-auto flex-col gap-2.5 rounded-lg border-border/70 p-4 bg-card hover:border-border hover:bg-muted/50 hover:shadow-card"
              asChild
            >
              <a href={action.href}>
                <div className={cn("rounded-full p-2", action.color)}>
                  <action.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-center">{action.label}</span>
              </a>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}