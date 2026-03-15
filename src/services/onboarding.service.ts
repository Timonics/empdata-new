import { api } from '@/lib/axios';
import { 
  IndividualOnboardingData, 
  CompanyGroupLifeOnboardingData,
  EmployeeGroupLifeOnboardingData,
  OnboardingResponse,
  CompaniesResponse
} from '@/types/onboarding.types';

export class OnboardingService {
  private static readonly PUBLIC_BASE = '/api/public';

  /**
   * Get active companies for employee dropdown
   * GET /api/public/grouplife/companies
   */
  static async getActiveCompanies() {
    const response = await api.get<CompaniesResponse>(
      `${this.PUBLIC_BASE}/grouplife/companies`
    );
    return response.data;
  }

  /**
   * Submit company registration (for Group Life)
   * POST /api/public/grouplife/company/register
   */
  static async submitCompanyRegistration(formData: FormData) {
    const response = await api.post<OnboardingResponse>(
      `${this.PUBLIC_BASE}/grouplife/company/register`,
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
   * Submit employee registration (for Group Life under a company)
   * POST /api/public/grouplife/employee/register
   */
  static async submitEmployeeRegistration(formData: FormData) {
    const response = await api.post<OnboardingResponse>(
      `${this.PUBLIC_BASE}/grouplife/employee/register`,
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
   * Submit individual registration (for non-Group Life policies)
   * POST /api/public/individual/register
   */
  static async submitIndividualRegistration(formData: FormData) {
    const response = await api.post<OnboardingResponse>(
      `${this.PUBLIC_BASE}/individual/register`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }
}