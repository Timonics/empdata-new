import { Metadata } from 'next';
import { VerificationStats } from '@/components/admin/verification/verification-stats';
import { VerificationTabs } from '@/components/admin/verification/verification-tabs';

export const metadata: Metadata = {
  title: 'Verification Status - EMPDATA Admin',
  description: 'Track and manage verifications for NIN, documents, and companies',
};

export default function VerificationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Verification Status</h2>
        <p className="text-muted-foreground">
          Track and manage NIN verifications, document reviews, and company compliance
        </p>
      </div>

      <VerificationStats />
      <VerificationTabs />
    </div>
  );
}