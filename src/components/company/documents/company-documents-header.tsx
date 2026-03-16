'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Download,
  Filter,
  Search,
  SlidersHorizontal,
  Upload,
  FolderPlus,
} from 'lucide-react';

import { ExportModal } from '@/components/export-modal';
import { CreateFolderDialog } from './create-folder-dialog';
import { UploadDocumentDrawer } from './upload-document-drawer';

export function CompanyDocumentsHeader() {
  const [showUploadDrawer, setShowUploadDrawer] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Documents</h2>
          <p className="text-muted-foreground">
            Upload and manage your company documents
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* <Button variant="outline" size="sm" onClick={() => setShowExportModal(true)}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button> */}
          <Button variant="outline" size="sm" onClick={() => setShowCreateFolder(true)}>
            <FolderPlus className="mr-2 h-4 w-4" />
            New Folder
          </Button>
          <Button size="sm" onClick={() => setShowUploadDrawer(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search documents by name or type..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="cac">CAC Documents</SelectItem>
              <SelectItem value="tax">Tax Certificates</SelectItem>
              <SelectItem value="insurance">Insurance Policies</SelectItem>
              <SelectItem value="employee">Employee Records</SelectItem>
              <SelectItem value="financial">Financial Reports</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all">
            <SelectTrigger className="w-35">
              <SelectValue placeholder="File Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="doc">Word</SelectItem>
              <SelectItem value="xls">Excel</SelectItem>
              <SelectItem value="jpg">Image</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <UploadDocumentDrawer open={showUploadDrawer} onOpenChange={setShowUploadDrawer} />
      <CreateFolderDialog open={showCreateFolder} onOpenChange={setShowCreateFolder} />
      
      {/* <ExportModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        entityName="documents"
        totalCount={156}
        columns={[
          { key: 'name', label: 'Document Name', default: true },
          { key: 'category', label: 'Category', default: true },
          { key: 'type', label: 'File Type', default: true },
          { key: 'size', label: 'Size', default: true },
          { key: 'uploadedBy', label: 'Uploaded By', default: true },
          { key: 'uploadedAt', label: 'Uploaded Date', default: true },
          { key: 'status', label: 'Status', default: true },
        ]}
        onExport={async (options) => {
          console.log('Exporting documents with options:', options);
        }}
      /> */}
    </>
  );
}