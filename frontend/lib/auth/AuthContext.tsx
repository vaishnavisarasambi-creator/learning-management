'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { authApi, setAccessToken } from '@/lib/api/client';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Changed to false

  // Don't check for existing session on mount - skip refresh
  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       const response = await authApi.refresh();
  //       setUser(response.data.user);
  //       setAccessToken(response.data.accessToken);
  //     } catch {
  //       // No valid session
  //       setUser(null);
  //       setAccessToken(null);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   checkAuth();
  // }, []);

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    setUser(response.data.user);
    setAccessToken(response.data.accessToken);
  };

  const register = async (email: string, password: string, name: string) => {
    const response = await authApi.register({ email, password, name });
    setUser(response.data.user);
    setAccessToken(response.data.accessToken);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      setAccessToken(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
