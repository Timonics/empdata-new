import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProfileService } from "@/services/profile.service";
import { toast } from "sonner";
import type {
  UpdateProfileData,
  ChangePasswordData,
} from "@/types/profile.types";
import { tokenManager } from "@/lib/token-manager";

export const profileKeys = {
  all: ["profile"] as const,
  details: () => [...profileKeys.all, "details"] as const,
};

/**
 * Get current admin profile
 */
export function useProfile() {
  return useQuery({
    queryKey: profileKeys.details(),
    queryFn: async () => {
      const response = await ProfileService.getProfile();
      if (!response.success) {
        throw new Error("Failed to fetch profile");
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Update profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileData) => ProfileService.updateProfile(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Update tokenManager with new user data
        const currentUser = tokenManager.getUserData();
        if (currentUser) {
          tokenManager.setUserData({
            ...currentUser,
            ...response.data,
          });
        }

        toast.success("Profile updated successfully");
        queryClient.invalidateQueries({ queryKey: profileKeys.details() });
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update profile");
    },
  });
}

/**
 * Change password
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordData) =>
      ProfileService.changePassword(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Password changed successfully");
      } else {
        toast.error(response.message || "Failed to change password");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to change password");
    },
  });
}

/**
 * Upload avatar
 */
export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => ProfileService.uploadAvatar(file),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Update tokenManager with new avatar
        const currentUser = tokenManager.getUserData();
        if (currentUser) {
          tokenManager.setUserData({
            ...currentUser,
            avatar: response.data.avatar,
          });
        }

        toast.success("Avatar uploaded successfully");
        queryClient.invalidateQueries({ queryKey: profileKeys.details() });
      } else {
        toast.error(response.message || "Failed to upload avatar");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to upload avatar");
    },
  });
}

/**
 * Toggle 2FA
 */
export function useToggle2FA() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => ProfileService.toggle2FA(),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Update tokenManager with new 2FA status
        const currentUser = tokenManager.getUserData();
        if (currentUser) {
          tokenManager.setUserData({
            ...currentUser,
            two_factor_enabled: response.data.two_factor_enabled,
          });
        }

        toast.success(response.message || "2FA status updated");
        queryClient.invalidateQueries({ queryKey: profileKeys.details() });
      } else {
        toast.error(response.message || "Failed to toggle 2FA");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to toggle 2FA");
    },
  });
}
