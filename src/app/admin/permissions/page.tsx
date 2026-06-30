// app/admin/permissions/page.tsx
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Key, Eye, Edit, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { AdminRolesService } from '@/services/admin-roles.service';
import {
  useCurrentAdmin,
  useAdminUsers,
  useAssignRolesToUser,
  useDeleteAdminUser,
} from '@/hooks/queries/useAdminRoles';
import { Column } from '@/components/ui/data-table';

export default function PermissionsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: currentAdmin, isLoading: isCurrentLoading } = useCurrentAdmin();
  const { data: usersData, isLoading: isLoadingUsers, refetch } = useAdminUsers();
  const assignRoles = useAssignRolesToUser();
  const deleteUser = useDeleteAdminUser();

  const isSuperAdmin = currentAdmin?.data?.roles?.includes('super-admin');

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showDetailSheet, setShowDetailSheet] = useState(false);
  const [showEditRoles, setShowEditRoles] = useState(false);
  const [tempRoles, setTempRoles] = useState<string[]>([]);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);

  const users = usersData?.data || [];
  const filteredUsers = users.filter((u: any) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAssignRoles = () => {
    if (!selectedUser) return;
    assignRoles.mutate(
      { id: selectedUser.id, roles: tempRoles },
      {
        onSuccess: () => {
          toast.success('Roles updated');
          setShowEditRoles(false);
          refetch();
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || 'Failed to update roles');
        },
      }
    );
  };

  const handleDeleteUser = () => {
    if (!deleteUserId) return;
    deleteUser.mutate(deleteUserId, {
      onSuccess: () => {
        toast.success('User deleted');
        setDeleteUserId(null);
        refetch();
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to delete user');
      },
    });
  };

  const columns: Column<any>[] = [
    { header: 'Name', accessorKey: 'name' },
    { header: 'Email', accessorKey: 'email' },
    {
      header: 'Roles',
      cell: (item) => (
        <div className="flex flex-wrap gap-1">
          {item.roles?.map((role: string) => (
            <Badge key={role} variant="secondary" className="text-xs">
              {role}
            </Badge>
          ))}
          {(!item.roles || item.roles.length === 0) && (
            <span className="text-xs text-muted-foreground">No roles</span>
          )}
        </div>
      ),
    },
    {
      header: '2FA',
      cell: (item) =>
        item.two_factor_setup ? (
          <CheckCircle className="h-4 w-4 text-green-500" />
        ) : (
          <XCircle className="h-4 w-4 text-gray-400" />
        ),
    },
    {
      header: 'Actions',
      cell: (item) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedUser(item);
              setShowDetailSheet(true);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          {isSuperAdmin && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSelectedUser(item);
                  setTempRoles(item.roles || []);
                  setShowEditRoles(true);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              {item.email !== currentAdmin?.data?.email && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500"
                  onClick={() => setDeleteUserId(item.id)}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              )}
            </>
          )}
        </div>
      ),
    },
  ];

  if (isCurrentLoading || isLoadingUsers) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="h-7 w-7 text-blue-600" />
            Permissions
          </h1>
          <p className="text-muted-foreground">
            View and manage user roles and permissions
          </p>
        </div>
        {!isSuperAdmin && (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Read-only
          </Badge>
        )}
      </div>

      <DataTable
        data={filteredUsers}
        columns={columns}
        isLoading={isLoadingUsers}
        onSearch={setSearchQuery}
        searchPlaceholder="Search by name or email..."
        pagination={{
          currentPage: page,
          totalPages: Math.ceil(filteredUsers.length / 15),
          onPageChange: setPage,
        }}
      />

      {/* Detail Sheet */}
      <Sheet open={showDetailSheet} onOpenChange={setShowDetailSheet}>
        <SheetContent className="w-[500px] sm:w-[540px] overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle>User Permissions</SheetTitle>
            <SheetDescription>
              {selectedUser?.name} ({selectedUser?.email})
            </SheetDescription>
          </SheetHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Roles</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.roles?.map((role: string) => (
                    <Badge key={role} className="bg-blue-100 text-blue-800 border-blue-200">
                      {role}
                    </Badge>
                  ))}
                  {(!selectedUser.roles || selectedUser.roles.length === 0) && (
                    <span className="text-sm text-muted-foreground">No roles assigned</span>
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Permissions</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.all_permissions?.map((perm: string) => (
                    <Badge key={perm} variant="outline" className="bg-gray-50">
                      {perm}
                    </Badge>
                  ))}
                  {(!selectedUser.all_permissions || selectedUser.all_permissions.length === 0) && (
                    <span className="text-sm text-muted-foreground">No direct permissions</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Edit Roles Modal */}
      <Dialog open={showEditRoles} onOpenChange={setShowEditRoles}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-blue-600" />
              Edit Roles – {selectedUser?.name}
            </DialogTitle>
            <DialogDescription>
              Select which roles this user should have.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {['super-admin', 'kyc-manager', 'kyc-reviewer', 'analytics-viewer', 'auditor', 'external'].map((role) => {
                const isChecked = tempRoles.includes(role);
                return (
                  <Badge
                    key={role}
                    className={`cursor-pointer px-3 py-1 text-sm ${
                      isChecked
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    onClick={() => {
                      if (role === 'super-admin' && !isChecked && tempRoles.includes('super-admin')) {
                        // Allow toggling off, but maybe warn?
                      }
                      setTempRoles((prev) =>
                        prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
                      );
                    }}
                  >
                    {role}
                  </Badge>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              Click on a role to toggle it. Super‑admin bypasses all permission checks.
            </p>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowEditRoles(false)} disabled={assignRoles.isPending}>
              Cancel
            </Button>
            <Button onClick={handleAssignRoles} disabled={assignRoles.isPending}>
              {assignRoles.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this admin user.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteUser.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteUser.isPending}
            >
              {deleteUser.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}