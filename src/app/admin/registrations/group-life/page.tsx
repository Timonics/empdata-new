import { Metadata } from 'next';
import { GroupLifeRegistrations } from '@/components/admin/registrations/group-life-registrations';

export const metadata: Metadata = {
  title: 'Company Group Life Registrations - EMPDATA Admin',
  description: 'Manage company group life insurance registrations',
};

export default function CompanyGroupLifePage() {
  return <GroupLifeRegistrations />;
}