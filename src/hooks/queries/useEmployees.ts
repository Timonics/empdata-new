import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PortalEmployeeService } from '@/services/employee.service';
import { toast } from 'sonner';
import type { EmployeeFilters, CreateEmployeeData, SubmitNINData, BeneficiariesData } from '@/types/employee.types';

export const employeeKeys = {
  all: ['portal-employees'] as const,
  lists: () => [...employeeKeys.all, 'list'] as const,
  list: (filters?: EmployeeFilters) => [...employeeKeys.lists(), { filters }] as const,
  details: () => [...employeeKeys.all, 'detail'] as const,
  detail: (id: number) => [...employeeKeys.details(), id] as const,
  beneficiaries: (id: number) => [...employeeKeys.all, 'beneficiaries', id] as const,
};

/**
 * Get employees list (for company dashboard)
 */
export function useEmployees(filters?: EmployeeFilters) {
  return useQuery({
    queryKey: employeeKeys.list(filters),
    queryFn: async () => {
      const response = await PortalEmployeeService.getEmployees(filters);
      if (!response.success) {
        throw new Error('Failed to fetch employees');
      }
      return response;
    },
  });
}

/**
 * Get single employee details
 */
export function useEmployee(id: number) {
  return useQuery({
    queryKey: employeeKeys.detail(id),
    queryFn: async () => {
      const response = await PortalEmployeeService.getEmployee(id);
      if (!response.success) {
        throw new Error('Failed to fetch employee');
      }
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Create new employee
 */
export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEmployeeData) => 
      PortalEmployeeService.createEmployee(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Employee created successfully');
        queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      } else {
        toast.error('Failed to create employee');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create employee');
    },
  });
}

/**
 * Update employee
 */
export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateEmployeeData> }) =>
      PortalEmployeeService.updateEmployee(id, data),
    onSuccess: (response, variables) => {
      if (response.success) {
        toast.success('Employee updated successfully');
        queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
        queryClient.invalidateQueries({ queryKey: employeeKeys.detail(variables.id) });
      } else {
        toast.error('Failed to update employee');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update employee');
    },
  });
}

/**
 * Delete employee
 */
export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => PortalEmployeeService.deleteEmployee(id),
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Employee deleted successfully');
        queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      } else {
        toast.error('Failed to delete employee');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete employee');
    },
  });
}

/**
 * Submit NIN for verification
 */
export function useSubmitNIN() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: SubmitNINData }) =>
      PortalEmployeeService.submitNIN(id, data),
    onSuccess: (response, variables) => {
      if (response.success) {
        toast.success('NIN submitted successfully');
        queryClient.invalidateQueries({ queryKey: employeeKeys.detail(variables.id) });
      } else {
        toast.error('Failed to submit NIN');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit NIN');
    },
  });
}

/**
 * Get beneficiaries
 */
export function useBeneficiaries(id: number) {
  return useQuery({
    queryKey: employeeKeys.beneficiaries(id),
    queryFn: async () => {
      const response = await PortalEmployeeService.getBeneficiaries(id);
      if (!response.success) {
        throw new Error('Failed to fetch beneficiaries');
      }
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Save beneficiaries
 */
export function useSaveBeneficiaries() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: BeneficiariesData }) =>
      PortalEmployeeService.saveBeneficiaries(id, data),
    onSuccess: (response, variables) => {
      if (response.success) {
        toast.success('Beneficiaries saved successfully');
        queryClient.invalidateQueries({ queryKey: employeeKeys.beneficiaries(variables.id) });
        queryClient.invalidateQueries({ queryKey: employeeKeys.detail(variables.id) });
      } else {
        toast.error('Failed to save beneficiaries');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to save beneficiaries');
    },
  });
}

/**
 * Export employees to CSV
 */
export function useExportEmployees() {
  return useMutation({
    mutationFn: (filters?: Omit<EmployeeFilters, 'page' | 'per_page'>) =>
      PortalEmployeeService.exportEmployees(filters),
    onSuccess: (data) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Extract filename from Content-Disposition or use default
      const filename = `employees-${new Date().toISOString().split('T')[0]}.csv`;
      link.setAttribute('download', filename);
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Employees exported successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to export employees');
    },
  });
}