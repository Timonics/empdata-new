import { Metadata } from 'next';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Company Reset Password - EMPDATA',
  description: 'Set your new company portal password',
};

export default function CompanyResetPasswordPage() {
  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Set new company password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your new password below
        </p>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm role="company" />
      </Suspense>
    </>
  );
}