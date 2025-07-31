
export const APP_NAME = 'Selene';
export const APP_DESCRIPTION = 'Sistema de Gestión de Beneficios';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  BENEFIT_REQUESTS: {
    LIST: '/benefit-requests',
    CREATE: '/benefit-requests',
    APPROVE: (id: string) => `/benefit-requests/${id}/approve`,
    REJECT: (id: string) => `/benefit-requests/${id}/reject`,
  },
  BENEFITS: {
    LIST: '/benefits',
    CREATE: '/benefits',
    UPDATE: (id: string) => `/benefits/${id}`,
    DELETE: (id: string) => `/benefits/${id}`,
  },
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  MY_REQUESTS: '/my-requests',
  CREATE_REQUEST: '/create-request',
  ADMIN: {
    REQUESTS: '/admin/requests',
    BENEFITS: '/admin/benefits',
  },
} as const;

export const BENEFIT_TYPE_LABELS = {
  COURSE: 'Curso',
  LICENSE: 'Licencia',
  MEAL: 'Vianda',
  COWORKING: 'Coworking',
} as const;

export const REQUEST_STATUS_LABELS = {
  PENDING: 'Pendiente',
  APPROVED: 'Aprobada',
  REJECTED: 'Rechazada',
} as const;

export const REQUEST_STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
} as const;

export const VALIDATION_MESSAGES = {
  REQUIRED: 'Este campo es requerido',
  EMAIL_INVALID: 'Email inválido',
  PASSWORD_MIN_LENGTH: 'La contraseña debe tener al menos 6 caracteres',
  REASON_MIN_LENGTH: 'La razón debe tener al menos 10 caracteres',
} as const;

export const QUERY_KEYS = {
  AUTH: ['auth'],
  BENEFIT_REQUESTS: ['benefit-requests'],
  BENEFITS: ['benefits'],
  MY_REQUESTS: ['my-requests'],
} as const;

// === Features Status ===

export const FEATURES_STATUS = {
  AUTH: {
    name: 'auth',
    description: 'Feature de autenticación y autorización',
    status: 'completed',
  },
  REQUESTS: {
    name: 'requests',
    description: 'Feature de gestión de solicitudes de beneficios',
    status: 'pending',
  },
  BENEFITS: {
    name: 'benefits',
    description: 'Feature de gestión de catálogo de beneficios (admin)',
    status: 'pending',
  },
} as const; 