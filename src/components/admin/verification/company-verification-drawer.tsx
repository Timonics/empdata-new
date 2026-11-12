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
  X,
  Eye,
  Download,
} from "lucide-react";
import { cn, formatDateSafe, getDocumentUrl } from "@/lib/utils";

interface CompanyVerificationDrawerProps {
  company: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  pending_approval: "bg-yellow-100 text-yellow-800 border-yellow-200",
  verified: "bg-green-100 text-green-800 border-green-200",
  approved: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
  not_verified: "bg-orange-100 text-orange-800 border-orange-200",
};

// Normalize an API company-registration record into the shape this
// drawer consumes, tolerating either naming convention.
function resolveCompany(c: any) {
  if (!c) return null;
  const status = c.status || c.verification_status || "pending";
  const docStatus =
    c.verification_status === "verified"
      ? "verified"
      : c.verification_status === "not_verified"
        ? "pending"
        : status;

  const docUrls = c.document_urls || {};
  const documents = [
    {
      key: "cac",
      name: "CAC Registration Certificate",
      url: c.cac_document || docUrls.cac_document,
      status: docStatus,
    },
    {
      key: "director_id",
      name: "Director's Identity Card",
      url: c.director_identity_cards || docUrls.director_identity_cards,
      status: docStatus,
    },
    {
      key: "director_passport",
      name: "Director's Passport Photograph",
      url: c.director_passport_photograph || docUrls.director_passport_photograph,
      status: docStatus,
    },
  ];

  const verifiedCount =
    status === "approved" || status === "verified"
      ? documents.length
      : documents.filter((d) => getDocumentUrl(d.url)).length;

  return {
    ...c,
    name: c.company_name ?? c.name ?? "",
    rcNumber: c.rc_number ?? c.rcNumber ?? "",
    email: c.email_address ?? c.email ?? "",
    phone: c.phone_number ?? c.phone ?? "",
    submittedAt: c.submitted_at ?? c.submittedAt ?? null,
    verifiedAt: c.approved_at ?? c.verified_at ?? c.verifiedAt ?? null,
    rejectionReason: c.rejection_reason ?? c.rejectionReason ?? "",
    status,
    documents,
    verifiedCount,
  };
}

export function CompanyVerificationDrawer({
  company: rawCompany,
  open,
  onOpenChange,
}: CompanyVerificationDrawerProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const company = resolveCompany(rawCompany);
  if (!company) return null;

  const progress =
    company.status === "approved" || company.status === "verified"
      ? 100
      : company.status === "rejected"
        ? 100
        : Math.round((company.verifiedCount / company.documents.length) * 100);

  const InfoRow = ({
    label,
    value,
    icon: Icon,
  }: {
    label: string;
    value: string;
    icon?: any;
  }) => (
    <div className="flex items-start gap-3 py-3 border-b border-border/70 last:border-0">
      {Icon && <Icon className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
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
    <div className="bg-muted/60 rounded-lg p-5">
      <h3 className="text-sm font-medium text-gray-700 mb-4">{title}</h3>
      <div className="space-y-1">{children}</div>
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-5xl lg:max-w-6xl xl:max-w-7xl max-w-[95vw]! p-0 overflow-y-auto [&>div]:max-w-none! data-[side=right]:max-w-none!">
        {/* Header */}
        <div className="bg-navy-900 text-white p-6 sticky top-0 z-20">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center">
                <Building2 className="h-7 w-7" />
              </div>
              <div>
                <SheetTitle className="text-white text-xl">
                  {company.name || "Company"}
                </SheetTitle>
                <p className="text-blue-100 text-sm mt-1">
                  RC: {company.rcNumber || "—"}
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

          {/* Status and Progress */}
          <div className="mt-4 space-y-3">
            <Badge
              variant="outline"
              className={cn(
                "px-3 py-1",
                "bg-white/20 text-white border-white/30",
                statusStyles[company.status] || statusStyles.pending,
              )}
            >
              {String(company.status).replace("_", " ")}
            </Badge>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>Verification Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 bg-blue-400" />
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
                    value={formatDateSafe(company.submittedAt)}
                    icon={Calendar}
                  />
                  {company.verifiedAt && (
                    <InfoRow
                      label="Verified On"
                      value={formatDateSafe(company.verifiedAt)}
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
                  {company.documents.map((doc: any) => (
                    <div key={doc.key} className="bg-card p-3 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            statusStyles[doc.status] || statusStyles.pending,
                          )}
                        >
                          {String(doc.status).replace("_", " ")}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium">{doc.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {getDocumentUrl(doc.url) ? "Uploaded" : "Not uploaded"}
                      </p>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </TabsContent>

            <TabsContent value="documents" className="mt-0">
              <SectionCard title="Uploaded Documents">
                <div className="space-y-2">
                  {company.documents.map((doc: any) => {
                    const openUrl = getDocumentUrl(doc.url);
                    const downloadUrl = getDocumentUrl(doc.url, true);
                    return (
                      <div
                        key={doc.key}
                        className="flex items-center justify-between py-2"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {openUrl ? "Ready to view" : "Not uploaded"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs",
                              statusStyles[doc.status] || statusStyles.pending,
                            )}
                          >
                            {String(doc.status).replace("_", " ")}
                          </Badge>
                          {openUrl && downloadUrl && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                title="Open document"
                                onClick={() =>
                                  window.open(openUrl, "_blank", "noopener")
                                }
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                asChild
                              >
                                <a
                                  href={downloadUrl}
                                  download
                                  title="Download document"
                                >
                                  <Download className="h-4 w-4" />
                                </a>
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </SectionCard>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer Actions */}
        {company.status === "pending" ||
        company.status === "pending_approval" ? (
          <div className="border-t p-6 bg-muted/60 sticky bottom-0">
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
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
