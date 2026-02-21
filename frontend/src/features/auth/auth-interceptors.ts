import { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { authApi } from './api/auth-api';
import { BaseAPI } from '@/shared/lib/base-api';
import type { ApiError } from '@/shared/types/api';

// Token refresh state
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: string | null) => void;
  reject: (error: ApiError | AxiosError) => void;
}> = [];

/**
 * Process all queued requests after token refresh completes or fails
 */
const processQueue = (
  error: ApiError | AxiosError | null,
  token: string | null = null
) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

/**
 * Check if the request should skip token refresh
 */
const shouldSkipRefresh = (
  originalRequest:
    | (InternalAxiosRequestConfig & { _retry?: boolean })
    | undefined,
  statusCode: number | undefined
): boolean => {
  // Only attempt refresh for 401 errors on non-auth endpoints
  if (!originalRequest || statusCode !== 401 || originalRequest._retry) {
    return true;
  }

  // Don't refresh for auth-related endpoints to prevent infinite loops
  const authEndpoints = [
    '/users/refresh-token',
    '/users/login',
    '/users/register',
  ];
  return authEndpoints.some((endpoint) =>
    originalRequest.url?.includes(endpoint)
  );
};

/**
 * Format error response into ApiError structure
 */
const formatErrorResponse = (error: AxiosError): ApiError => {
  const apiError: ApiError = {
    message: 'An unexpected error occurred',
  };

  if (error.response?.data) {
    const errorData = error.response.data as {
      message?: string;
      errors?: Record<string, string[]>;
    };

    if (errorData.message) {
      apiError.message = errorData.message;
    }
    if (errorData.errors) {
      apiError.errors = errorData.errors;
    }
  } else if (error.message) {
    apiError.message = error.message;
  }

  return apiError;
};

/**
 * Attempt to refresh the access token using the refresh token cookie
 *
 * Flow:
 * 1. User makes request with expired/missing access token → 401
 * 2. This function attempts to get a new access token using the HTTP-only refresh token cookie
 * 3. If successful: retry original request with new token
 * 4. If failed: clear everything and redirect to login
 */
const attemptTokenRefresh = async (
  axiosInstance: ReturnType<typeof BaseAPI.getSharedInstance>,
  originalRequest: InternalAxiosRequestConfig & { _retry?: boolean },
  onAuthFailure: () => void
) => {
  originalRequest._retry = true; // Prevent infinite retry loops
  isRefreshing = true;

  try {
    const refreshResponse = await authApi.refreshToken();

    if (refreshResponse.accessToken) {
      authApi.setAuthToken(refreshResponse.accessToken);
      processQueue(null, refreshResponse.accessToken); // Retry all queued requests
      return axiosInstance(originalRequest); // Retry original request
    } else {
      throw new Error('Refresh token failed - invalid response');
    }
  } catch (refreshError) {
    // Both access token and refresh token are invalid - full logout
    const error = refreshError as ApiError | AxiosError;
    processQueue(error, null);
    authApi.setAuthToken(null);

    if (
      typeof window !== 'undefined' &&
      !window.location.pathname.includes('/login')
    ) {
      onAuthFailure(); // Clear cache and redirect to login
    }

    throw error;
  } finally {
    isRefreshing = false;
  }
};

/**
 * Setup axios interceptor for automatic token refresh on 401 errors
 */
export const setupAuthInterceptor = (onAuthFailure: () => void) => {
  const axiosInstance = BaseAPI.getSharedInstance();

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as
        | (InternalAxiosRequestConfig & { _retry?: boolean })
        | undefined;

      // Check if we should skip token refresh for this request
      if (shouldSkipRefresh(originalRequest, error.response?.status)) {
        return Promise.reject(formatErrorResponse(error));
      }

      // If already refreshing, queue this request
      if (isRefreshing && originalRequest) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      // Attempt to refresh the token (even if access token is missing)
      // The refresh token is in an HTTP-only cookie, so we should always try
      if (originalRequest) {
        try {
          return await attemptTokenRefresh(
            axiosInstance,
            originalRequest,
            onAuthFailure
          );
        } catch (refreshError) {
          // onAuthFailure was already called in attemptTokenRefresh if needed
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(formatErrorResponse(error));
    }
  );
};
