import { Metadata } from "next";
import { EmployeeGroupLifeRegistrations } from "@/components/admin/registrations/employee-group-life-registrations";

export const metadata: Metadata = {
  title: "Employee Group Life Registrations - EMPDATA Admin",
  description: "Manage employee group life insurance registrations",
};

export default function EmployeeGroupLifePage() {
  return <EmployeeGroupLifeRegistrations />;
}
