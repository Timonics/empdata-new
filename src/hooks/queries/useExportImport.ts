import { useMutation } from '@tanstack/react-query';
import { ExportApiService, type ExportEntity, type ExportOptions } from '@/services/export.service';
import { ImportApiService, type ImportEntity } from '@/services/import.service';
import { toast } from 'sonner';

export function useExport() {
  return useMutation({
    mutationFn: async ({ entity, params }: { entity: ExportEntity; params: any }) => {
      let blob: Blob;
      switch (entity) {
        case 'company-registrations':
          blob = await ExportApiService.exportCompanyRegistrations(params);
          break;
        case 'employee-registrations':
          blob = await ExportApiService.exportEmployeeRegistrations(params);
          break;
        case 'individual-registrations':
          blob = await ExportApiService.exportIndividualRegistrations(params);
          break;
        case 'portal-employees':
          blob = await ExportApiService.exportPortalEmployees(params);
          break;
        default:
          throw new Error(`Unsupported entity: ${entity}`);
      }
      return blob;
    },
    onError: (error: any) => {
      toast.error(error.message || 'Export failed');
    },
  });
}

export function useBulkImport(entity: ImportEntity) {
  return useMutation({
    mutationFn: async ({ file, sendInvitations }: { file: File; sendInvitations?: boolean }) => {
      let result;
      switch (entity) {
        case 'company-registrations':
          result = await ImportApiService.bulkUploadCompanyRegistrations(file, sendInvitations);
          break;
        case 'employee-registrations':
          result = await ImportApiService.bulkUploadEmployeeRegistrations(file);
          break;
        default:
          throw new Error(`Bulk import not supported for ${entity}`);
      }
      return result;
    },
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || error.message || 'Import failed');
    },
  });
}