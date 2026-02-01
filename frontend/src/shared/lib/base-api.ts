import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import queryString from 'query-string';
import config from './config';

export class BaseAPI {
  private static sharedAxiosInstance: AxiosInstance | null = null;
  protected axiosInstance: AxiosInstance;

  constructor(baseURL: string = config.API_BASE_URL) {
    // Initialize shared instance if it doesn't exist
    if (!BaseAPI.sharedAxiosInstance) {
      BaseAPI.sharedAxiosInstance = this.createAxiosInstance(baseURL);
    }

    // All instances use the same shared axios instance
    this.axiosInstance = BaseAPI.sharedAxiosInstance;
  }

  private createAxiosInstance(baseURL: string): AxiosInstance {
    const instance = axios.create({
      baseURL,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 seconds
      paramsSerializer: (params) => {
        return queryString.stringify(params, { arrayFormat: 'none' });
      },
    });

    // Set up basic request interceptor for auth token
    instance.interceptors.request.use(
      (config) => {
        // Don't send Authorization header for refresh token endpoint
        // The backend JWT middleware will reject expired tokens
        if (config.url?.includes('/auth/refresh-token')) {
          return config;
        }

        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Note: Error handling interceptor is set up in auth-interceptors.ts
    // It must be the only response interceptor to properly handle 401 and token refresh

    return instance;
  }

  // Expose the shared instance for additional interceptor setup (like auth refresh)
  public static getSharedInstance(): AxiosInstance {
    if (!BaseAPI.sharedAxiosInstance) {
      // Initialize by creating a temporary instance
      new BaseAPI();
    }
    return BaseAPI.sharedAxiosInstance!;
  }

  protected getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  }

  protected setToken(token: string | null): void {
    if (typeof window === 'undefined') return;

    if (token) {
      localStorage.setItem('access_token', token);
    } else {
      localStorage.removeItem('access_token');
    }
  }

  protected async handleRequest<T>(
    request: () => Promise<AxiosResponse<T>>
  ): Promise<T> {
    try {
      const response = await request();
      return response.data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  public getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}
