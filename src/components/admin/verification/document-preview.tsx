'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Download, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DocumentPreviewProps {
  document: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  verified: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
};

export function DocumentPreview({ document, open, onOpenChange }: DocumentPreviewProps) {
  if (!document) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <div className="flex flex-col h-[80vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div>
              <DialogTitle className="text-lg">{document.type}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">{document.fileName}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  "font-medium",
                  statusStyles[document.status as keyof typeof statusStyles]
                )}
              >
                {document.status}
              </Badge>
              <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Document Preview */}
          <div className="flex-1 bg-gray-100 p-8 overflow-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 min-h-125 flex items-center justify-center">
              {/* This would be replaced with actual document viewer */}
              <div className="text-center">
                <div className="mb-4 text-gray-400">
                  <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-500">Document Preview</p>
                <p className="text-sm text-gray-400 mt-2">Size: {document.fileSize}</p>
              </div>
            </div>
          </div>

          {/* Footer with actions */}
          <div className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-muted-foreground">
              Uploaded by {document.uploadedBy} on {new Date(document.uploadedAt).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              {document.status === 'pending' && (
                <>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Verify
                  </Button>
                  <Button size="sm" variant="destructive">
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}