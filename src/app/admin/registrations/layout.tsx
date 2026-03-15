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
    if (pathname === "/admin/registrations") {
      setActiveTab("group-life");
      router.push("/admin/registrations/group-life");
    } else {
      const tab = pathname.split("/").pop() || "group-life";
      setActiveTab(tab);
    }
  }, [pathname, router]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    router.push(`/admin/registrations/${value}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Registrations</h2>
        <p className="text-muted-foreground">
          Manage all insurance applications and registrations
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-6"
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="group-life">Group Life</TabsTrigger>
          <TabsTrigger value="individual">Individual</TabsTrigger>
          {/* <TabsTrigger value="corporate">Corporate</TabsTrigger> */}
        </TabsList>

        {children}
      </Tabs>
    </div>
  );
}
