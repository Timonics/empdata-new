import { GroupLifeRegistrations } from "@/components/admin/registrations/group-life-registrations";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Group Life Registrations - EMPDATA Admin",
  description: "Manage group life insurance registrations",
};

export default function GroupLifePage() {
  return <GroupLifeRegistrations />;
}
