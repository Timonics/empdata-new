"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  User,
  Mail,
  Phone,
  Users,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  Download,
  Shield,
  Briefcase,
  MapPin,
  DollarSign,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RegistrationDrawerProps {
  registration: any;
  type: "group-life" | "individual" | "corporate";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "view" | "edit";
  onModeChange?: (mode: "view" | "edit") => void;
}

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  approved: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
  verified: "bg-blue-100 text-blue-800 border-blue-200",
};

export function RegistrationDrawer({
  registration,
  type,
  open,
  onOpenChange,
  mode,
}: RegistrationDrawerProps) {
  const [activeTab, setActiveTab] = useState("details");

  if (!registration) return null;

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
        <p className="text-sm font-medium mt-0.5 wrap-break-word">{value || "—"}</p>
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

  const DocumentCard = ({ name, date }: { name: string; date: string }) => (
    <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
      <div className="flex items-center gap-3">
        <FileText className="h-5 w-5 text-blue-500" />
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-gray-500">Uploaded {date}</p>
        </div>
      </div>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-5xl lg:max-w-6xl xl:max-w-7xl max-w-[95vw]! p-0 overflow-y-auto [&>div]:max-w-none! data-[side=right]:max-w-none!">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-blue-800 text-white p-8 sticky top-0 z-20">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
                {type === "group-life" && <Users className="h-8 w-8" />}
                {type === "individual" && <User className="h-8 w-8" />}
                {type === "corporate" && <Building2 className="h-8 w-8" />}
              </div>
              <div>
                <SheetTitle className="text-white text-2xl">
                  {type === "group-life" && registration.companyName}
                  {type === "individual" &&
                    `${registration.firstName} ${registration.lastName}`}
                  {type === "corporate" && registration.companyName}
                </SheetTitle>
                <p className="text-blue-100 text-sm mt-1">
                  {type === "group-life" && `RC: ${registration.rcNumber}`}
                  {type === "individual" && `ID: ${registration.id}`}
                  {type === "corporate" && `RC: ${registration.rcNumber}`}
                  {" • "}
                  Submitted{" "}
                  {new Date(registration.submittedAt).toLocaleDateString()}
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

          {/* Status badges and actions */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className={cn(
                  "px-3 py-1 text-sm",
                  "bg-white/20 text-white border-white/30",
                  statusStyles[
                    registration.status as keyof typeof statusStyles
                  ],
                )}
              >
                {registration.status}
              </Badge>
              <Badge
                variant="outline"
                className="px-3 py-1 text-sm bg-white/20 text-white border-white/30"
              >
                {registration.planType}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button variant="destructive">
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b px-8 sticky top-43 bg-white z-10">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full justify-start h-auto p-0 bg-transparent">
              <TabsTrigger
                value="details"
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-6 py-4 text-sm font-medium"
              >
                Details
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-6 py-4 text-sm font-medium"
              >
                Documents
              </TabsTrigger>
              <TabsTrigger
                value="timeline"
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-6 py-4 text-sm font-medium"
              >
                Timeline
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Content */}
        <div className="p-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* Details Tab */}
            <TabsContent value="details" className="mt-0 space-y-6">
              {/* Key Statistics */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <Users className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{registration.employees}</p>
                  <p className="text-xs text-gray-600">Employees</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <DollarSign className="h-6 w-6 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{registration.coverage}</p>
                  <p className="text-xs text-gray-600">Coverage</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <FileText className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">
                    {registration.documents.length}
                  </p>
                  <p className="text-xs text-gray-600">Documents</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg text-center">
                  <Calendar className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-xs text-gray-600">Days Pending</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  <SectionCard title="Company Information">
                    <InfoRow
                      label="Company Name"
                      value={registration.companyName}
                      icon={Building2}
                    />
                    <InfoRow
                      label="RC Number"
                      value={registration.rcNumber}
                      icon={FileText}
                    />
                    <InfoRow
                      label="Plan Type"
                      value={registration.planType}
                      icon={Shield}
                    />
                    <InfoRow
                      label="Number of Employees"
                      value={registration.employees.toString()}
                      icon={Users}
                    />
                    <InfoRow
                      label="Coverage Amount"
                      value={registration.coverage}
                      icon={DollarSign}
                    />
                  </SectionCard>

                  <SectionCard title="Director Information">
                    <InfoRow
                      label="Name"
                      value={registration.directorName}
                      icon={User}
                    />
                    <InfoRow
                      label="BVN"
                      value={registration.directorBVN}
                      icon={Shield}
                    />
                    <InfoRow
                      label="Email"
                      value={registration.email}
                      icon={Mail}
                    />
                    <InfoRow
                      label="Phone"
                      value={registration.phone}
                      icon={Phone}
                    />
                  </SectionCard>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <SectionCard title="Contact Person">
                    <InfoRow
                      label="Name"
                      value={registration.contactPerson}
                      icon={User}
                    />
                    <InfoRow
                      label="Email"
                      value={registration.email}
                      icon={Mail}
                    />
                    <InfoRow
                      label="Phone"
                      value={registration.phone}
                      icon={Phone}
                    />
                  </SectionCard>

                  <SectionCard title="Submission Details">
                    <InfoRow
                      label="Submitted On"
                      value={new Date(
                        registration.submittedAt,
                      ).toLocaleString()}
                      icon={Calendar}
                    />
                    {registration.approvedAt && (
                      <InfoRow
                        label="Approved On"
                        value={new Date(
                          registration.approvedAt,
                        ).toLocaleString()}
                        icon={CheckCircle}
                      />
                    )}
                    {registration.rejectedAt && (
                      <InfoRow
                        label="Rejected On"
                        value={new Date(
                          registration.rejectedAt,
                        ).toLocaleString()}
                        icon={XCircle}
                      />
                    )}
                    {registration.rejectionReason && (
                      <InfoRow
                        label="Rejection Reason"
                        value={registration.rejectionReason}
                        icon={XCircle}
                      />
                    )}
                  </SectionCard>
                </div>
              </div>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="mt-0">
              <SectionCard title="Uploaded Documents">
                <div className="space-y-3">
                  {registration.documents.map((doc: string, index: number) => (
                    <DocumentCard
                      key={index}
                      name={doc}
                      date={new Date(
                        registration.submittedAt,
                      ).toLocaleDateString()}
                    />
                  ))}
                </div>
              </SectionCard>
            </TabsContent>

            {/* Timeline Tab */}
            <TabsContent value="timeline" className="mt-0">
              <SectionCard title="Application Timeline">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="relative">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="absolute top-8 left-4 h-12 w-px bg-gray-200" />
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium">Application Submitted</p>
                      <p className="text-sm text-gray-500">
                        {new Date(registration.submittedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {registration.status === "approved" && (
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Application Approved</p>
                        <p className="text-sm text-gray-500">
                          {new Date(registration.approvedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {registration.status === "rejected" && (
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                        <XCircle className="h-4 w-4 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Application Rejected</p>
                        <p className="text-sm text-gray-500">
                          {new Date(registration.rejectedAt).toLocaleString()}
                        </p>
                        <p className="text-sm text-red-600 mt-1">
                          Reason: {registration.rejectionReason}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </SectionCard>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
