"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye } from "lucide-react";
import { cn, getDocumentUrl } from "@/lib/utils";

export interface RegistrationDocument {
  name: string;
  url?: string | null;
}

interface DocumentListProps {
  documents: RegistrationDocument[];
  status?: string;
  emptyMessage?: string;
}

export function DocumentList({
  documents,
  status,
  emptyMessage = "No documents uploaded",
}: DocumentListProps) {
  const available = documents.filter((d) => getDocumentUrl(d.url));

  if (available.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <FileText className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {documents.map((doc) => {
        const openUrl = getDocumentUrl(doc.url);
        const downloadUrl = getDocumentUrl(doc.url, true);

        return (
          <div
            key={doc.name}
            className="flex items-center justify-between p-3 bg-card rounded-lg border hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <FileText className="h-5 w-5 text-blue-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{doc.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-muted-foreground">
                    {openUrl ? "Ready to view" : "Not uploaded"}
                  </p>
                  {status && openUrl && (
                    <>
                      <span className="text-xs text-gray-300">•</span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          status === "verified" &&
                            "bg-green-50 text-green-700 border-green-200",
                          status === "not_verified" &&
                            "bg-orange-50 text-orange-700 border-orange-200",
                        )}
                      >
                        {status === "verified" ? "Verified" : "Pending"}
                      </Badge>
                    </>
                  )}
                </div>
              </div>
            </div>
            {openUrl && downloadUrl && (
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  title="Open document"
                  onClick={() => window.open(openUrl, "_blank", "noopener")}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                  <a
                    href={downloadUrl}
                    download
                    title="Download document"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Download className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
