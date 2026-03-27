import { api } from "@/lib/axios";
import type { Role, AdminUser, Permission } from "@/types/admin.types";

export class AdminRolesService {
  private static readonly BASE_PATH = "/api/admin";

  /**
   * Get current admin user with permissions
   */
  static async getCurrentAdmin() {
    const response = await api.get<{ success: boolean; data: AdminUser }>(
      `${this.BASE_PATH}/me`
    );

    return response.data;
  }

  /**
   * Get all permissions
   */
  static async getAllPermissions() {
    const response = await api.get<{ success: boolean; data: string[] }>(
      `${this.BASE_PATH}/permissions`
    );
    return response.data;
  }

  /**
   * Get all roles
   */
  static async getAllRoles() {
    const response = await api.get<{ success: boolean; data: Role[] }>(
      `${this.BASE_PATH}/roles`
    );
    return response.data;
  }

  /**
   * Get single role
   */
  static async getRole(id: number) {
    const response = await api.get<{ success: boolean; data: Role }>(
      `${this.BASE_PATH}/roles/${id}`
    );
    return response.data;
  }

  /**
   * Create custom role
   */
  static async createRole(payload: { name: string; permissions: string[] }) {
    const response = await api.post<{ success: boolean; data: Role }>(
      `${this.BASE_PATH}/roles`,
      payload
    );
    return response.data;
  }

  /**
   * Rename role
   */
  static async renameRole(id: number, name: string) {
    const response = await api.put<{ success: boolean; data: Role }>(
      `${this.BASE_PATH}/roles/${id}`,
      { name }
    );
    return response.data;
  }

  /**
   * Delete role
   */
  static async deleteRole(id: number) {
    const response = await api.delete<{ success: boolean; message: string }>(
      `${this.BASE_PATH}/roles/${id}`
    );
    return response.data;
  }

  /**
   * Sync role permissions
   */
  static async syncRolePermissions(id: number, permissions: string[]) {
    const response = await api.put<{ success: boolean; data: Role }>(
      `${this.BASE_PATH}/roles/${id}/permissions`,
      { permissions }
    );
    return response.data;
  }

  /**
   * Get all admin users
   */
  static async getAllAdminUsers() {
    const response = await api.get<{ success: boolean; data: AdminUser[] }>(
      `${this.BASE_PATH}/users`
    );
    return response.data;
  }

  /**
   * Get single admin user
   */
  static async getAdminUser(id: number) {
    const response = await api.get<{ success: boolean; data: AdminUser }>(
      `${this.BASE_PATH}/users/${id}`
    );
    return response.data;
  }

  /**
   * Create admin user
   */
  static async createAdminUser(payload: { name: string; email: string; roles: string[] }) {
    const response = await api.post<{ success: boolean; data: AdminUser }>(
      `${this.BASE_PATH}/users`,
      payload
    );
    return response.data;
  }

  /**
   * Update admin user
   */
  static async updateAdminUser(id: number, payload: { name?: string; email?: string }) {
    const response = await api.put<{ success: boolean; data: AdminUser }>(
      `${this.BASE_PATH}/users/${id}`,
      payload
    );
    return response.data;
  }

  /**
   * Delete admin user
   */
  static async deleteAdminUser(id: number) {
    const response = await api.delete<{ success: boolean; message: string }>(
      `${this.BASE_PATH}/users/${id}`
    );
    return response.data;
  }

  /**
   * Assign roles to admin user
   */
  static async assignRolesToUser(id: number, roles: string[]) {
    const response = await api.put<{ success: boolean; data: AdminUser }>(
      `${this.BASE_PATH}/users/${id}/roles`,
      { roles }
    );
    return response.data;
  }
}