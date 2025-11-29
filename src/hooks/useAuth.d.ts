import React from 'react';

export interface AuthContextValue {
  user: any;
  token: string | null;
  loading: boolean;
  login: (credentials: any) => Promise<{ success: boolean; error?: any }>;
  logout: () => Promise<void>;
  refreshAuthState: () => boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export function useAuth(): AuthContextValue;
export const AuthProvider: React.FC<{ children?: React.ReactNode }>;

export default useAuth;
