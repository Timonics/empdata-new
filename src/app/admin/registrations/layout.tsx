"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RegistrationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("group-life");

  useEffect(() => {
    // Set active tab based on current path
    if (pathname.includes("/admin/registrations/group-life")) {
      setActiveTab("group-life");
    } else if (pathname.includes("/admin/registrations/employee-group-life")) {
      setActiveTab("employee-group-life");
    }
  }, [pathname]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    router.push(`/admin/registrations/${value}`);
  };

  return (
    <div className="space-y-6">
      {pathname.endsWith("individual") ? (
        <>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Individual Registrations
            </h2>
            <p className="text-muted-foreground">
              Manage individual insurance policy applications
            </p>
          </div>
          {children}
        </>
      ) : (
        <>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Group Life Registrations
            </h2>
            <p className="text-muted-foreground">
              Manage group life insurance applications for companies and
              employees
            </p>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="space-y-6"
          >
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="group-life">Company Group Life</TabsTrigger>
              <TabsTrigger value="employee-group-life">
                Employee Group Life
              </TabsTrigger>
            </TabsList>

            {children}
          </Tabs>
        </>
      )}{" "}
    </div>
  );
}
