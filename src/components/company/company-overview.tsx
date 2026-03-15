'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
  Shield,
  FileText,
} from 'lucide-react';
import { useCompanyProfile } from '@/hooks/queries/usePortalDashboard';

export function CompanyOverview() {
  const { data: company, isLoading, error } = useCompanyProfile();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-4">
            <Skeleton className="h-16 w-16 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-20 rounded-lg" />
            <Skeleton className="h-20 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !company) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Company Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-500">Failed to load company profile</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Company Header */}
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 rounded-lg bg-linear-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-xl font-bold">
            {company.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <h3 className="text-xl font-bold">{company.name}</h3>
            <p className="text-sm text-muted-foreground">{company.rc_number}</p>
          </div>
        </div>

        {/* Company Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="h-4 w-4 text-gray-400" />
            <span>{company.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone className="h-4 w-4 text-gray-400" />
            <span>{company.phone}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span>{company.address}</span>
          </div>
          {company.website && (
            <div className="flex items-center gap-3 text-sm">
              <Globe className="h-4 w-4 text-gray-400" />
              <a href={company.website} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                {company.website}
              </a>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <Building2 className="h-5 w-5 text-blue-600 mx-auto mb-1" />
            <p className="text-2xl font-bold">{company.employees_count}</p>
            <p className="text-xs text-gray-600">Total Employees</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <Shield className="h-5 w-5 text-green-600 mx-auto mb-1" />
            <p className="text-2xl font-bold">{company.verified_employees}</p>
            <p className="text-xs text-gray-600">Verified</p>
          </div>
        </div>

        {/* Completion Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Profile Completion</span>
            <span className="text-sm text-muted-foreground">{company.completion_rate}%</span>
          </div>
          <Progress value={company.completion_rate} className="h-2" />
        </div>

        {/* Insurance Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Insurance Plan</span>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Active
            </Badge>
          </div>
          <p className="text-sm">{company.insurance_type}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Member since {new Date(company.member_since).getFullYear()}
          </p>
        </div>

        {/* Admin Info */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-muted-foreground">Admin Contact</p>
          <p className="text-sm font-medium mt-1">{company.admin_name}</p>
          <p className="text-xs text-gray-600">{company.admin_email}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1">
            <FileText className="h-4 w-4 mr-2" />
            Documents
          </Button>
          <Button className="flex-1">
            Edit Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}