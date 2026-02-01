import React, { createContext, useContext, type ReactNode } from 'react';
import { useAuth as useAuthHook } from '../hooks/use-auth';
import type { User } from '@/shared/types/api';

interface AuthContextType {
  user: User | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => void;
  register: (
    username: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => void;
  logout: () => void;
  isLoggingIn: boolean;
  isRegistering: boolean;
  isLoggingOut: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const auth = useAuthHook();

  const contextValue: AuthContextType = {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    login: (email: string, password: string) => auth.login({ email, password }),
    register: (
      username: string,
      email: string,
      password: string,
      confirmPassword: string
    ) => auth.register({ username, email, password, confirmPassword }),
    logout: auth.logout,
    isLoggingIn: auth.isLoggingIn,
    isRegistering: auth.isRegistering,
    isLoggingOut: auth.isLoggingOut,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
