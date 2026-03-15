"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  Filter,
  Mail,
  Search,
  SlidersHorizontal,
  UserPlus,
} from "lucide-react";
import { SendInvitationDrawer } from "./send-invitation-drawer";
import { ExportModal } from "@/components/export-modal";

export function InvitationsHeader() {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showSendDrawer, setShowSendDrawer] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Invitations</h2>
          <p className="text-muted-foreground">
            Send and manage employee invitations to join the portal
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download
              className="mr-2 h-4 w-4"
              onClick={() => setShowExportModal(true)}
            />
            Export
          </Button>
          <Button size="sm" onClick={() => setShowSendDrawer(true)}>
            <Mail className="mr-2 h-4 w-4" />
            Send Invitation
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by email or name..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="employee">Employee</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <SendInvitationDrawer
        open={showSendDrawer}
        onOpenChange={setShowSendDrawer}
      />
      {/* <ExportModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        entityName="invitations"
        totalCount={156}
        // selectedCount={selectedRows.length}
        // filteredCount={filteredInvitations.length}
        columns={[
          { key: "email", label: "Email", default: true },
          { key: "name", label: "Name", default: true },
          { key: "role", label: "Role", default: true },
          { key: "department", label: "Department", default: true },
          { key: "status", label: "Status", default: true },
          { key: "sentAt", label: "Sent Date", default: true },
          { key: "expiresAt", label: "Expires", default: true },
          { key: "acceptedAt", label: "Accepted Date", default: false },
        ]}
        onExport={async (options) => {
          // Implement your export logic
        }}
      /> */}
    </>
  );
}
