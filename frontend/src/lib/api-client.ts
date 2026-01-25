import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import keycloak from '@/features/auth/keycloak';

interface RefreshQueueItem {
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}

class ApiClient {
  private static instance: AxiosInstance;
  private static isRefreshing = false;
  private static refreshQueue: RefreshQueueItem[] = [];

  static getInstance(): AxiosInstance {
    if (!this.instance) {
      this.instance = axios.create({
        baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
      });

      this.setupInterceptors();
    }
    return this.instance;
  }

  private static setupInterceptors() {
    // Request interceptor - add token
    this.instance.interceptors.request.use((config) => {
      if (keycloak.token) {
        config.headers.Authorization = `Bearer ${keycloak.token}`;
      }
      return config;
    });

    // Response interceptor - handle 401 with queue
    this.instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Queue the request while token is being refreshed
            return new Promise((resolve, reject) => {
              this.refreshQueue.push({ resolve, reject });
            }).then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return this.instance(originalRequest);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            await keycloak.updateToken(30);
            const newToken = keycloak.token!;

            // Process all queued requests with new token
            this.refreshQueue.forEach(({ resolve }) => resolve(newToken));
            this.refreshQueue = [];

            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.instance(originalRequest);
          } catch (refreshError) {
            // Token refresh failed - reject all queued requests
            this.refreshQueue.forEach(({ reject }) => reject(refreshError as Error));
            this.refreshQueue = [];
            keycloak.logout();
            throw refreshError;
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }
}

export const apiClient = ApiClient.getInstance();
