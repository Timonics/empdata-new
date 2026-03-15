"use client";

import { useState } from "react";
import { RegistrationStats } from "./registration-stats";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  CheckCircle,
  XCircle,
  Building2,
  Calendar,
  FileText,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RegistrationDrawer } from "./registration-drawer";

// Mock data for corporate registrations
const registrations = [
  {
    id: 1,
    companyName: "AfriHealth Medical Services",
    rcNumber: "RC-345678",
    contactPerson: "Dr. Michael Okonkwo",
    email: "michael@afrihealth.ng",
    phone: "+234 803 456 7890",
    employees: 89,
    planType: "Corporate Health Insurance",
    coverage: "₦50M",
    status: "pending",
    submittedAt: "2024-03-16T11:45:00",
    documents: ["cac.pdf", "tax-certificate.pdf", "employee-list.xlsx"],
    directorName: "Dr. Michael Okonkwo",
    directorBVN: "********9012",
  },
  // Add more mock data...
];

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  approved: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
  verified: "bg-blue-100 text-blue-800 border-blue-200",
};

export function CorporateRegistrations() {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [drawerRegistration, setDrawerRegistration] = useState<
    (typeof registrations)[0] | null
  >(null);
  const [drawerMode, setDrawerMode] = useState<"view" | "edit">("view");

  const columns = [
    {
      header: "Company",
      cell: (item: (typeof registrations)[0]) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border">
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {item.companyName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{item.companyName}</p>
            <p className="text-xs text-muted-foreground">{item.rcNumber}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Contact Person",
      cell: (item: (typeof registrations)[0]) => (
        <div>
          <p className="text-sm">{item.contactPerson}</p>
          <p className="text-xs text-muted-foreground">{item.email}</p>
        </div>
      ),
    },
    {
      header: "Plan Type",
      accessorKey: "planType" as keyof (typeof registrations)[0],
      cell: (item: (typeof registrations)[0]) => (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200"
        >
          {item.planType}
        </Badge>
      ),
    },
    // {
    //   header: "Employees",
    //   accessorKey: "employees" as keyof (typeof registrations)[0],
    //   cell: (item: (typeof registrations)[0]) => (
    //     <div className="flex items-center gap-2">
    //       <Users className="h-4 w-4 text-gray-400" />
    //       <span>{item.employees}</span>
    //     </div>
    //   ),
    // },
    // {
    //   header: "Coverage",
    //   accessorKey: "coverage" as keyof (typeof registrations)[0],
    //   cell: (item: (typeof registrations)[0]) => (
    //     <span className="font-medium">{item.coverage}</span>
    //   ),
    // },
    {
      header: "Status",
      accessorKey: "status" as keyof (typeof registrations)[0],
      cell: (item: (typeof registrations)[0]) => (
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
      header: "Submitted",
      accessorKey: "submittedAt" as keyof (typeof registrations)[0],
      cell: (item: (typeof registrations)[0]) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm">
            {new Date(item.submittedAt).toLocaleDateString()}
          </span>
        </div>
      ),
    },
    {
      header: "Actions",
      cell: (item: (typeof registrations)[0]) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-green-600 hover:text-green-700 hover:bg-green-50"
            onClick={() => console.log("Approve", item.id)}
          >
            <CheckCircle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => console.log("Reject", item.id)}
          >
            <XCircle className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setDrawerRegistration(item);
                  setDrawerMode("view");
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                View Documents
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      className: "w-24",
    },
  ];

  return (
    <div className="space-y-6">
      <RegistrationStats type="corporate" />

      <div className="rounded-md border bg-white">
        <DataTable
          data={registrations}
          columns={columns}
          pagination={{
            currentPage: 1,
            totalPages: 5,
            onPageChange: (page) => console.log("Page change:", page),
          }}
        />
      </div>

      {drawerRegistration && (
        <RegistrationDrawer
          registration={drawerRegistration}
          type="corporate"
          open={!!drawerRegistration}
          onOpenChange={() => setDrawerRegistration(null)}
          mode={drawerMode}
          onModeChange={(mode) => setDrawerMode(mode)}
        />
      )}
    </div>
  );
}
