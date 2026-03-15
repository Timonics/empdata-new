import { IndividualRegistrations } from "@/components/admin/registrations/individual-registrations";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Individual Registrations - EMPDATA Admin",
  description: "Manage individual insurance registrations",
};

export default function IndividualPage() {
  return <IndividualRegistrations />;
}
