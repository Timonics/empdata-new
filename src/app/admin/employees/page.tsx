import { Metadata } from "next";
import { EmployeesHeader } from "@/components/admin/employees/employee-header";
import { EmployeesStats } from "@/components/admin/employees/employee-stats";
import { EmployeesTable } from "@/components/admin/employees/employee-table";

export const metadata: Metadata = {
  title: "Employees - EMPDATA Admin",
  description: "Manage all employees across companies",
};

export default function EmployeesPage() {
  return (
    <div className="space-y-6">
      <EmployeesHeader />
      <EmployeesStats />
      <EmployeesTable />
    </div>
  );
}
