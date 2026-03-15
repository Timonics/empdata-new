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
  Clock,
  Shield,
  User,
  Building2,
  Download,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { VerificationDrawer } from './verification-drawer';
import { useEmployeeVerifications, useVerifyNIN, useRejectNIN } from '@/hooks/queries/useVerifications';
import { formatDistanceToNow } from 'date-fns';

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  verified: 'bg-green-100 text-green-800 border-green-200',
  failed: 'bg-red-100 text-red-800 border-red-200',
  in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
};

const verificationProgress = {
  pending: 30,
  in_progress: 60,
  verified: 100,
  failed: 100,
};

export function NINVerifications() {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [drawerVerification, setDrawerVerification] = useState<any | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'failed'>('all');
  
  // Modal states
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Fetch data
  const { data, isLoading, refetch, isFetching } = useEmployeeVerifications({
    status: filter === 'all' ? undefined : filter,
  });

  const verifyMutation = useVerifyNIN();
  const rejectMutation = useRejectNIN();

  const verifications = data?.data || [];
  const pagination = data?.pagination;

  const handleVerify = (item: any) => {
    setSelectedItem(item);
    setShowVerifyDialog(true);
  };

  const handleReject = (item: any) => {
    setSelectedItem(item);
    setShowRejectDialog(true);
    setRejectionReason('');
  };

  const handleConfirmVerify = () => {
    if (!selectedItem) return;
    
    verifyMutation.mutate(selectedItem.id, {
      onSuccess: () => {
        setShowVerifyDialog(false);
        setSelectedItem(null);
      },
    });
  };

  const handleConfirmReject = () => {
    if (!selectedItem || !rejectionReason.trim()) return;
    
    rejectMutation.mutate(
      { id: selectedItem.id, reason: rejectionReason },
      {
        onSuccess: () => {
          setShowRejectDialog(false);
          setSelectedItem(null);
          setRejectionReason('');
        },
      }
    );
  };

  const columns = [
    {
      header: 'Employee',
      cell: (item: any) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border">
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {item.first_name?.[0]}{item.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{item.first_name} {item.last_name}</p>
            <p className="text-xs text-muted-foreground">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Company',
      cell: (item: any) => (
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{item.company_name}</span>
        </div>
      ),
    },
    {
      header: 'NIN',
      cell: (item: any) => (
        <code className="rounded bg-gray-100 px-2 py-1 text-xs">
          {item.nin || '•••••••••••'}
        </code>
      ),
    },
    {
      header: 'Status',
      cell: (item: any) => (
        <div className="space-y-2">
          <Badge
            variant="outline"
            className={cn(
              "font-medium",
              statusStyles[item.nin_status as keyof typeof statusStyles] || 'bg-gray-100'
            )}
          >
            {item.nin_status || 'pending'}
          </Badge>
          <Progress 
            value={verificationProgress[item.nin_status as keyof typeof verificationProgress] || 0} 
            className="h-1 w-20" 
          />
        </div>
      ),
    },
    {
      header: 'Attempts',
      cell: (item: any) => (
        <Badge variant="outline" className="bg-gray-50">
          {item.nin_attempts || 1}/3
        </Badge>
      ),
    },
    {
      header: 'Submitted',
      cell: (item: any) => (
        <div>
          <span className="text-sm">
            {item.submitted_at ? new Date(item.submitted_at).toLocaleDateString() : 'N/A'}
          </span>
          <p className="text-xs text-muted-foreground">
            {item.submitted_at ? formatDistanceToNow(new Date(item.submitted_at), { addSuffix: true }) : ''}
          </p>
        </div>
      ),
    },
    {
      header: 'Actions',
      cell: (item: any) => (
        <div className="flex items-center gap-2">
          {item.nin_status === 'pending' && (
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
          {item.nin_status === 'failed' && (
            <Button
              variant="ghost"
              size="icon"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={() => handleVerify(item)}
              title="Retry"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setDrawerVerification(item)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Download NIN Slip
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
            variant={filter === 'failed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('failed')}
            className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
          >
            Failed
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
          data={verifications}
          columns={columns}
          isLoading={isLoading}
          pagination={pagination ? {
            currentPage: pagination.current_page,
            totalPages: pagination.last_page,
            totalItems: pagination.total,
            onPageChange: (page) => console.log('Page change:', page),
          } : undefined}
          emptyMessage="No NIN verifications found"
        />
      </div>

      {drawerVerification && (
        <VerificationDrawer
          verification={drawerVerification}
          type="nin"
          open={!!drawerVerification}
          onOpenChange={() => setDrawerVerification(null)}
        />
      )}

      {/* Verify Confirmation Dialog */}
      <AlertDialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Verify NIN
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>
                  Are you sure you want to verify NIN for{' '}
                  <span className="font-semibold">
                    {selectedItem?.first_name} {selectedItem?.last_name}
                  </span>?
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
                'Verify NIN'
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
              Reject NIN
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting NIN for{' '}
              <span className="font-semibold">
                {selectedItem?.first_name} {selectedItem?.last_name}
              </span>.
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
                setSelectedItem(null);
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
                'Reject NIN'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}