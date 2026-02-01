import React from 'react';
import { Navigate } from '@tanstack/react-router';
import { useAuth } from '../providers/auth-provider';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export function AuthGuard({
  children,
  requireAuth = true,
  redirectTo = '/login',
  fallback,
}: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )
    );
  }

  // If auth is required but user is not authenticated, redirect
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // If no auth is required but user is authenticated, optionally redirect
  if (!requireAuth && isAuthenticated && redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
