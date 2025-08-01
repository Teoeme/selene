import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/shared/constants';
import type { LoginRequest, LoginResponse, User } from '@/core/types';
import { setAuthToken } from '@/core/auth/cookies';


export const authService = { //hace uso del api client para hacer las peticiones de auth
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    
    if (!response.success) {
      throw new AuthError(response.message || 'Error en el login');
    }

    const token = response.data!.token;
    setAuthToken(token);

    //Obtener datos del usuario
    const user = await this.getCurrentUser();
    
    return {
      user,
      token
    };
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>(API_ENDPOINTS.AUTH.ME);
    
    if (!response.success) {
      throw new AuthError(response.message || 'Error al obtener usuario');
    }
    
    return response.data!;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.warn('Error en logout del backend:', error);
    }
  },
};

export class AuthError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateLoginForm = (email: string, password: string) => {
  const errors: Record<string, string> = {};
  
  if (!email.trim()) {
    errors.email = 'El email es requerido';
  } else if (!isValidEmail(email)) {
    errors.email = 'El email no es válido';
  }
  
  if (!password.trim()) {
    errors.password = 'La contraseña es requerida';
  } else if (password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres';
  }
  
  return errors;
}; 