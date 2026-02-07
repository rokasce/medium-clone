import { BaseAPI } from '@/shared/lib/base-api';
import type {
  AuthResponse,
  RefreshTokenResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from '@/shared/types/api';

export class AuthAPI extends BaseAPI {
  async login(data: LoginRequest): Promise<AuthResponse> {
    return this.handleRequest(() =>
      this.axiosInstance.post<AuthResponse>('/users/login', data)
    );
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.handleRequest(() =>
      this.axiosInstance.post<AuthResponse>('/users/register', data)
    );
  }

  async logout(): Promise<void> {
    return this.handleRequest(() =>
      this.axiosInstance.post<void>('/users/logout')
    );
  }

  async refreshToken(): Promise<RefreshTokenResponse> {
    return this.handleRequest(() =>
      this.axiosInstance.post<RefreshTokenResponse>('/users/refresh-token')
    );
  }

  async getCurrentUser(): Promise<User> {
    return this.handleRequest(() =>
      this.axiosInstance.get<User>('/profile/me')
    );
  }

  // Token management methods
  public setAuthToken(token: string | null): void {
    this.setToken(token);
  }

  public getAuthToken(): string | null {
    return this.getToken();
  }
}

export const authApi = new AuthAPI();
