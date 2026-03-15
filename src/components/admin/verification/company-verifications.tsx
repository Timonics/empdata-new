'use client';

import { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
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
  CheckCircle,
  XCircle,
  Building2,
  FileText,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CompanyVerificationDrawer } from './company-verification-drawer';
import { useCompanyVerifications} from '@/hooks/queries/useVerifications';
import { formatDistanceToNow } from 'date-fns';

const statusStyles = {
  pending_approval: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  approved: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
  in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
};

const verificationStatusStyles = {
  not_verified: 'bg-orange-100 text-orange-800 border-orange-200',
  verified: 'bg-purple-100 text-purple-800 border-purple-200',
};

const documentStatusColors = {
  verified: 'text-green-600',
  pending: 'text-yellow-600',
  rejected: 'text-red-600',
};

export function CompanyVerifications() {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [drawerCompany, setDrawerCompany] = useState<any | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const { data, isLoading, refetch, isFetching } = useCompanyVerifications({
    status: filter === 'all' ? undefined : filter === 'verified' ? 'approved' : filter,
    page: currentPage,
    per_page: pageSize,
  });

  const companies = data?.data || [];
  const pagination = data?.pagination;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns = [
    {
      header: 'Company',
      cell: (item: any) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border">
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {item.company_name
                ?.split(' ')
                .map((n: string) => n[0])
                .join('')
                .slice(0, 2) || 'CO'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{item.company_name}</p>
            <p className="text-xs text-muted-foreground">{item.rc_number}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Contact',
      cell: (item: any) => (
        <div>
          <p className="text-sm">{item.email_address}</p>
          <p className="text-xs text-muted-foreground">{item.phone_number}</p>
        </div>
      ),
    },
    {
      header: 'Documents',
      cell: (item: any) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileText className="h-3 w-3 text-gray-400" />
            <span className="text-xs">CAC</span>
            <Badge
              variant="outline"
              className={cn(
                "text-xs",
                item.verification_status === 'verified' 
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : 'bg-orange-50 text-orange-700 border-orange-200'
              )}
            >
              {item.verification_status === 'verified' ? '✓' : '⋯'}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-3 w-3 text-gray-400" />
            <span className="text-xs">Tax</span>
            <Badge
              variant="outline"
              className={cn(
                "text-xs",
                item.verification_status === 'verified' 
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : 'bg-orange-50 text-orange-700 border-orange-200'
              )}
            >
              {item.verification_status === 'verified' ? '✓' : '⋯'}
            </Badge>
          </div>
        </div>
      ),
    },
    {
      header: 'Progress',
      cell: (item: any) => {
        const steps = item.verification_status === 'verified' ? 4 : 2;
        const total = 4;
        return (
          <div className="space-y-2 min-w-25">
            <Progress value={(steps / total) * 100} className="h-2" />
            <span className="text-xs text-muted-foreground">
              {steps}/{total} steps
            </span>
          </div>
        );
      },
    },
    {
      header: 'Status',
      cell: (item: any) => (
        <div className="space-y-1">
          <Badge
            variant="outline"
            className={cn(
              "font-medium",
              statusStyles[item.status as keyof typeof statusStyles] || 'bg-gray-100'
            )}
          >
            {item.status?.replace('_', ' ')}
          </Badge>
          <Badge
            variant="outline"
            className={cn(
              "font-medium",
              verificationStatusStyles[item.verification_status as keyof typeof verificationStatusStyles] || 'bg-gray-100'
            )}
          >
            {item.verification_status === 'verified' ? 'Verified' : 'Not Verified'}
          </Badge>
        </div>
      ),
    },
    {
      header: 'Submitted',
      cell: (item: any) => (
        <div>
          <span className="text-sm">
            {new Date(item.submitted_at).toLocaleDateString()}
          </span>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(item.submitted_at), { addSuffix: true })}
          </p>
        </div>
      ),
    },
    {
      header: 'Actions',
      cell: (item: any) => (
        <div className="flex items-center gap-2">
          {item.status === 'pending_approval' && (
            <Button
              variant="ghost"
              size="icon"
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={() => console.log('Verify', item.id)}
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDrawerCompany(item)}
          >
            <Eye className="h-4 w-4" />
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
                <FileText className="mr-2 h-4 w-4" />
                View Documents
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      className: 'w-24',
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
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw className={cn("h-4 w-4 mr-2", isFetching && "animate-spin")} />
          Refresh
        </Button>
      </div>

      <div className="rounded-md border bg-white">
        <DataTable
          data={companies}
          columns={columns}
          isLoading={isLoading}
          pagination={pagination ? {
            currentPage: pagination.current_page,
            totalPages: pagination.last_page,
            totalItems: pagination.total,
            onPageChange: handlePageChange,
          } : undefined}
          emptyMessage="No company verifications found"
        />
      </div>

      {drawerCompany && (
        <CompanyVerificationDrawer
          company={drawerCompany}
          open={!!drawerCompany}
          onOpenChange={() => setDrawerCompany(null)}
        />
      )}
    </div>
  );
}