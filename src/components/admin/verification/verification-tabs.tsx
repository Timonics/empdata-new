"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NINVerifications } from "./nin-verifications";
import { DocumentVerifications } from "./document-verification";
import { CompanyVerifications } from "./company-verifications";

export function VerificationTabs() {
  const [activeTab, setActiveTab] = useState("nin");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="grid w-full max-w-md grid-cols-3">
        <TabsTrigger value="nin">NIN Verifications</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="companies">Companies</TabsTrigger>
      </TabsList>

      <TabsContent value="nin" className="space-y-6">
        <NINVerifications />
      </TabsContent>

      <TabsContent value="documents" className="space-y-6">
        <DocumentVerifications />
      </TabsContent>

      <TabsContent value="companies" className="space-y-6">
        <CompanyVerifications />
      </TabsContent>
    </Tabs>
  );
}
