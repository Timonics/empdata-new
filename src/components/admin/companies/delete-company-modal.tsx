'use client';

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
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useDeleteCompany } from '@/hooks/queries/useCompanies';

interface DeleteCompanyModalProps {
  company: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeleteCompanyModal({ company, open, onOpenChange, onSuccess }: DeleteCompanyModalProps) {
  const deleteMutation = useDeleteCompany();

  const handleDelete = async () => {
    if (!company) return;
    
    deleteMutation.mutate(company.id, {
      onSuccess: () => {
        onOpenChange(false);
        if (onSuccess) onSuccess();
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete Company
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              Are you sure you want to delete{' '}
              <span className="font-semibold">{company?.name}</span>?
            </p>
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded">
              This action cannot be undone. This will permanently delete:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600">
              <li>The company profile and all associated data</li>
              <li>All employee records under this company</li>
              <li>All insurance policies and claims</li>
              <li>Admin accounts and access permissions</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Company'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}