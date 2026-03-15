import {
  LayoutDashboard,
  Building2,
  Users,
  StickyNote,
  ShieldCheck,
  Logs,
  Settings,
  UserPlus,
  FileText,
  User,
  Users2,
  Mail,
} from 'lucide-react';

// Admin Navigation
export const adminNavItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Registrations',
    href: '/admin/registrations',
    icon: StickyNote,
    children: [
      { title: 'Group Life', href: '/admin/registrations/group-life' },
      { title: 'Individual', href: '/admin/registrations/individual' },
      { title: 'Corporate', href: '/admin/registrations/corporate' },
    ],
  },
  {
    title: 'Companies',
    href: '/admin/companies',
    icon: Building2,
  },
  {
    title: 'Employees',
    href: '/admin/employees',
    icon: Users,
  },
  {
    title: 'Verification Status',
    href: '/admin/verification-status',
    icon: ShieldCheck,
  },
  {
    title: 'Audit Logs',
    href: '/admin/audit-logs',
    icon: Logs,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

// Company Navigation
export const companyNavItems = [
  {
    title: 'Dashboard',
    href: '/portal/company',
    icon: LayoutDashboard,
  },
  {
    title: 'Employees',
    href: '/portal/company/employees',
    icon: Users,
  },
  {
    title: 'Invitations',
    href: '/portal/company/invitations',
    icon: Mail,
  },
  {
    title: 'Documents',
    href: '/portal/company/documents',
    icon: FileText,
  },
  {
    title: 'Reports',
    href: '/portal/company/reports',
    icon: StickyNote,
  },
];

// Employee Navigation
export const employeeNavItems = [
  {
    title: 'Dashboard',
    href: '/portal/employee',
    icon: LayoutDashboard,
  },
  {
    title: 'Profile',
    href: '/portal/employee/profile',
    icon: User,
  },
  {
    title: 'Beneficiaries',
    href: '/portal/employee/beneficiaries',
    icon: Users2,
  },
  {
    title: 'Documents',
    href: '/portal/employee/documents',
    icon: FileText,
  },
  {
    title: 'Company Info',
    href: '/portal/employee/company-info',
    icon: Building2,
  },
];