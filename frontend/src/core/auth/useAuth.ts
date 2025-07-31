import { useAuthStore } from './store';
import { useEffect } from 'react';

export function useAuth() {
  const store = useAuthStore();
  
  useEffect(() => {
    store.initializeAuth();
  }, []);

  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    
    getToken: store.getToken,
    
    login: store.login,
    logout: store.logout,
    setUser: store.setUser,
    setLoading: store.setLoading,
    
    isAdmin: store.user?.role === 'ADMIN',
    isEmployee: store.user?.role === 'EMPLOYEE',
  };
}

export function useAuthUser() {
  return useAuthStore((state) => state.user);
}

export function useIsAuthenticated() {
  return useAuthStore((state) => state.isAuthenticated);
}

export function useAuthLoading() {
  return useAuthStore((state) => state.isLoading);
} 