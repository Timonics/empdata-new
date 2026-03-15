import { CorporateRegistrations } from '@/components/admin/registrations/corporate-registrations';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Corporate Registrations - EMPDATA Admin',
  description: 'Manage corporate insurance registrations',
};

export default function CorporatePage() {
  return <CorporateRegistrations />;
}