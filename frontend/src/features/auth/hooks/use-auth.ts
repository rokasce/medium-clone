import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { toast } from 'sonner';
import { authApi } from '../api/auth-api';
import type {
  LoginRequest,
  RegisterRequest,
  ApiError,
} from '@/shared/types/api';

const AUTH_QUERY_KEY = 'auth-user';

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Check if there's an access token in localStorage
  const hasToken = !!authApi.getAuthToken();

  // Simple user query - the auth interceptor handles all token refresh logic
  // Only fetch if there's a token to avoid unnecessary 401s for unauthenticated users
  const userQuery = useQuery({
    queryKey: [AUTH_QUERY_KEY],
    queryFn: () => authApi.getCurrentUser(),
    enabled: hasToken, // Only fetch if we have a token
    retry: false, // Auth interceptor handles retries via token refresh
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      authApi.setAuthToken(response.accessToken);
      queryClient.setQueryData([AUTH_QUERY_KEY], response.user);
      toast.success('Welcome back!');
      router.navigate({ to: '/dashboard', search: { page: 1, pageSize: 8 } });
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Login failed');
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (response) => {
      authApi.setAuthToken(response.accessToken);
      queryClient.setQueryData([AUTH_QUERY_KEY], response.user);
      toast.success('Account created successfully!');
      router.navigate({ to: '/dashboard', search: { page: 1, pageSize: 8 } });
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Registration failed');
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onMutate: async () => {
      // Cancel all ongoing queries immediately when logout starts
      await queryClient.cancelQueries();
    },
    onSuccess: async () => {
      // Clear token first
      authApi.setAuthToken(null);
      // Clear the user query data immediately
      queryClient.setQueryData([AUTH_QUERY_KEY], null);
      // Clear all other queries
      queryClient.clear();
      // Clear persisted query cache from localStorage
      localStorage.removeItem('BLOG_QUERY_CACHE');
      toast.success('Logged out successfully');
      // Navigate to home with global feed and replace to prevent back button issues
      await router.navigate({
        to: '/',
        search: { feed: 'global' },
        replace: true,
      });
    },
    onError: async (error: ApiError) => {
      // Still clear local state even if logout fails
      authApi.setAuthToken(null);
      queryClient.setQueryData([AUTH_QUERY_KEY], null);
      queryClient.clear();
      // Clear persisted query cache from localStorage
      localStorage.removeItem('BLOG_QUERY_CACHE');
      await router.navigate({
        to: '/',
        search: { feed: 'global' },
        replace: true,
      });
      toast.error(error.message || 'Logout failed');
    },
  });

  return {
    // State
    user: userQuery.data,
    isAuthenticated: !!userQuery.data && !userQuery.isError,
    isLoading: userQuery.isLoading,

    // Actions
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,

    // Mutation states
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}
