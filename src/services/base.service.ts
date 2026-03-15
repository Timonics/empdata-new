import { api } from "@/lib/axios";
import { tokenManager } from "@/lib/token-manager";

export type ApiResponse<T = any> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
};

export class BaseService {
  protected static api = api;
  protected static tokenManager = tokenManager;

  // Safe environment access
  // protected static getEnv() {
  //   if (isServer) {
  //     return serverEnv;
  //   }
  //   return clientEnv;
  // }

  protected static handleError(error: any): never {
    console.error("API Error:", error);
    throw error;
  }

  protected static async get<T>(
    url: string,
    config?: any,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.get<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  protected static async post<T>(
    url: string,
    data?: any,
    config?: any,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.post<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  protected static async put<T>(
    url: string,
    data?: any,
    config?: any,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.put<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  protected static async delete<T>(
    url: string,
    config?: any,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.delete<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }
}
