import axios from "axios";

// declare module "axios" {
//   export interface InternalAxiosRequestConfig {
//     _retry?: boolean;
//     _authType?: string;
//   }
// }

export const api = axios.create({
  baseURL: "",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
// api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
//   const authType = config.headers?.["x-auth-type"] as string;

//   if (authType && ["admin", "company", "employee"].includes(authType)) {
//     const token = tokenManager.getToken(authType as any);
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     // Store auth type for response interceptor
//     config._authType = authType;
//     // Remove the custom header
//     delete config.headers["x-auth-type"];
//   }

//   return config;
// });

// // Response interceptor for token refresh
// api.interceptors.response.use(
//   (response) => response,
//   async (error: AxiosError) => {
//     const originalRequest = error.config as InternalAxiosRequestConfig & {
//       _retry?: boolean;
//     };

//     // Handle token expiration
//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry &&
//       originalRequest._authType
//     ) {
//       originalRequest._retry = true;

//       const authType = originalRequest._authType;
//       const refreshToken = tokenManager.getRefreshToken(authType as any);

//       if (refreshToken) {
//         try {
//           // Attempt to refresh token
//           const response = await axios.post(
//             `${getBaseURL()}/auth/refresh`,
//             {
//               refresh_token: refreshToken,
//             },
//             {
//               headers: { "x-auth-type": authType },
//             },
//           );

//           const newToken = response.data.data?.token;
//           const newRefreshToken = response.data.data?.refresh_token;

//           if (newToken) {
//             // Update tokens
//             tokenManager.setToken(authType as any, newToken);
//             if (newRefreshToken) {
//               tokenManager.setRefreshToken(authType as any, newRefreshToken);
//             }

//             // Retry original request with new token
//             originalRequest.headers.Authorization = `Bearer ${newToken}`;
//             return api(originalRequest);
//           }
//         } catch (refreshError) {
//           // Refresh failed, clear tokens
//           tokenManager.clearTokens(authType as any);

//           // Redirect to login (will be handled by components)
//           if (typeof window !== "undefined") {
//             window.location.href = `/auth/${authType}/login`;
//           }
//         }
//       }
//     }

//     // Transform error for better handling
//     const errorResponse = error.response?.data || {
//       success: false,
//       message: error.message || "An error occurred",
//       status: error.response?.status || 500,
//       // errors: (error.response?.data as ApiResponse).errors ? (error.response?.data as ApiResponse).errors : null,
//     };

//     return Promise.reject(error);
//   },
// );
