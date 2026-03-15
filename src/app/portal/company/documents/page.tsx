import { Metadata } from 'next';
import { CompanyDocumentsHeader } from '@/components/company/documents/company-documents-header';
import { CompanyDocumentsStats } from '@/components/company/documents/company-documents-stats';
import { CompanyDocumentsTable } from '@/components/company/documents/company-documents-table';
import { DocumentCategories } from '@/components/company/documents/document-categories';

export const metadata: Metadata = {
  title: 'Documents - Company Portal',
  description: 'Manage your company documents and files',
};

export default function CompanyDocumentsPage() {
  return (
    <div className="space-y-6">
      <CompanyDocumentsHeader />
      <CompanyDocumentsStats />
      
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <DocumentCategories />
        </div>
        
        {/* Documents Table */}
        <div className="lg:col-span-3">
          <CompanyDocumentsTable />
        </div>
      </div>
    </div>
  );
}