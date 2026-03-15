import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CompanyService } from "@/services/company.service";
import { toast } from "sonner";
import type {
  CompanyFilters,
  CreateCompanyData,
  UpdateCompanyData,
} from "@/types/company.types";

export const companyKeys = {
  all: ["companies"] as const,
  lists: () => [...companyKeys.all, "list"] as const,
  list: (filters?: CompanyFilters) =>
    [...companyKeys.lists(), { filters }] as const,
  details: () => [...companyKeys.all, "detail"] as const,
  detail: (id: number) => [...companyKeys.details(), id] as const,
};

/**
 * Get all companies with pagination and filters
 */
export function useCompanies(filters?: CompanyFilters) {
  return useQuery({
    queryKey: companyKeys.list(filters),
    queryFn: async () => {
      const response = await CompanyService.getCompanies(filters);
      if (!response.success) {
        throw new Error("Failed to fetch companies");
      }
      return response;
    },
  });
}

/**
 * Get single company by ID
 */
export function useCompany(id: number) {
  return useQuery({
    queryKey: companyKeys.detail(id),
    queryFn: async () => {
      const response = await CompanyService.getCompany(id);
      if (!response.success) {
        throw new Error("Failed to fetch company");
      }
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Create new company
 */
export function useCreateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCompanyData) => CompanyService.createCompany(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Company created successfully");
        queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
      } else {
        toast.error("Failed to create company");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create company");
    },
  });
}

/**
 * Update company
 */
export function useUpdateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCompanyData }) =>
      CompanyService.updateCompany(id, data),
    onSuccess: (response, variables) => {
      if (response.success) {
        toast.success("Company updated successfully");
        queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
        queryClient.invalidateQueries({
          queryKey: companyKeys.detail(variables.id),
        });
      } else {
        toast.error("Failed to update company");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update company");
    },
  });
}

/**
 * Delete company
 */
export function useDeleteCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => CompanyService.deleteCompany(id),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || "Company deleted successfully");
        queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
      } else {
        toast.error(response.message || "Failed to delete company");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete company");
    },
  });
}

/**
 * Export companies to CSV
 */
export function useExportCompanies() {
  return useMutation({
    mutationFn: (filters?: CompanyFilters) =>
      CompanyService.exportCompanies(filters),
    onSuccess: (data) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `companies-${new Date().toISOString().split("T")[0]}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Export completed successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to export companies");
    },
  });
}
