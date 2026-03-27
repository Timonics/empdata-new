import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminRolesService } from "@/services/admin-roles.service";
import { toast } from "sonner";

export const adminRolesKeys = {
  all: ["admin-roles"] as const,
  permissions: () => [...adminRolesKeys.all, "permissions"] as const,
  roles: () => [...adminRolesKeys.all, "roles"] as const,
  role: (id: number) => [...adminRolesKeys.roles(), id] as const,
  users: () => [...adminRolesKeys.all, "users"] as const,
  user: (id: number) => [...adminRolesKeys.users(), id] as const,
  current: () => [...adminRolesKeys.all, "current"] as const,
};

export function useCurrentAdmin() {
  return useQuery({
    queryKey: adminRolesKeys.current(),
    queryFn: () => AdminRolesService.getCurrentAdmin(),
  });
}

export function usePermissions() {
  return useQuery({
    queryKey: adminRolesKeys.permissions(),
    queryFn: () => AdminRolesService.getAllPermissions(),
  });
}

export function useRoles() {
  return useQuery({
    queryKey: adminRolesKeys.roles(),
    queryFn: () => AdminRolesService.getAllRoles(),
  });
}

export function useRole(id: number) {
  return useQuery({
    queryKey: adminRolesKeys.role(id),
    queryFn: () => AdminRolesService.getRole(id),
    enabled: !!id,
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AdminRolesService.createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminRolesKeys.roles() });
      toast.success("Role created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create role");
    },
  });
}

export function useUpdateRolePermissions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, permissions }: { id: number; permissions: string[] }) =>
      AdminRolesService.syncRolePermissions(id, permissions),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: adminRolesKeys.role(id) });
      queryClient.invalidateQueries({ queryKey: adminRolesKeys.roles() });
      toast.success("Role permissions updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update role permissions",
      );
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AdminRolesService.deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminRolesKeys.roles() });
      toast.success("Role deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Cannot delete system role");
    },
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: adminRolesKeys.users(),
    queryFn: AdminRolesService.getAllAdminUsers,
  });
}

export function useCreateAdminUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AdminRolesService.createAdminUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminRolesKeys.users() });
      toast.success("Admin user created successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to create admin user",
      );
    },
  });
}

export function useAssignRolesToUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, roles }: { id: number; roles: string[] }) =>
      AdminRolesService.assignRolesToUser(id, roles),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: adminRolesKeys.user(id) });
      queryClient.invalidateQueries({ queryKey: adminRolesKeys.users() });
      toast.success("Roles assigned successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to assign roles");
    },
  });
}

export function useDeleteAdminUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AdminRolesService.deleteAdminUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminRolesKeys.users() });
      toast.success("Admin user deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Cannot delete admin user");
    },
  });
}
