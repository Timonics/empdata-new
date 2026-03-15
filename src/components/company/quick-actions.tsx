'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  UserPlus,
  Mail,
  FileText,
  Download,
  Users,
  Settings,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const actions = [
  {
    label: 'Add Employee',
    icon: UserPlus,
    color: 'bg-blue-100 text-blue-600',
    href: '/portal/company/employees/add',
  },
  {
    label: 'Send Invitation',
    icon: Mail,
    color: 'bg-green-100 text-green-600',
    href: '/portal/company/invitations/send',
  },
  {
    label: 'Upload Documents',
    icon: FileText,
    color: 'bg-purple-100 text-purple-600',
    href: '/portal/company/documents/upload',
  },
  {
    label: 'Export Data',
    icon: Download,
    color: 'bg-orange-100 text-orange-600',
    href: '/portal/company/export',
  },
  {
    label: 'View All Employees',
    icon: Users,
    color: 'bg-pink-100 text-pink-600',
    href: '/portal/company/employees',
  },
  {
    label: 'Company Settings',
    icon: Settings,
    color: 'bg-gray-100 text-gray-600',
    href: '/portal/company/settings',
  },
  {
    label: 'Verification Status',
    icon: Shield,
    color: 'bg-yellow-100 text-yellow-600',
    href: '/portal/company/verification',
  },
  {
    label: 'Help & Support',
    icon: HelpCircle,
    color: 'bg-indigo-100 text-indigo-600',
    href: '/portal/company/support',
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
              className="h-auto flex-col gap-2 p-4 hover:border-green-200 hover:bg-green-50/50"
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