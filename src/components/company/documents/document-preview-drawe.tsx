"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Download,
  Share2,
  Trash2,
  X,
  Eye,
  Calendar,
  User,
  Tag,
  File,
  FileImage,
  FileSpreadsheet,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface DocumentPreviewDrawerProps {
  document: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusStyles = {
  verified: "bg-green-100 text-green-800 border-green-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
};

const getFileIcon = (type: string) => {
  if (type === "pdf") return FileText;
  if (type.includes("image")) return FileImage;
  if (type.includes("sheet") || type === "xlsx" || type === "xls")
    return FileSpreadsheet;
  return File;
};

export function DocumentPreviewDrawer({
  document,
  open,
  onOpenChange,
}: DocumentPreviewDrawerProps) {
  const [activeTab, setActiveTab] = useState("preview");

  if (!document) return null;

  const FileIcon = getFileIcon(document.type);
  const formattedDate = (date: string) => format(new Date(date), "PPP p");

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
      <SheetContent className="w-full sm:max-w-5xl lg:max-w-6xl max-w-[95vw]! p-0 overflow-y-auto [&>div]:max-w-none data-[side=right]:max-w-none">
        {/* Header */}
        <div className="bg-linear-to-r from-emerald-600 to-emerald-800 text-white p-6 sticky top-0 z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-lg bg-white/20 flex items-center justify-center">
                <FileIcon className="h-7 w-7" />
              </div>
              <div>
                <SheetTitle className="text-white text-xl">
                  {document.name}
                </SheetTitle>
                <p className="text-emerald-100 text-sm mt-1">
                  {document.size} • v{document.version} • {document.category}
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

          {/* Status and actions */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className={cn(
                  "px-3 py-1",
                  "bg-white/20 text-white border-white/30",
                  statusStyles[document.status as keyof typeof statusStyles],
                )}
              >
                {document.status}
              </Badge>
              {document.expiryDate && (
                <Badge
                  variant="outline"
                  className="bg-white/20 text-white border-white/30"
                >
                  Expires: {new Date(document.expiryDate).toLocaleDateString()}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="border-b px-6 sticky top-35 bg-white z-10">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full justify-start h-auto p-0 bg-transparent">
              <TabsTrigger
                value="preview"
                className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 rounded-none px-4 py-3"
              >
                Preview
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 rounded-none px-4 py-3"
              >
                Details
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 rounded-none px-4 py-3"
              >
                History
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        {/* Content */}
        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* Preview Tab */}
            <TabsContent value="preview" className="mt-0">
              <div className="bg-gray-100 rounded-lg p-8 min-h-100 flex items-center justify-center">
                <div className="text-center">
                  <FileIcon className="h-20 w-20 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 font-medium">{document.name}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Preview not available. Click download to view file.
                  </p>
                  <Button className="mt-4">
                    <Download className="h-4 w-4 mr-2" />
                    Download to View
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="mt-0 space-y-6">
              <SectionCard title="Document Information">
                <InfoRow
                  label="Document Name"
                  value={document.name}
                  icon={File}
                />
                <InfoRow
                  label="Category"
                  value={document.category}
                  icon={Tag}
                />
                <InfoRow
                  label="File Type"
                  value={document.type.toUpperCase()}
                  icon={File}
                />
                <InfoRow label="Size" value={document.size} icon={File} />
                <InfoRow
                  label="Version"
                  value={`v${document.version}`}
                  icon={Tag}
                />
              </SectionCard>

              <SectionCard title="Upload Information">
                <InfoRow
                  label="Uploaded By"
                  value={document.uploadedBy}
                  icon={User}
                />
                <InfoRow
                  label="Uploaded On"
                  value={formattedDate(document.uploadedAt)}
                  icon={Calendar}
                />
                {document.verifiedAt && (
                  <InfoRow
                    label="Verified On"
                    value={formattedDate(document.verifiedAt)}
                    icon={CheckCircle}
                  />
                )}
                {document.expiryDate && (
                  <InfoRow
                    label="Expiry Date"
                    value={formattedDate(document.expiryDate)}
                    icon={Clock}
                  />
                )}
                {document.rejectionReason && (
                  <InfoRow
                    label="Rejection Reason"
                    value={document.rejectionReason}
                    icon={AlertCircle}
                  />
                )}
              </SectionCard>

              {document.description && (
                <SectionCard title="Description">
                  <p className="text-sm text-gray-700">
                    {document.description}
                  </p>
                </SectionCard>
              )}

              {document.tags && document.tags.length > 0 && (
                <SectionCard title="Tags">
                  <div className="flex flex-wrap gap-2">
                    {document.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="bg-white">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </SectionCard>
              )}
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="mt-0">
              <SectionCard title="Version History">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="relative">
                      <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div className="absolute top-8 left-4 h-12 w-px bg-gray-200" />
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium">Version 3 uploaded</p>
                      <p className="text-sm text-gray-500">
                        By Grace Ogunleye • 2 days ago
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Size: 856 KB</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="relative">
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="absolute top-8 left-4 h-12 w-px bg-gray-200" />
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium">Version 2 uploaded</p>
                      <p className="text-sm text-gray-500">
                        By John Adeleke • 1 week ago
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Size: 1.2 MB</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Version 1 uploaded</p>
                      <p className="text-sm text-gray-500">
                        By Sarah Okafor • 2 weeks ago
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Size: 1.5 MB</p>
                    </div>
                  </div>
                </div>
              </SectionCard>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
