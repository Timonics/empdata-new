'use client';

import { useState } from 'react';
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
import { Mail, RefreshCw } from 'lucide-react';

interface ResendInvitationDialogProps {
  invitation: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResendInvitationDialog({ invitation, open, onOpenChange }: ResendInvitationDialogProps) {
  const [isResending, setIsResending] = useState(false);

  const handleResend = async () => {
    setIsResending(true);
    try {
      // TODO: Implement API call
      console.log('Resending invitation to:', invitation.email);
      await new Promise(resolve => setTimeout(resolve, 1000));
      onOpenChange(false);
    } catch (error) {
      console.error('Error resending invitation:', error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-blue-600" />
            Resend Invitation
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              Are you sure you want to resend the invitation to{' '}
              <span className="font-semibold">{invitation?.email}</span>?
            </p>
            <p className="text-sm text-gray-600">
              A new invitation email will be sent and the previous link will be invalidated.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isResending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleResend}
            disabled={isResending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isResending ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Resending...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                Resend Invitation
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}