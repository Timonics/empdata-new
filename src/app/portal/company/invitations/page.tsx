import { Metadata } from "next";
import { InvitationsHeader } from "@/components/company/invitations/invitation-header";
import { InvitationsStats } from "@/components/company/invitations/invitation-stats";
import { InvitationsTable } from "@/components/company/invitations/invitation-table";

export const metadata: Metadata = {
  title: "Invitations - Company Portal",
  description: "Send and manage employee invitations",
};

export default function InvitationsPage() {
  return (
    <div className="space-y-6">
      <InvitationsHeader />
      <InvitationsStats />
      <InvitationsTable />
    </div>
  );
}
