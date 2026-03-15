"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Building2,
  Mail,
  Phone,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  X,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CompanyVerificationDrawerProps {
  company: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  verified: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
  in_progress: "bg-blue-100 text-blue-800 border-blue-200",
};

export function CompanyVerificationDrawer({
  company,
  open,
  onOpenChange,
}: CompanyVerificationDrawerProps) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!company) return null;

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

  const DocumentRow = ({
    name,
    status,
    uploadedAt,
  }: {
    name: string;
    status: string;
    uploadedAt: string;
  }) => (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        <FileText className="h-4 w-4 text-gray-400" />
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-gray-500">Uploaded {uploadedAt}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge
          variant="outline"
          className={cn(
            "text-xs",
            statusStyles[status as keyof typeof statusStyles],
          )}
        >
          {status}
        </Badge>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-5xl lg:max-w-6xl xl:max-w-7xl max-w-[95vw]! p-0 overflow-y-auto [&>div]:max-w-none! data-[side=right]:max-w-none!">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-blue-800 text-white p-6 sticky top-0 z-20">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center">
                <Building2 className="h-7 w-7" />
              </div>
              <div>
                <SheetTitle className="text-white text-xl">
                  {company.name}
                </SheetTitle>
                <p className="text-blue-100 text-sm mt-1">{company.rcNumber}</p>
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

          {/* Status and Progress */}
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className={cn(
                  "px-3 py-1",
                  "bg-white/20 text-white border-white/30",
                  statusStyles[company.status as keyof typeof statusStyles],
                )}
              >
                {company.status}
              </Badge>
              <span className="text-sm text-blue-100">
                {company.employees} Employees
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>Verification Progress</span>
                <span>
                  {company.completedSteps}/{company.totalSteps} steps
                </span>
              </div>
              <Progress
                value={(company.completedSteps / company.totalSteps) * 100}
                className="h-2 bg-blue-400"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b px-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full justify-start h-auto p-0 bg-transparent">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-4 py-3"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-4 py-3"
              >
                Documents
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Content */}
        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="overview" className="mt-0 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <SectionCard title="Company Information">
                  <InfoRow
                    label="Company Name"
                    value={company.name}
                    icon={Building2}
                  />
                  <InfoRow
                    label="RC Number"
                    value={company.rcNumber}
                    icon={FileText}
                  />
                  <InfoRow label="Email" value={company.email} icon={Mail} />
                  <InfoRow label="Phone" value={company.phone} icon={Phone} />
                </SectionCard>

                <SectionCard title="Submission Details">
                  <InfoRow
                    label="Submitted On"
                    value={new Date(company.submittedAt).toLocaleDateString()}
                    icon={Calendar}
                  />
                  {company.verifiedAt && (
                    <InfoRow
                      label="Verified On"
                      value={new Date(company.verifiedAt).toLocaleDateString()}
                      icon={CheckCircle}
                    />
                  )}
                  {company.rejectionReason && (
                    <InfoRow
                      label="Rejection Reason"
                      value={company.rejectionReason}
                      icon={XCircle}
                    />
                  )}
                </SectionCard>
              </div>

              <SectionCard title="Document Summary">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <Badge
                        variant="outline"
                        className={cn(
                          statusStyles[company.documents.cac.status],
                        )}
                      >
                        {company.documents.cac.status}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium">CAC Registration</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <Badge
                        variant="outline"
                        className={cn(
                          statusStyles[company.documents.tax.status],
                        )}
                      >
                        {company.documents.tax.status}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium">Tax Certificate</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <Badge
                        variant="outline"
                        className={cn(
                          statusStyles[company.documents.address.status],
                        )}
                      >
                        {company.documents.address.status}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium">Address Proof</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <Badge
                        variant="outline"
                        className={cn(
                          statusStyles[company.documents.directorId.status],
                        )}
                      >
                        {company.documents.directorId.status}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium">Director ID</p>
                  </div>
                </div>
              </SectionCard>
            </TabsContent>

            <TabsContent value="documents" className="mt-0">
              <SectionCard title="Uploaded Documents">
                <div className="space-y-2">
                  <DocumentRow
                    name="CAC Registration Certificate"
                    status={company.documents.cac.status}
                    uploadedAt={company.documents.cac.uploadedAt}
                  />
                  <DocumentRow
                    name="Tax Clearance Certificate"
                    status={company.documents.tax.status}
                    uploadedAt={company.documents.tax.uploadedAt}
                  />
                  <DocumentRow
                    name="Proof of Address"
                    status={company.documents.address.status}
                    uploadedAt={company.documents.address.uploadedAt}
                  />
                  <DocumentRow
                    name="Director's ID/Passport"
                    status={company.documents.directorId.status}
                    uploadedAt={company.documents.directorId.uploadedAt}
                  />
                </div>
              </SectionCard>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer Actions */}
        {company.status === "pending" && (
          <div className="border-t p-6 bg-gray-50 sticky bottom-0">
            <div className="flex items-center gap-3">
              <Button className="flex-1 bg-green-600 hover:bg-green-700">
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Company
              </Button>
              <Button className="flex-1" variant="destructive">
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
