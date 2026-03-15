'use client';

import { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MoreHorizontal,
  Eye,
  Download,
  Trash2,
  FileText,
  FileImage,
  FileSpreadsheet,
  File,
  Share2,
  Copy,
  Move,
  Tag,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DocumentPreviewDrawer } from './document-preview-drawe';
import { DeleteDocumentDialog } from './delete-document-dialog';
import { ShareDocumentDialog } from './share-document-dialog';

// Mock data - replace with actual API data
const documents = [
  {
    id: 1,
    name: 'Certificate of Incorporation.pdf',
    type: 'pdf',
    category: 'CAC Documents',
    size: '2.4 MB',
    uploadedBy: 'John Adeleke',
    uploadedAt: '2024-03-15T10:30:00',
    status: 'verified',
    verifiedAt: '2024-03-16T14:20:00',
    expiryDate: '2025-03-15',
    tags: ['cac', 'legal', 'incorporation'],
    version: 1,
    description: 'Official CAC certificate of incorporation',
  },
  {
    id: 2,
    name: 'Tax Clearance Certificate 2024.pdf',
    type: 'pdf',
    category: 'Tax Certificates',
    size: '1.8 MB',
    uploadedBy: 'Sarah Okafor',
    uploadedAt: '2024-03-14T09:15:00',
    status: 'verified',
    verifiedAt: '2024-03-15T11:30:00',
    expiryDate: '2024-12-31',
    tags: ['tax', 'firs', 'annual'],
    version: 2,
    description: 'Annual tax clearance certificate',
  },
  {
    id: 3,
    name: 'Group Life Insurance Policy.pdf',
    type: 'pdf',
    category: 'Insurance Policies',
    size: '3.2 MB',
    uploadedBy: 'Michael Okonkwo',
    uploadedAt: '2024-03-13T11:45:00',
    status: 'pending',
    tags: ['insurance', 'group-life', 'policy'],
    version: 1,
    description: 'Group life insurance policy document',
  },
  {
    id: 4,
    name: 'Employee List March 2024.xlsx',
    type: 'xlsx',
    category: 'Employee Records',
    size: '856 KB',
    uploadedBy: 'Grace Ogunleye',
    uploadedAt: '2024-03-12T08:30:00',
    status: 'verified',
    verifiedAt: '2024-03-12T16:45:00',
    tags: ['employees', 'payroll', 'march'],
    version: 3,
    description: 'Current employee roster',
  },
  {
    id: 5,
    name: 'Audited Financial Statements 2023.pdf',
    type: 'pdf',
    category: 'Financial Reports',
    size: '5.1 MB',
    uploadedBy: 'Chidi Nnamdi',
    uploadedAt: '2024-03-11T13:20:00',
    status: 'rejected',
    rejectionReason: 'Document is not properly signed',
    tags: ['financial', 'audit', 'annual'],
    version: 1,
    description: '2023 audited financial statements',
  },
  {
    id: 6,
    name: 'Company Logo.png',
    type: 'png',
    category: 'Brand Assets',
    size: '245 KB',
    uploadedBy: 'Amara Eze',
    uploadedAt: '2024-03-10T15:40:00',
    status: 'verified',
    verifiedAt: '2024-03-11T09:20:00',
    tags: ['brand', 'logo', 'image'],
    version: 2,
    description: 'Official company logo',
  },
  {
    id: 7,
    name: 'Employee NIN Slips.zip',
    type: 'zip',
    category: 'Employee Records',
    size: '12.5 MB',
    uploadedBy: 'John Adeleke',
    uploadedAt: '2024-03-09T11:10:00',
    status: 'pending',
    tags: ['nin', 'employees', 'verification'],
    version: 1,
    description: 'Collection of employee NIN slips',
  },
];

const statusStyles = {
  verified: 'bg-green-100 text-green-800 border-green-200',
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
};

const fileIcons = {
  pdf: FileText,
  doc: FileText,
  docx: FileText,
  xls: FileSpreadsheet,
  xlsx: FileSpreadsheet,
  ppt: File,
  pptx: File,
  jpg: FileImage,
  jpeg: FileImage,
  png: FileImage,
  gif: FileImage,
  zip: File,
  rar: File,
  default: File,
};

const formatFileSize = (size: string) => {
  return size;
};

const getFileIcon = (type: string) => {
  return fileIcons[type as keyof typeof fileIcons] || fileIcons.default;
};

export function CompanyDocumentsTable() {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [previewDocument, setPreviewDocument] = useState<typeof documents[0] | null>(null);
  const [deleteDocument, setDeleteDocument] = useState<typeof documents[0] | null>(null);
  const [shareDocument, setShareDocument] = useState<typeof documents[0] | null>(null);

  const toggleAllRows = () => {
    if (selectedRows.length === documents.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(documents.map(d => d.id));
    }
  };

  const toggleRow = (id: number) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const columns = [
    {
      header: 'Document',
      cell: (item: typeof documents[0]) => {
        const FileIcon = getFileIcon(item.type);
        return (
          <div className="flex items-center gap-3">
            <div className={cn(
              "h-10 w-10 rounded-lg flex items-center justify-center",
              item.type === 'pdf' ? "bg-red-50" :
              item.type.includes('sheet') ? "bg-green-50" :
              item.type.includes('image') ? "bg-blue-50" : "bg-gray-50"
            )}>
              <FileIcon className={cn(
                "h-5 w-5",
                item.type === 'pdf' ? "text-red-600" :
                item.type.includes('sheet') ? "text-green-600" :
                item.type.includes('image') ? "text-blue-600" : "text-gray-600"
              )} />
            </div>
            <div>
              <p className="font-medium">{item.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">{item.size}</span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">v{item.version}</span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      header: 'Category',
      accessorKey: 'category' as keyof typeof documents[0],
      cell: (item: typeof documents[0]) => (
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
          {item.category}
        </Badge>
      ),
    },
    {
      header: 'Uploaded',
      cell: (item: typeof documents[0]) => (
        <div>
          <p className="text-sm">{item.uploadedBy}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(item.uploadedAt).toLocaleDateString()}
          </p>
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status' as keyof typeof documents[0],
      cell: (item: typeof documents[0]) => (
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
      header: 'Expiry',
      cell: (item: typeof documents[0]) => {
        if (!item.expiryDate) return <span className="text-sm text-muted-foreground">—</span>;
        
        const daysUntilExpiry = Math.ceil(
          (new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );
        
        return (
          <div className="flex items-center gap-2">
            <Clock className={cn(
              "h-4 w-4",
              daysUntilExpiry < 30 ? "text-red-500" :
              daysUntilExpiry < 60 ? "text-yellow-500" : "text-green-500"
            )} />
            <span className="text-sm">
              {new Date(item.expiryDate).toLocaleDateString()}
            </span>
          </div>
        );
      },
    },
    {
      header: 'Actions',
      cell: (item: typeof documents[0]) => (
        <div className="flex items-center gap-2">
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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShareDocument(item)}
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                Copy Link
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Move className="mr-2 h-4 w-4" />
                Move to Folder
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Tag className="mr-2 h-4 w-4" />
                Edit Tags
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setDeleteDocument(item)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      className: 'w-32',
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  return (
    <>
      <div className="rounded-md border bg-white">
        <DataTable
          data={documents}
          columns={columns}
          pagination={{
            currentPage,
            totalPages,
            onPageChange: setCurrentPage,
          }}
        />
      </div>

      {previewDocument && (
        <DocumentPreviewDrawer
          document={previewDocument}
          open={!!previewDocument}
          onOpenChange={() => setPreviewDocument(null)}
        />
      )}

      {deleteDocument && (
        <DeleteDocumentDialog
          document={deleteDocument}
          open={!!deleteDocument}
          onOpenChange={() => setDeleteDocument(null)}
        />
      )}

      {shareDocument && (
        <ShareDocumentDialog
          document={shareDocument}
          open={!!shareDocument}
          onOpenChange={() => setShareDocument(null)}
        />
      )}
    </>
  );
}