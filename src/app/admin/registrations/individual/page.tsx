import { Metadata } from "next";
import { IndividualRegistrations } from "@/components/admin/individual/individual-registrations";

export const metadata: Metadata = {
  title: "Individual Registrations - EMPDATA Admin",
  description: "Manage individual insurance registrations",
};

export default function IndividualPage() {
  return (
    <div className="space-y-6">
      <IndividualRegistrations />
    </div>
  );
}
