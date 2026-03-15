'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  User,
  Briefcase,
  FileText,
  Calendar,
  Users,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ViewCompanyModalProps {
  company: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusStyles = {
  active: 'bg-green-100 text-green-800 border-green-200',
  inactive: 'bg-gray-100 text-gray-800 border-gray-200',
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  suspended: 'bg-red-100 text-red-800 border-red-200',
};

export function ViewCompanyModal({ company, open, onOpenChange }: ViewCompanyModalProps) {
  if (!company) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">{company.name}</DialogTitle>
            <Badge
              variant="outline"
              className={cn(
                "font-medium",
                statusStyles[company.status as keyof typeof statusStyles]
              )}
            >
              {company.status}
            </Badge>
          </div>
          <DialogDescription>
            RC Number: {company.rcNumber} • Joined {new Date(company.joinedDate).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-blue-600" />
                    Company Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Company Name:</span>
                      <span className="font-medium">{company.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">RC Number:</span>
                      <code className="bg-gray-200 px-2 py-0.5 rounded text-xs">
                        {company.rcNumber}
                      </code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Insurance Type:</span>
                      <Badge variant="outline" className="bg-blue-50">
                        {company.insuranceType}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Employees:</span>
                      <span className="font-medium">{company.employees}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Active Policies:</span>
                      <span className="font-medium">{company.policies}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    Address
                  </h3>
                  <p className="text-sm">{company.address}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600" />
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <a href={`mailto:${company.email}`} className="text-blue-600 hover:underline">
                        {company.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{company.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-blue-600" />
                    Admin Account
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium">{company.adminName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <a href={`mailto:${company.adminEmail}`} className="text-blue-600">
                        {company.adminEmail}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    Activity
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Joined:</span>
                      <span>{new Date(company.joinedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Login:</span>
                      <span>Today, 09:30 AM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="employees" className="mt-4">
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <Users className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <h3 className="font-medium mb-1">Employee List</h3>
              <p className="text-sm text-muted-foreground">
                This company has {company.employees} employees. Coming soon...
              </p>
            </div>
          </TabsContent>

          <TabsContent value="policies" className="mt-4">
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <Shield className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <h3 className="font-medium mb-1">Insurance Policies</h3>
              <p className="text-sm text-muted-foreground">
                This company has {company.policies} active policies. Coming soon...
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}