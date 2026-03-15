'use client';

import { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  FileText,
  Download,
  Building2,
  User,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DocumentPreview } from './document-preview';
import { useCompanyVerifications, useEmployeeVerifications } from '@/hooks/queries/useVerifications';
import { useVerifyDocument, useRejectDocument } from '@/hooks/queries/useVerifications';
import { formatDistanceToNow } from 'date-fns';

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  verified: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
};

const documentTypeIcons = {
  'CAC Registration': FileText,
  'NIN Slip': FileText,
  'Utility Bill': FileText,
  'Passport Photograph': FileText,
  'Tax Certificate': FileText,
  'Identity Card': FileText,
  'Director Identity': FileText,
};

// Combine company and employee documents
const useAllDocuments = () => {
  const { data: companies, isLoading: companiesLoading } = useCompanyVerifications();
  const { data: employees, isLoading: employeesLoading } = useEmployeeVerifications();

  const companyDocs = companies?.data?.flatMap((company: any) => [
    {
      id: `company-${company.id}-cac`,
      type: 'CAC Registration',
      fileName: `cac-${company.company_name?.toLowerCase().replace(/\s+/g, '-')}.pdf`,
      fileSize: '2.4 MB',
      uploadedBy: company.director_name || 'N/A',
      entityType: 'company',
      entityName: company.company_name,
      entityId: company.id,
      uploadedAt: company.submitted_at,
      status: company.verification_status || 'pending',
      description: 'Certificate of Incorporation',
      documentType: 'cac',
    },
    {
      id: `company-${company.id}-identity`,
      type: 'Director Identity',
      fileName: `identity-${company.company_name?.toLowerCase().replace(/\s+/g, '-')}.pdf`,
      fileSize: '1.8 MB',
      uploadedBy: company.director_name || 'N/A',
      entityType: 'company',
      entityName: company.company_name,
      entityId: company.id,
      uploadedAt: company.submitted_at,
      status: company.verification_status || 'pending',
      description: 'Director Identity Card',
      documentType: 'identity',
    },
  ]) || [];

  const employeeDocs = employees?.data?.flatMap((employee: any) => [
    {
      id: `employee-${employee.id}-nin`,
      type: 'NIN Slip',
      fileName: `nin-${employee.first_name?.toLowerCase()}-${employee.last_name?.toLowerCase()}.pdf`,
      fileSize: '1.2 MB',
      uploadedBy: `${employee.first_name} ${employee.last_name}`,
      entityType: 'employee',
      entityName: `${employee.first_name} ${employee.last_name}`,
      entityId: employee.id,
      uploadedAt: employee.submitted_at,
      status: employee.nin_status || 'pending',
      description: 'National Identity Number Slip',
      documentType: 'nin',
    },
    {
      id: `employee-${employee.id}-passport`,
      type: 'Passport Photograph',
      fileName: `passport-${employee.first_name?.toLowerCase()}-${employee.last_name?.toLowerCase()}.jpg`,
      fileSize: '0.8 MB',
      uploadedBy: `${employee.first_name} ${employee.last_name}`,
      entityType: 'employee',
      entityName: `${employee.first_name} ${employee.last_name}`,
      entityId: employee.id,
      uploadedAt: employee.submitted_at,
      status: employee.verification_status || 'pending',
      description: 'Recent passport photograph',
      documentType: 'passport',
    },
  ]) || [];

  const allDocs = [...companyDocs, ...employeeDocs].sort((a, b) => 
    new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  );

  return {
    data: allDocs,
    isLoading: companiesLoading || employeesLoading,
  };
};

export function DocumentVerifications() {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [previewDocument, setPreviewDocument] = useState<any | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  
  // Modal states
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const { data: documents, isLoading } = useAllDocuments();
  const verifyMutation = useVerifyDocument();
  const rejectMutation = useRejectDocument();

  const filteredData = filter === 'all' 
    ? documents 
    : documents.filter((d: any) => d.status === filter);

  const handleVerify = (doc: any) => {
    setSelectedDoc(doc);
    setShowVerifyDialog(true);
  };

  const handleReject = (doc: any) => {
    setSelectedDoc(doc);
    setShowRejectDialog(true);
    setRejectionReason('');
  };

  const handleConfirmVerify = () => {
    if (!selectedDoc) return;
    
    verifyMutation.mutate({
      type: selectedDoc.entityType,
      id: selectedDoc.entityId,
      documentType: selectedDoc.documentType,
    }, {
      onSuccess: () => {
        setShowVerifyDialog(false);
        setSelectedDoc(null);
      },
    });
  };

  const handleConfirmReject = () => {
    if (!selectedDoc || !rejectionReason.trim()) return;
    
    rejectMutation.mutate({
      type: selectedDoc.entityType,
      id: selectedDoc.entityId,
      documentType: selectedDoc.documentType,
      reason: rejectionReason,
    }, {
      onSuccess: () => {
        setShowRejectDialog(false);
        setSelectedDoc(null);
        setRejectionReason('');
      },
    });
  };

  const columns = [
    {
      header: 'Document',
      cell: (item: any) => {
        const Icon = documentTypeIcons[item.type as keyof typeof documentTypeIcons] || FileText;
        return (
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <Icon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium">{item.type}</p>
              <p className="text-xs text-muted-foreground">{item.fileName}</p>
            </div>
          </div>
        );
      },
    },
    {
      header: 'Entity',
      cell: (item: any) => (
        <div className="flex items-center gap-2">
          {item.entityType === 'company' ? (
            <Building2 className="h-4 w-4 text-gray-400" />
          ) : (
            <User className="h-4 w-4 text-gray-400" />
          )}
          <div>
            <p className="text-sm">{item.entityName}</p>
            <p className="text-xs text-muted-foreground">Uploaded by {item.uploadedBy}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Size',
      cell: (item: any) => (
        <span className="text-sm text-muted-foreground">{item.fileSize}</span>
      ),
    },
    {
      header: 'Uploaded',
      cell: (item: any) => (
        <div>
          <span className="text-sm">
            {new Date(item.uploadedAt).toLocaleDateString()}
          </span>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(item.uploadedAt), { addSuffix: true })}
          </p>
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (item: any) => (
        <Badge
          variant="outline"
          className={cn(
            "font-medium",
            statusStyles[item.status as keyof typeof statusStyles]
          )}
        >
          {item.status}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      cell: (item: any) => (
        <div className="flex items-center gap-2">
          {item.status === 'pending' && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                onClick={() => handleVerify(item)}
                title="Verify"
                disabled={verifyMutation.isPending}
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleReject(item)}
                title="Reject"
                disabled={rejectMutation.isPending}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setPreviewDocument(item)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      ),
      className: 'w-32',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('pending')}
            className="bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-200"
          >
            Pending
          </Button>
          <Button
            variant={filter === 'verified' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('verified')}
            className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
          >
            Verified
          </Button>
          <Button
            variant={filter === 'rejected' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('rejected')}
            className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
          >
            Rejected
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-white">
        <DataTable
          data={filteredData || []}
          columns={columns}
          isLoading={isLoading}
          pagination={{
            currentPage: 1,
            totalPages: 1,
            onPageChange: () => {},
          }}
          emptyMessage="No documents found"
        />
      </div>

      {previewDocument && (
        <DocumentPreview
          document={previewDocument}
          open={!!previewDocument}
          onOpenChange={() => setPreviewDocument(null)}
        />
      )}

      {/* Verify Confirmation Dialog */}
      <AlertDialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Verify Document
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>
                  Are you sure you want to verify the{' '}
                  <span className="font-semibold">{selectedDoc?.type}</span> for{' '}
                  <span className="font-semibold">{selectedDoc?.entityName}</span>?
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={verifyMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmVerify}
              disabled={verifyMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {verifyMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Document'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" />
              Reject Document
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this document.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false);
                setSelectedDoc(null);
                setRejectionReason('');
              }}
              disabled={rejectMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmReject}
              disabled={rejectMutation.isPending || !rejectionReason.trim()}
            >
              {rejectMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rejecting...
                </>
              ) : (
                'Reject Document'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}