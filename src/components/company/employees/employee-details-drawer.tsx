"use client";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
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
  Building2,
  Hash,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isValid } from "date-fns";

interface EmployeeDetailsDrawerProps {
  employee: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusStyles = {
  active: "bg-green-100 text-green-800 border-green-200",
  inactive: "bg-gray-100 text-gray-800 border-gray-200",
};

const ninStatusStyles = {
  verified: "bg-green-100 text-green-800 border-green-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  not_submitted: "bg-gray-100 text-gray-800 border-gray-200",
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
    value: string | number | null | undefined;
    icon?: any;
  }) => (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      {Icon && <Icon className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium mt-0.5 wrap-break-word">
          {value?.toString() || "—"}
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (!isValid(date)) return "N/A";
      return format(date, "PPP");
    } catch {
      return "N/A";
    }
  };

  const getInitials = () => {
    const first = employee.first_name?.[0] || "";
    const last = employee.last_name?.[0] || "";
    return (first + last).toUpperCase() || "EM";
  };

  const getNINStatus = () => {
    if (employee.nin_verification?.is_nin_verified) return "verified";
    if (employee.nin_verification?.has_submitted_nin) return "pending";
    return "not_submitted";
  };

  const ninStatus = getNINStatus();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-5xl lg:max-w-6xl xl:max-w-7xl max-w-[95vw]! p-0 overflow-y-auto [&>div]:max-w-none data-[side=right]:max-w-none">
        {/* Header */}
        <div className="bg-linear-to-r from-emerald-600 to-emerald-800 text-white p-6 sticky top-0 z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-white">
                <AvatarFallback className="bg-white/20 text-white text-xl">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div>
                <SheetTitle className="text-white text-xl">
                  {employee.first_name || ""} {employee.last_name || ""}
                </SheetTitle>
                <p className="text-emerald-100 text-sm mt-1">
                  {employee.employee_number || "No ID"} •{" "}
                  {employee.position || "No Position"}
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
                statusStyles[
                  employee.employment_status as keyof typeof statusStyles
                ],
              )}
            >
              {employee.employment_status || "inactive"}
            </Badge>
            <Badge
              variant="outline"
              className={cn(
                "px-3 py-1",
                "bg-white/20 text-white border-white/30",
                ninStatusStyles[ninStatus as keyof typeof ninStatusStyles],
              )}
            >
              NIN: {ninStatus.replace("_", " ")}
            </Badge>
            {employee.department && (
              <Badge
                variant="outline"
                className="bg-white/20 text-white border-white/30"
              >
                {employee.department}
              </Badge>
            )}
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
                  value={
                    `${employee.first_name || ""} ${employee.last_name || ""}`.trim() ||
                    "—"
                  }
                  icon={User}
                />
                <InfoRow
                  label="Date of Birth"
                  value={formatDate(employee.date_of_birth)}
                  icon={Calendar}
                />
                <InfoRow label="Gender" value={employee.gender} icon={User} />
                <InfoRow label="Email" value={employee.email} icon={Mail} />
                <InfoRow label="Phone" value={employee.phone} icon={Phone} />
              </SectionCard>

              <SectionCard title="Address">
                <InfoRow
                  label="Address"
                  value={
                    [
                      employee.address,
                      employee.city,
                      employee.state,
                      employee.country,
                    ]
                      .filter(Boolean)
                      .join(", ") || "—"
                  }
                  icon={MapPin}
                />
              </SectionCard>

              <SectionCard title="Emergency Contact">
                <InfoRow
                  label="Name"
                  value={employee.emergency_contact?.name}
                  icon={Heart}
                />
                <InfoRow
                  label="Phone"
                  value={employee.emergency_contact?.phone}
                  icon={Phone}
                />
                <InfoRow
                  label="Relationship"
                  value={employee.emergency_contact?.relationship}
                  icon={Heart}
                />
              </SectionCard>
            </TabsContent>

            <TabsContent value="employment" className="mt-0 space-y-6">
              <SectionCard title="Employment Details">
                <InfoRow
                  label="Employee ID"
                  value={employee.employee_number}
                  icon={Hash}
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
                  value={formatDate(employee.created_at)}
                  icon={Calendar}
                />
                <InfoRow
                  label="Employment Status"
                  value={employee.employment_status}
                  icon={Clock}
                />
              </SectionCard>

              <SectionCard title="NIN Verification">
                <div className="flex items-center gap-2 mb-3">
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-medium",
                      ninStatusStyles[
                        ninStatus as keyof typeof ninStatusStyles
                      ],
                    )}
                  >
                    {ninStatus.replace("_", " ")}
                  </Badge>
                  {employee.nin_verification?.is_validated && (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      Validated
                    </Badge>
                  )}
                </div>
                <InfoRow
                  label="NIN Status"
                  value={
                    employee.nin_verification?.is_nin_verified
                      ? "Verified"
                      : employee.nin_verification?.has_submitted_nin
                        ? "Pending"
                        : "Not Submitted"
                  }
                  icon={Shield}
                />
                {employee.nin_verification?.nin_verified_at && (
                  <InfoRow
                    label="Verified Date"
                    value={formatDate(
                      employee.nin_verification.nin_verified_at,
                    )}
                    icon={Calendar}
                  />
                )}
              </SectionCard>
            </TabsContent>

            <TabsContent value="beneficiaries" className="mt-0">
              <SectionCard title="Beneficiaries">
                {employee.beneficiaries && employee.beneficiaries.length > 0 ? (
                  <div className="space-y-4">
                    {employee.beneficiaries.map(
                      (beneficiary: any, index: number) => (
                        <div
                          key={beneficiary.id || index}
                          className="bg-white p-4 rounded-lg border"
                        >
                          <p className="font-medium">
                            {beneficiary.first_name} {beneficiary.last_name}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {beneficiary.relationship}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-gray-500">
                              Allocation: {beneficiary.percentage_allocation}%
                            </span>
                            {beneficiary.identification_url && (
                              <Button variant="ghost" size="sm" className="h-8">
                                <FileText className="h-4 w-4 mr-2" />
                                View Document
                              </Button>
                            )}
                          </div>
                        </div>
                      ),
                    )}
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm font-medium">
                        Total Allocation
                      </span>
                      <span className="text-sm font-bold">
                        {employee.beneficiaries.reduce(
                          (sum: number, b: any) =>
                            sum + (b.percentage_allocation || 0),
                          0,
                        )}
                        %
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">No beneficiaries added yet</p>
                  </div>
                )}
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
              Last updated:{" "}
              {formatDate(employee.updated_at || employee.created_at)}
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
