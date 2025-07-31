import Cookies from 'js-cookie';

const AUTH_TOKEN_KEY = 'auth-token';
const AUTH_USER_KEY = 'auth-user';

const COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
  sameSite: 'strict' as const,                   
  expires: 7,                                    // 7 días de expiración
} as const;


export const setAuthToken = (token: string): void => {
  Cookies.set(AUTH_TOKEN_KEY, token, COOKIE_OPTIONS);
};

export const getAuthToken = (): string | null => {
  return Cookies.get(AUTH_TOKEN_KEY) || null;
};

export const removeAuthToken = (): void => {
  Cookies.remove(AUTH_TOKEN_KEY);
};


export const setAuthUser = (user: object): void => {
  Cookies.set(AUTH_USER_KEY, JSON.stringify(user), COOKIE_OPTIONS);
};

export const getAuthUser = (): object | null => {
  const userData = Cookies.get(AUTH_USER_KEY);
  if (!userData) return null;
  
  try {
    return JSON.parse(userData);
  } catch {
    return null;
  }
};

export const removeAuthUser = (): void => {
  Cookies.remove(AUTH_USER_KEY);
};

export const clearAuthData = (): void => {
  removeAuthToken();
  removeAuthUser();
};


export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
}; 