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
    color: 'bg-blue-100 text-blue-600',
    href: '/admin/companies/add',
  },
  {
    label: 'Add Employee',
    icon: UserPlus,
    color: 'bg-green-100 text-green-600',
    href: '/admin/employees/add',
  },
  {
    label: 'New Registration',
    icon: FileText,
    color: 'bg-purple-100 text-purple-600',
    href: '/admin/registrations/new',
  },
  {
    label: 'Export Data',
    icon: Download,
    color: 'bg-orange-100 text-orange-600',
    href: '/admin/export',
  },
  {
    label: 'Send Invites',
    icon: Mail,
    color: 'bg-pink-100 text-pink-600',
    href: '/admin/invitations',
  },
  {
    label: 'Verification',
    icon: Shield,
    color: 'bg-yellow-100 text-yellow-600',
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
              className="h-auto flex-col gap-2 p-4 hover:border-blue-200 hover:bg-blue-50/50 bg-gray-50"
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