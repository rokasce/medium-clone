// Common API response types
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  success: boolean;
}

// Auth types
export interface User {
  id: string;
  username: string;
  email: string;
  bio: string | null;
  image: string | null;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  isVerified: boolean;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UpdateProfileRequest {
  bio: string;
}

// Blog types

export interface CreateArticleRequest {
  title: string;
  content: string;
  subtitle?: string;
  isPublished?: boolean;
  tags: string[];
}

export interface UpdateArticleRequest {
  title?: string;
  content?: string;
  subtitle?: string;
  isPublished?: boolean;
  tags: string[];
}

export interface Tag {
  slug: string;
  title: string;
}

// Profiles DTOs
export interface ProfileResponse {
  id: string;
  userName: string;
  email: string;
  bio: string | null;
  image: string | null;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
}

export interface UserFollowResponse {
  id: string;
  userName: string;
  bio: string | null;
  image: string | null;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
