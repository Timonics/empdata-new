// app/admin/settings/page.tsx
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronDown,
  ChevronRight,
  Shield,
  Users,
  Key,
  Plus,
  Edit,
  Trash2,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Building2,
  FileText,
  BarChart3,
  FileCheck,
  Lock,
  UserCog,
} from "lucide-react";
import {
  useCurrentAdmin,
  usePermissions,
  useRoles,
  useAdminUsers,
  useCreateRole,
  useUpdateRolePermissions,
  useDeleteRole,
  useCreateAdminUser,
  useAssignRolesToUser,
  useDeleteAdminUser,
} from "@/hooks/queries/useAdminRoles";

// Permission groups with icons and descriptions
const permissionGroups: Record<string, { label: string; icon: any; description: string }> = {
  company_registrations: { 
    label: "Company Registrations", 
    icon: Building2,
    description: "Manage company KYC submissions, approvals, and invitations"
  },
  employee_registrations: { 
    label: "Employee Registrations", 
    icon: Users,
    description: "Manage employee KYC submissions, approvals, and verifications"
  },
  individual_registrations: { 
    label: "Individual Registrations", 
    icon: FileText,
    description: "Manage individual KYC submissions and approvals"
  },
  companies: { 
    label: "Companies", 
    icon: Building2,
    description: "View and manage company profiles"
  },
  portal_users: { 
    label: "Portal Users", 
    icon: Users,
    description: "Manage portal user invitations and access"
  },
  analytics: { 
    label: "Analytics", 
    icon: BarChart3,
    description: "View analytics dashboards and reports"
  },
  audit_logs: { 
    label: "Audit Logs", 
    icon: FileCheck,
    description: "View and export audit trail logs"
  },
  documents: { 
    label: "Documents", 
    icon: FileText,
    description: "Upload, download, and manage documents"
  },
  two_factor: { 
    label: "2FA Management", 
    icon: Lock,
    description: "Reset user two-factor authentication"
  },
  admin_users: { 
    label: "Admin Users", 
    icon: UserCog,
    description: "Create and manage admin users"
  },
  roles_permissions: { 
    label: "Role Management", 
    icon: Shield,
    description: "Create and manage admin roles"
  },
};

const systemRoles = [
  { name: "super-admin", description: "Full access — bypasses all permission checks", color: "purple" },
  { name: "kyc-manager", description: "Full KYC workflow: view, edit, approve, reject, verify, invite, bulk upload, export", color: "blue" },
  { name: "kyc-reviewer", description: "View + approve/reject/verify — no edit or invite", color: "green" },
  { name: "external", description: "Read-only access across all sections", color: "gray" },
  { name: "analytics-viewer", description: "Analytics endpoints only", color: "orange" },
  { name: "auditor", description: "Audit log read-only", color: "indigo" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("roles");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(["analytics"]));
  
  // Modal states
  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false);
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false);
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [isAssignRolesOpen, setIsAssignRolesOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  // Form states
  const [newRoleName, setNewRoleName] = useState("");
  const [newRolePermissions, setNewRolePermissions] = useState<string[]>([]);
  const [editRolePermissions, setEditRolePermissions] = useState<string[]>([]);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRoles, setNewUserRoles] = useState<string[]>([]);
  const [assignRoles, setAssignRoles] = useState<string[]>([]);

  // Data fetching hooks
  const { data: currentAdmin, isLoading: currentLoading } = useCurrentAdmin();
  const { data: permissions, isLoading: permissionsLoading } = usePermissions();
  const { data: roles, isLoading: rolesLoading } = useRoles();
  const { data: adminUsers, isLoading: usersLoading } = useAdminUsers();

  // Mutation hooks
  const createRole = useCreateRole();
  const updateRolePermissions = useUpdateRolePermissions();
  const deleteRole = useDeleteRole();
  const createAdminUser = useCreateAdminUser();
  const assignRolesToUser = useAssignRolesToUser();
  const deleteAdminUser = useDeleteAdminUser();

  console.log(currentAdmin);

  const isSuperAdmin = currentAdmin?.data?.roles?.includes("super-admin") || false;

  // Group permissions by prefix
  const groupedPermissions = permissions?.data?.reduce((acc: Record<string, string[]>, perm: string) => {
    const group = perm.split("_")[0];
    if (!acc[group]) acc[group] = [];
    acc[group].push(perm);
    return acc;
  }, {}) || {};

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      return next;
    });
  };

  const handleCreateRole = () => {
    if (!newRoleName.trim()) {
      alert("Role name is required");
      return;
    }
    createRole.mutate({ name: newRoleName, permissions: newRolePermissions });
    setIsCreateRoleOpen(false);
    setNewRoleName("");
    setNewRolePermissions([]);
  };

  const handleUpdateRole = () => {
    if (selectedRole) {
      updateRolePermissions.mutate({ id: selectedRole.id, permissions: editRolePermissions });
      setIsEditRoleOpen(false);
    }
  };

  const handleDeleteRole = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete role "${name}"?`)) {
      deleteRole.mutate(id);
    }
  };

  const handleCreateUser = () => {
    if (!newUserName.trim() || !newUserEmail.trim()) {
      alert("Name and email are required");
      return;
    }
    createAdminUser.mutate({ name: newUserName, email: newUserEmail, roles: newUserRoles });
    setIsCreateUserOpen(false);
    setNewUserName("");
    setNewUserEmail("");
    setNewUserRoles([]);
  };

  const handleAssignRoles = () => {
    if (selectedUser) {
      assignRolesToUser.mutate({ id: selectedUser.id, roles: assignRoles });
      setIsAssignRolesOpen(false);
    }
  };

  const handleDeleteUser = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete user "${name}"?`)) {
      deleteAdminUser.mutate(id);
    }
  };

  if (currentLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isSuperAdmin) {
    return (
      <div className="p-6">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <CardTitle>Access Denied</CardTitle>
            </div>
            <CardDescription>
              You need super-admin privileges to access this page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage roles, permissions, and admin user access
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Roles & Permissions
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Admin Users
          </TabsTrigger>
        </TabsList>

        {/* Roles & Permissions Tab */}
        <TabsContent value="roles" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setIsCreateRoleOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Custom Role
            </Button>
          </div>

          <div className="grid gap-6">
            {/* System Roles */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  System Roles
                </CardTitle>
                <CardDescription>
                  Predefined roles that cannot be modified or deleted
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {roles?.data?.filter((r: any) => r.is_system).map((role: any) => {
                    const systemRole = systemRoles.find(sr => sr.name === role.name);
                    return (
                      <div
                        key={role.id}
                        className="flex items-start justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Shield className="h-4 w-4 text-blue-600" />
                            <span className="font-semibold text-gray-900">{role.name}</span>
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">System</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {systemRole?.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {role.permissions?.slice(0, 6).map((perm: string) => (
                              <Badge key={perm} variant="secondary" className="text-xs bg-white">
                                {perm}
                              </Badge>
                            ))}
                            {role.permissions?.length > 6 && (
                              <Badge variant="secondary" className="text-xs">
                                +{role.permissions.length - 6} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedRole(role);
                            setEditRolePermissions(role.permissions);
                            setIsEditRoleOpen(true);
                          }}
                          className="ml-4"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Custom Roles */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Key className="h-5 w-5 text-emerald-600" />
                  Custom Roles
                </CardTitle>
                <CardDescription>
                  Create and manage custom roles with specific permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {roles?.data?.filter((r: any) => !r.is_system).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Key className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No custom roles created yet</p>
                    <Button
                      variant="link"
                      onClick={() => setIsCreateRoleOpen(true)}
                      className="mt-2"
                    >
                      Create your first custom role
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {roles?.data?.filter((r: any) => !r.is_system).map((role: any) => (
                      <div
                        key={role.id}
                        className="flex items-start justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Key className="h-4 w-4 text-emerald-600" />
                            <span className="font-semibold text-gray-900">{role.name}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {role.permissions?.slice(0, 6).map((perm: string) => (
                              <Badge key={perm} variant="secondary" className="text-xs bg-white">
                                {perm}
                              </Badge>
                            ))}
                            {role.permissions?.length > 6 && (
                              <Badge variant="secondary" className="text-xs">
                                +{role.permissions.length - 6} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedRole(role);
                              setEditRolePermissions(role.permissions);
                              setIsEditRoleOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteRole(role.id, role.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Permissions Reference */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-purple-600" />
                  Permissions Reference
                </CardTitle>
                <CardDescription>
                  All available permissions grouped by module
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(groupedPermissions).map(([group, perms]) => {
                    const groupInfo = permissionGroups[group as keyof typeof permissionGroups];
                    const isExpanded = expandedGroups.has(group);
                    return (
                      <div key={group} className="border rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleGroup(group)}
                          className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            {groupInfo?.icon ? <groupInfo.icon className="h-4 w-4 text-gray-500" /> : <Key className="h-4 w-4 text-gray-500" />}
                            <span className="font-medium">{groupInfo?.label || group}</span>
                            <Badge variant="secondary" className="text-xs">{perms.length} permissions</Badge>
                          </div>
                          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </button>
                        {isExpanded && (
                          <div className="p-3 bg-white border-t">
                            {groupInfo?.description && (
                              <p className="text-sm text-muted-foreground mb-3">{groupInfo.description}</p>
                            )}
                            <div className="flex flex-wrap gap-2">
                              {perms.map((perm) => (
                                <Badge key={perm} variant="outline" className="font-mono text-xs">
                                  {perm}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Admin Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setIsCreateUserOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Admin User
            </Button>
          </div>

          <Card className="border-0 shadow-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>2FA</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" />
                    </TableCell>
                  </TableRow>
                ) : adminUsers?.data?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No admin users found
                    </TableCell>
                  </TableRow>
                ) : (
                  adminUsers?.data?.map((user: any) => (
                    <TableRow key={user.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.roles?.map((role: string) => (
                            <Badge key={role} variant="secondary" className="text-xs">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.two_factor_setup ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Enabled
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-500">
                            <XCircle className="h-3 w-3 mr-1" />
                            Disabled
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setAssignRoles(user.roles || []);
                              setIsAssignRolesOpen(true);
                            }}
                          >
                            <Shield className="h-4 w-4 mr-1" />
                            Roles
                          </Button>
                          {user.email !== currentAdmin?.data?.email && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id, user.name)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Role Modal */}
      <Dialog open={isCreateRoleOpen} onOpenChange={setIsCreateRoleOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-emerald-600" />
              Create Custom Role
            </DialogTitle>
            <DialogDescription>
              Create a new role with specific permissions for admin users
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Role Name</Label>
              <Input
                placeholder="e.g., compliance-officer"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Permissions</Label>
              <div className="mt-2 space-y-2 max-h-100 overflow-y-auto border rounded-lg p-3">
                {Object.entries(groupedPermissions).map(([group, perms]) => {
                  const groupInfo = permissionGroups[group as keyof typeof permissionGroups];
                  const allSelected = perms.every(p => newRolePermissions.includes(p));
                  const someSelected = perms.some(p => newRolePermissions.includes(p));
                  return (
                    <div key={group} className="border-b pb-2 last:border-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Checkbox
                          checked={allSelected}
                          className={someSelected && !allSelected ? "data-[state=checked]:bg-gray-500" : ""}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setNewRolePermissions([...new Set([...newRolePermissions, ...perms])]);
                            } else {
                              setNewRolePermissions(newRolePermissions.filter(p => !perms.includes(p)));
                            }
                          }}
                        />
                        <span className="font-medium">{groupInfo?.label || group}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 ml-6">
                        {perms.map((perm) => (
                          <div key={perm} className="flex items-center gap-1">
                            <Checkbox
                              id={`create-${perm}`}
                              checked={newRolePermissions.includes(perm)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setNewRolePermissions([...newRolePermissions, perm]);
                                } else {
                                  setNewRolePermissions(newRolePermissions.filter(p => p !== perm));
                                }
                              }}
                            />
                            <Label htmlFor={`create-${perm}`} className="text-xs font-mono cursor-pointer">
                              {perm}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateRoleOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateRole} disabled={createRole.isPending} className="bg-blue-600 hover:bg-blue-700">
              {createRole.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Permissions Modal */}
      <Dialog open={isEditRoleOpen} onOpenChange={setIsEditRoleOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-blue-600" />
              Edit Role: {selectedRole?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedRole?.is_system ? "View permissions for system role" : "Modify permissions for this role"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 max-h-125 overflow-y-auto">
            {Object.entries(groupedPermissions).map(([group, perms]) => {
              const groupInfo = permissionGroups[group as keyof typeof permissionGroups];
              const allSelected = perms.every(p => editRolePermissions.includes(p));
              const someSelected = perms.some(p => editRolePermissions.includes(p));
              return (
                <div key={group} className="border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    {!selectedRole?.is_system && (
                      <Checkbox
                        checked={allSelected}
                        className={someSelected && !allSelected ? "data-[state=checked]:bg-gray-500" : ""}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setEditRolePermissions([...new Set([...editRolePermissions, ...perms])]);
                          } else {
                            setEditRolePermissions(editRolePermissions.filter(p => !perms.includes(p)));
                          }
                        }}
                      />
                    )}
                    <span className="font-medium">{groupInfo?.label || group}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 ml-6">
                    {perms.map((perm) => (
                      <div key={perm} className="flex items-center gap-1">
                        {!selectedRole?.is_system ? (
                          <>
                            <Checkbox
                              id={`edit-${perm}`}
                              checked={editRolePermissions.includes(perm)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setEditRolePermissions([...editRolePermissions, perm]);
                                } else {
                                  setEditRolePermissions(editRolePermissions.filter(p => p !== perm));
                                }
                              }}
                            />
                            <Label htmlFor={`edit-${perm}`} className="text-xs font-mono cursor-pointer">
                              {perm}
                            </Label>
                          </>
                        ) : (
                          <Badge variant={editRolePermissions.includes(perm) ? "default" : "outline"} className="text-xs">
                            {perm}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditRoleOpen(false)}>Close</Button>
            {!selectedRole?.is_system && (
              <Button onClick={handleUpdateRole} disabled={updateRolePermissions.isPending} className="bg-blue-600 hover:bg-blue-700">
                {updateRolePermissions.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Admin User Modal */}
      <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5 text-blue-600" />
              Add Admin User
            </DialogTitle>
            <DialogDescription>
              Create a new admin user with specific role assignments
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input
                placeholder="John Doe"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Email Address</Label>
              <Input
                type="email"
                placeholder="john@example.com"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Assign Roles</Label>
              <div className="mt-2 space-y-2 max-h-48 overflow-y-auto border rounded-lg p-3">
                {roles?.data?.map((role: any) => (
                  <div key={role.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`role-${role.id}`}
                      checked={newUserRoles.includes(role.name)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setNewUserRoles([...newUserRoles, role.name]);
                        } else {
                          setNewUserRoles(newUserRoles.filter(r => r !== role.name));
                        }
                      }}
                    />
                    <Label htmlFor={`role-${role.id}`} className="cursor-pointer">
                      {role.name}
                      {role.is_system && <Badge variant="outline" className="ml-2 text-xs">System</Badge>}
                    </Label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                The user will receive an email with instructions to set their password
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateUserOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateUser} disabled={createAdminUser.isPending} className="bg-blue-600 hover:bg-blue-700">
              {createAdminUser.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Roles Modal */}
      <Dialog open={isAssignRolesOpen} onOpenChange={setIsAssignRolesOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Assign Roles to {selectedUser?.name}
            </DialogTitle>
            <DialogDescription>
              Select the roles this admin user should have
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {roles?.data?.map((role: any) => (
              <div key={role.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg">
                <Checkbox
                  id={`assign-${role.id}`}
                  checked={assignRoles.includes(role.name)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setAssignRoles([...assignRoles, role.name]);
                    } else {
                      setAssignRoles(assignRoles.filter(r => r !== role.name));
                    }
                  }}
                />
                <Label htmlFor={`assign-${role.id}`} className="cursor-pointer flex-1">
                  {role.name}
                  {role.is_system && <Badge variant="outline" className="ml-2 text-xs">System</Badge>}
                </Label>
                {role.user_count !== undefined && (
                  <span className="text-xs text-muted-foreground">{role.user_count} users</span>
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignRolesOpen(false)}>Cancel</Button>
            <Button onClick={handleAssignRoles} disabled={assignRolesToUser.isPending} className="bg-blue-600 hover:bg-blue-700">
              {assignRolesToUser.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}