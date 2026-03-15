import { api } from "@/lib/axios";
import type { AdminProfile, UpdateProfileData, ChangePasswordData, ProfileResponse } from "@/types/profile.types";

export class ProfileService {
  private static readonly BASE_PATH = "/api/admin/profile";

  /**
   * Get current admin profile
   * GET /api/admin/profile
   */
  static async getProfile() {
    const response = await api.get<{ success: boolean; data: AdminProfile }>(
      this.BASE_PATH
    );
    return response.data;
  }

  /**
   * Update profile
   * PUT /api/admin/profile
   */
  static async updateProfile(data: UpdateProfileData) {
    const response = await api.put<ProfileResponse>(this.BASE_PATH, data);
    return response.data;
  }

  /**
   * Change password
   * POST /api/admin/profile/change-password
   */
  static async changePassword(data: ChangePasswordData) {
    const response = await api.post<ProfileResponse>(
      `${this.BASE_PATH}/change-password`,
      data
    );
    return response.data;
  }

  /**
   * Upload avatar
   * POST /api/admin/profile/avatar
   */
  static async uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.post<ProfileResponse>(
      `${this.BASE_PATH}/avatar`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  /**
   * Toggle 2FA
   * POST /api/admin/profile/toggle-2fa
   */
  static async toggle2FA() {
    const response = await api.post<ProfileResponse>(
      `${this.BASE_PATH}/toggle-2fa`
    );
    return response.data;
  }
}