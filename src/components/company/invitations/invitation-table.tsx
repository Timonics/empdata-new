'use client';

import { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MoreHorizontal,
  Mail,
  RefreshCw,
  XCircle,
  CheckCircle,
  Clock,
  UserPlus,
  Eye,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { InvitationDetailsDrawer } from './invitation-details-drawer';
import { CancelInvitationDialog } from './cancel-invitation-dialog';
import { ResendInvitationDialog } from './resend-invitation-dialog';


// Mock data - replace with actual API data
const invitations = [
  {
    id: 1,
    email: 'john.doe@techcorp.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'Employee',
    department: 'Engineering',
    sentAt: '2024-03-15T10:30:00',
    expiresAt: '2024-03-22T10:30:00',
    status: 'pending',
    inviteLink: 'https://empdata.com/invite/abc123',
  },
  {
    id: 2,
    email: 'sarah.smith@techcorp.com',
    firstName: 'Sarah',
    lastName: 'Smith',
    role: 'Manager',
    department: 'Finance',
    sentAt: '2024-03-14T09:15:00',
    expiresAt: '2024-03-21T09:15:00',
    status: 'accepted',
    acceptedAt: '2024-03-15T14:20:00',
    inviteLink: 'https://empdata.com/invite/def456',
  },
  {
    id: 3,
    email: 'mike.johnson@techcorp.com',
    firstName: 'Mike',
    lastName: 'Johnson',
    role: 'Employee',
    department: 'Marketing',
    sentAt: '2024-03-13T11:45:00',
    expiresAt: '2024-03-20T11:45:00',
    status: 'pending',
    inviteLink: 'https://empdata.com/invite/ghi789',
  },
  {
    id: 4,
    email: 'emma.wilson@techcorp.com',
    firstName: 'Emma',
    lastName: 'Wilson',
    role: 'HR Admin',
    department: 'Human Resources',
    sentAt: '2024-03-12T08:30:00',
    expiresAt: '2024-03-19T08:30:00',
    status: 'expired',
    inviteLink: 'https://empdata.com/invite/jkl012',
  },
  {
    id: 5,
    email: 'david.brown@techcorp.com',
    firstName: 'David',
    lastName: 'Brown',
    role: 'Employee',
    department: 'Operations',
    sentAt: '2024-03-16T13:20:00',
    expiresAt: '2024-03-23T13:20:00',
    status: 'pending',
    inviteLink: 'https://empdata.com/invite/mno345',
  },
];

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  accepted: 'bg-green-100 text-green-800 border-green-200',
  expired: 'bg-red-100 text-red-800 border-red-200',
};

const statusIcons = {
  pending: Clock,
  accepted: CheckCircle,
  expired: XCircle,
};

export function InvitationsTable() {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [detailsInvitation, setDetailsInvitation] = useState<typeof invitations[0] | null>(null);
  const [resendInvitation, setResendInvitation] = useState<typeof invitations[0] | null>(null);
  const [cancelInvitation, setCancelInvitation] = useState<typeof invitations[0] | null>(null);

  const toggleAllRows = () => {
    if (selectedRows.length === invitations.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(invitations.map(i => i.id));
    }
  };

  const toggleRow = (id: number) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} left`;
    }
    return 'Expired';
  };

  const columns = [
    {
      header: 'Email',
      cell: (item: typeof invitations[0]) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border">
            <AvatarFallback className="bg-emerald-100 text-emerald-600">
              {item.firstName?.[0]}{item.lastName?.[0] || item.email[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{item.email}</p>
            <p className="text-xs text-muted-foreground">
              {item.firstName} {item.lastName}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: 'Role',
      cell: (item: typeof invitations[0]) => (
        <div>
          <p className="text-sm">{item.role}</p>
          <p className="text-xs text-muted-foreground">{item.department}</p>
        </div>
      ),
    },
    {
      header: 'Sent',
      accessorKey: 'sentAt' as keyof typeof invitations[0],
      cell: (item: typeof invitations[0]) => (
        <span className="text-sm text-muted-foreground">
          {new Date(item.sentAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Expires',
      cell: (item: typeof invitations[0]) => {
        const Icon = statusIcons[item.status as keyof typeof statusIcons];
        return (
          <div className="flex items-center gap-2">
            <Icon className={cn(
              "h-4 w-4",
              item.status === 'pending' && "text-yellow-600",
              item.status === 'accepted' && "text-green-600",
              item.status === 'expired' && "text-red-600"
            )} />
            <span className="text-sm">
              {item.status === 'accepted' 
                ? 'Accepted' 
                : item.status === 'expired' 
                  ? 'Expired' 
                  : getTimeRemaining(item.expiresAt)}
            </span>
          </div>
        );
      },
    },
    {
      header: 'Status',
      accessorKey: 'status' as keyof typeof invitations[0],
      cell: (item: typeof invitations[0]) => (
        <Badge
          variant="outline"
          className={cn(
            "font-medium",
            statusStyles[item.status as keyof typeof statusStyles]
          )}
        >
          {item.status}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      cell: (item: typeof invitations[0]) => (
        <div className="flex items-center gap-2">
          {item.status === 'pending' && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                onClick={() => setResendInvitation(item)}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => setCancelInvitation(item)}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDetailsInvitation(item)}
          >
            <Eye className="h-4 w-4" />
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
              <DropdownMenuItem>
                <Mail className="mr-2 h-4 w-4" />
                Copy Link
              </DropdownMenuItem>
              <DropdownMenuItem>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Manually
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      className: 'w-32',
    },
  ];

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;

  return (
    <>
      <div className="rounded-md border bg-white">
        <DataTable
          data={invitations}
          columns={columns}
          pagination={{
            currentPage,
            totalPages,
            onPageChange: setCurrentPage,
          }}
        />
      </div>

      {detailsInvitation && (
        <InvitationDetailsDrawer
          invitation={detailsInvitation}
          open={!!detailsInvitation}
          onOpenChange={() => setDetailsInvitation(null)}
        />
      )}

      {resendInvitation && (
        <ResendInvitationDialog
          invitation={resendInvitation}
          open={!!resendInvitation}
          onOpenChange={() => setResendInvitation(null)}
        />
      )}

      {cancelInvitation && (
        <CancelInvitationDialog
          invitation={cancelInvitation}
          open={!!cancelInvitation}
          onOpenChange={() => setCancelInvitation(null)}
        />
      )}
    </>
  );
}