"use client";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  MapPin,
  Heart,
  Shield,
  FileText,
  X,
  Edit,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EmployeeDetailsDrawerProps {
  employee: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusStyles = {
  verified: "bg-green-100 text-green-800 border-green-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  inactive: "bg-gray-100 text-gray-800 border-gray-200",
};

export function EmployeeDetailsDrawer({
  employee,
  open,
  onOpenChange,
}: EmployeeDetailsDrawerProps) {
  if (!employee) return null;

  const InfoRow = ({
    label,
    value,
    icon: Icon,
  }: {
    label: string;
    value: string;
    icon?: any;
  }) => (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      {Icon && <Icon className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium mt-0.5 wrap-break-word">
          {value || "—"}
        </p>
      </div>
    </div>
  );

  const SectionCard = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
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
                  {employee.firstName[0]}
                  {employee.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <SheetTitle className="text-white text-xl">
                  {employee.firstName} {employee.lastName}
                </SheetTitle>
                <p className="text-emerald-100 text-sm mt-1">
                  {employee.employeeId} • {employee.position}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Status badges */}
          <div className="flex items-center gap-3 mt-4">
            <Badge
              variant="outline"
              className={cn(
                "px-3 py-1",
                "bg-white/20 text-white border-white/30",
                statusStyles[employee.status as keyof typeof statusStyles],
              )}
            >
              {employee.status}
            </Badge>
            <Badge
              variant="outline"
              className="bg-white/20 text-white border-white/30"
            >
              {employee.department}
            </Badge>
          </div>
        </div>
        {/* Tabs */}
        <div className="border-b px-6">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="w-full justify-start h-auto p-0 bg-transparent">
              <TabsTrigger
                value="personal"
                className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 rounded-none px-4 py-3"
              >
                Personal
              </TabsTrigger>
              <TabsTrigger
                value="employment"
                className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 rounded-none px-4 py-3"
              >
                Employment
              </TabsTrigger>
              <TabsTrigger
                value="beneficiaries"
                className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 rounded-none px-4 py-3"
              >
                Beneficiaries
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 rounded-none px-4 py-3"
              >
                Documents
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        {/* Content */}
        <div className="p-6">
          <Tabs defaultValue="personal">
            <TabsContent value="personal" className="mt-0 space-y-6">
              <SectionCard title="Personal Information">
                <InfoRow
                  label="Full Name"
                  value={`${employee.firstName} ${employee.lastName}`}
                  icon={User}
                />
                <InfoRow
                  label="Date of Birth"
                  value={new Date(employee.dateOfBirth).toLocaleDateString()}
                  icon={Calendar}
                />
                <InfoRow label="Gender" value={employee.gender} icon={User} />
                <InfoRow label="Email" value={employee.email} icon={Mail} />
                <InfoRow label="Phone" value={employee.phone} icon={Phone} />
              </SectionCard>

              <SectionCard title="Address">
                <InfoRow
                  label="Address"
                  value={`${employee.address}, ${employee.city}, ${employee.state}, ${employee.country}`}
                  icon={MapPin}
                />
              </SectionCard>

              <SectionCard title="Emergency Contact">
                <InfoRow
                  label="Name"
                  value={employee.emergencyContact.split(" - ")[0]}
                  icon={Heart}
                />
                <InfoRow
                  label="Phone"
                  value={employee.emergencyContact.split(" - ")[1]}
                  icon={Phone}
                />
              </SectionCard>
            </TabsContent>

            <TabsContent value="employment" className="mt-0 space-y-6">
              <SectionCard title="Employment Details">
                <InfoRow
                  label="Employee ID"
                  value={employee.employeeId}
                  icon={FileText}
                />
                <InfoRow
                  label="Department"
                  value={employee.department}
                  icon={Briefcase}
                />
                <InfoRow
                  label="Position"
                  value={employee.position}
                  icon={Briefcase}
                />
                <InfoRow
                  label="Date Joined"
                  value={new Date(employee.dateJoined).toLocaleDateString()}
                  icon={Calendar}
                />
              </SectionCard>

              <SectionCard title="NIN Verification">
                <InfoRow
                  label="Status"
                  value={
                    employee.ninVerified
                      ? "Verified"
                      : employee.ninSubmitted
                        ? "Pending"
                        : "Not Submitted"
                  }
                  icon={Shield}
                />
                {employee.ninVerified && (
                  <InfoRow
                    label="Verified Date"
                    value="2024-03-15"
                    icon={Calendar}
                  />
                )}
              </SectionCard>
            </TabsContent>

            <TabsContent value="beneficiaries" className="mt-0">
              <SectionCard title="Beneficiaries">
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">
                    This employee has {employee.beneficiaries} registered
                    beneficiaries
                  </p>
                  <Button variant="outline" className="mt-4">
                    View Beneficiaries
                  </Button>
                </div>
              </SectionCard>
            </TabsContent>

            <TabsContent value="documents" className="mt-0">
              <SectionCard title="Documents">
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">No documents uploaded yet</p>
                  <Button variant="outline" className="mt-4">
                    Upload Documents
                  </Button>
                </div>
              </SectionCard>
            </TabsContent>
          </Tabs>
        </div>
        {/* Footer */}
        <div className="border-t p-6 bg-gray-50 sticky bottom-0">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Last updated: 2 days ago
            </div>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Edit Employee
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
