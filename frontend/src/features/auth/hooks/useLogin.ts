import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/core/auth';
import { authService } from '../services/authService';
import type { LoginRequest } from '@/core/types';


export function useLogin() {
  const { login: setAuthUser } = useAuth();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    
    onSuccess: (data) => {
      // Guardar usuario y token en el store
      setAuthUser(data.user, data.token);
    },
    
    onError: (error) => {
      console.error('Error en login:', error);
    },
  });
}


export function useLogout() {
  const { logout: clearAuth } = useAuth();

  return useMutation({
    mutationFn: () => authService.logout(),
    
    onSuccess: () => {
      // Limpiar estado de auth
      clearAuth();
    },
    
    onError: (error) => {
      // Incluso si falla en backend, limpiamos frontend
      console.warn('Error en logout:', error);
      clearAuth();
    },
  });
} 