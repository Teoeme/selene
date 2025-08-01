export type UserRole = 'EMPLOYEE' | 'ADMIN';

export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type BenefitType = 'COURSE' | 'LICENSE' | 'MEAL' | 'COWORKING';


export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company: string;
  createdAt: Date;
}

export interface Benefit {
  id: string;
  name: string;
  description: string;
  type: BenefitType;
  company: Company;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Company {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BenefitRequest {
  id: string;
  benefitId: string;
  userId: string;
  title: string;
  reason: string;
  status: RequestStatus;
  company: string;
  createdAt: Date;
  updatedAt: Date;
  benefit?: Benefit;
  user?: User;
}


export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface CreateBenefitRequestData {
  benefitId: string;
  reason: string;
}


export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
} 