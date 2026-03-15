"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  Building2,
  Shield,
  ShieldCheck,
  ShieldX,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EmployeeDrawer } from "./employee-drawer";

// Mock data - replace with actual data from API
const employees = [
  {
    id: 1,
    firstName: "John",
    lastName: "Adeleke",
    email: "john.adeleke@techcorp.com",
    phone: "+234 801 234 5678",
    employeeId: "EMP-001",
    company: "TechCorp Solutions Ltd",
    companyId: 1,
    department: "Engineering",
    position: "Senior Developer",
    status: "verified",
    ninVerified: true,
    ninSubmitted: true,
    dateJoined: "2024-01-15",
    dateOfBirth: "1990-05-12",
    gender: "Male",
    address: "12 Lekki Phase 1",
    city: "Lagos",
    state: "Lagos State",
    country: "Nigeria",
    beneficiaries: 3,
    policies: 2,
  },
  {
    id: 2,
    firstName: "Sarah",
    lastName: "Okafor",
    email: "sarah.okafor@globalindustries.ng",
    phone: "+234 802 345 6789",
    employeeId: "EMP-002",
    company: "Global Industries Nigeria",
    companyId: 2,
    department: "Finance",
    position: "Financial Controller",
    status: "verified",
    ninVerified: true,
    ninSubmitted: true,
    dateJoined: "2023-11-20",
    dateOfBirth: "1985-08-23",
    gender: "Female",
    address: "23 Trans-Amadi",
    city: "Port Harcourt",
    state: "Rivers State",
    country: "Nigeria",
    beneficiaries: 2,
    policies: 3,
  },
  {
    id: 3,
    firstName: "Michael",
    lastName: "Okonkwo",
    email: "michael.okonkwo@afrihealth.ng",
    phone: "+234 803 456 7890",
    employeeId: "EMP-003",
    company: "AfriHealth Medical Services",
    companyId: 3,
    department: "Medical",
    position: "Chief Medical Officer",
    status: "pending",
    ninVerified: false,
    ninSubmitted: true,
    dateJoined: "2024-03-01",
    dateOfBirth: "1978-11-30",
    gender: "Male",
    address: "45 Wuse Zone 5",
    city: "Abuja",
    state: "FCT",
    country: "Nigeria",
    beneficiaries: 4,
    policies: 1,
  },
  {
    id: 4,
    firstName: "Grace",
    lastName: "Ogunleye",
    email: "grace.ogunleye@edufirst.edu.ng",
    phone: "+234 804 567 8901",
    employeeId: "EMP-004",
    company: "EduFirst Schools",
    companyId: 4,
    department: "Administration",
    position: "School Administrator",
    status: "verified",
    ninVerified: true,
    ninSubmitted: true,
    dateJoined: "2023-08-10",
    dateOfBirth: "1982-03-17",
    gender: "Female",
    address: "78 Ring Road",
    city: "Ibadan",
    state: "Oyo State",
    country: "Nigeria",
    beneficiaries: 2,
    policies: 4,
  },
  {
    id: 5,
    firstName: "Chidi",
    lastName: "Nnamdi",
    email: "chidi.nnamdi@greenenergy.ng",
    phone: "+234 805 678 9012",
    employeeId: "EMP-005",
    company: "Green Energy Solutions",
    companyId: 5,
    department: "Operations",
    position: "Operations Manager",
    status: "inactive",
    ninVerified: false,
    ninSubmitted: false,
    dateJoined: "2024-02-15",
    dateOfBirth: "1988-07-09",
    gender: "Male",
    address: "34 Mary Slessor Avenue",
    city: "Calabar",
    state: "Cross River State",
    country: "Nigeria",
    beneficiaries: 0,
    policies: 0,
  },
  {
    id: 6,
    firstName: "Amara",
    lastName: "Eze",
    email: "amara.eze@techcorp.com",
    phone: "+234 806 789 0123",
    employeeId: "EMP-006",
    company: "TechCorp Solutions Ltd",
    companyId: 1,
    department: "HR",
    position: "HR Manager",
    status: "verified",
    ninVerified: true,
    ninSubmitted: true,
    dateJoined: "2024-01-20",
    dateOfBirth: "1987-12-03",
    gender: "Female",
    address: "45 Victoria Island",
    city: "Lagos",
    state: "Lagos State",
    country: "Nigeria",
    beneficiaries: 2,
    policies: 2,
  },
];

const statusStyles = {
  verified: "bg-green-100 text-green-800 border-green-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  inactive: "bg-gray-100 text-gray-800 border-gray-200",
  suspended: "bg-red-100 text-red-800 border-red-200",
};

const ninStatusIcons = {
  verified: ShieldCheck,
  pending: Clock,
  not_submitted: ShieldX,
};

export function EmployeesTable() {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [drawerEmployee, setDrawerEmployee] = useState<
    (typeof employees)[0] | null
  >(null);
  const [drawerMode, setDrawerMode] = useState<"view" | "edit">("view");

  // Handle row selection
  const toggleAllRows = () => {
    if (selectedRows.length === employees.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(employees.map((e) => e.id));
    }
  };

  const toggleRow = (id: number) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleView = (employee: (typeof employees)[0]) => {
    setDrawerEmployee(employee);
    setDrawerMode("view");
  };

  const handleEdit = (employee: (typeof employees)[0]) => {
    setDrawerEmployee(employee);
    setDrawerMode("edit");
  };

  const getNINStatusIcon = (employee: (typeof employees)[0]) => {
    if (employee.ninVerified) return ShieldCheck;
    if (employee.ninSubmitted) return Clock;
    return ShieldX;
  };

  const getNINStatusColor = (employee: (typeof employees)[0]) => {
    if (employee.ninVerified) return "text-green-600";
    if (employee.ninSubmitted) return "text-yellow-600";
    return "text-red-600";
  };

  // Define columns for the DataTable
  const columns = [
    {
      header: (
        <Checkbox
          checked={selectedRows.length === employees.length}
          onCheckedChange={toggleAllRows}
        />
      ),
      accessorKey: "id" as keyof (typeof employees)[0],
      cell: (item: (typeof employees)[0]) => (
        <Checkbox
          checked={selectedRows.includes(item.id)}
          onCheckedChange={() => toggleRow(item.id)}
        />
      ),
      className: "w-12",
    },
    {
      header: "Employee",
      cell: (item: (typeof employees)[0]) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border">
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {item.firstName[0]}
              {item.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">
              {item.firstName} {item.lastName}
            </p>
            <p className="text-xs text-muted-foreground">{item.employeeId}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Company",
      accessorKey: "company" as keyof (typeof employees)[0],
      cell: (item: (typeof employees)[0]) => (
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{item.company}</span>
        </div>
      ),
    },
    {
      header: "Contact",
      cell: (item: (typeof employees)[0]) => (
        <div>
          <p className="text-sm">{item.email}</p>
          <p className="text-xs text-muted-foreground">{item.phone}</p>
        </div>
      ),
    },
    // {
    //   header: "Department",
    //   accessorKey: "department" as keyof (typeof employees)[0],
    //   cell: (item: (typeof employees)[0]) => (
    //     <span className="text-sm">{item.department}</span>
    //   ),
    // },
    {
      header: "Status",
      accessorKey: "status" as keyof (typeof employees)[0],
      cell: (item: (typeof employees)[0]) => (
        <Badge
          variant="outline"
          className={cn(
            "font-medium",
            statusStyles[item.status as keyof typeof statusStyles],
          )}
        >
          {item.status}
        </Badge>
      ),
    },
    {
      header: "NIN",
      cell: (item: (typeof employees)[0]) => {
        const Icon = getNINStatusIcon(item);
        return (
          <div className="flex items-center gap-2">
            <Icon className={cn("h-4 w-4", getNINStatusColor(item))} />
            <span className="text-sm">
              {item.ninVerified
                ? "Verified"
                : item.ninSubmitted
                  ? "Pending"
                  : "Not Submitted"}
            </span>
          </div>
        );
      },
    },
    {
      header: "Beneficiaries",
      accessorKey: "beneficiaries" as keyof (typeof employees)[0],
      cell: (item: (typeof employees)[0]) => (
        <span className="font-medium text-center block">
          {item.beneficiaries}
        </span>
      ),
      className: "text-center",
    },
    {
      header: "",
      cell: (item: (typeof employees)[0]) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleView(item)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEdit(item)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Employee
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Mail className="mr-2 h-4 w-4" />
              Send Email
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Phone className="mr-2 h-4 w-4" />
              Call
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      className: "w-12",
    },
  ];

  // Pagination state (mock)
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  return (
    <>
      <DataTable
        data={employees}
        columns={columns}
        isLoading={false}
        pagination={{
          currentPage,
          totalPages,
          onPageChange: setCurrentPage,
        }}
        emptyMessage="No employees found"
      />

      {/* Employee Drawer for View/Edit */}
      {drawerEmployee && (
        <EmployeeDrawer
          employee={drawerEmployee}
          open={!!drawerEmployee}
          onOpenChange={() => setDrawerEmployee(null)}
          mode={drawerMode}
          onModeChange={(mode) => setDrawerMode(mode)}
          onSave={async (data) => {
            console.log("Saving employee:", data);
            // Implement save logic here
          }}
        />
      )}
    </>
  );
}
