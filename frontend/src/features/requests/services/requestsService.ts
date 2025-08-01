import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/shared/constants';

export interface CreateBenefitRequestData {
  benefitId: string;
  reason: string;
}

export interface CreateBenefitRequestResponse {
  id: string;
  benefit: {
    id: string;
    name: string;
    type: string;
  };
  employee: {
    id: string;
    name: string;
    email: string;
  };
  reason: string;
  status: string;
  requestDate: string;
  company: {
    id: string;
    name: string;
  };
}

export interface ListBenefitRequestsResponse {
    id: string;
    benefitName: string;
    employeeName: string;
    reason: string;
    status: string;
    requestDate: string;
    resolutionDate: string | null;
    company: {
      id: string;
      name: string;
    };
}

export class RequestsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RequestsError';
  }
}

export const requestsService = {
  async createBenefitRequest(data: CreateBenefitRequestData): Promise<CreateBenefitRequestResponse> {
    try {
      const response = await apiClient.post<CreateBenefitRequestResponse>(API_ENDPOINTS.BENEFIT_REQUESTS.CREATE, data);
      if (!response.data) {
        throw new RequestsError('Respuesta inválida del servidor');
      }
      return response.data;
    } catch (error) {
      throw new RequestsError('Error al crear la solicitud de beneficio');
    }
  },

  async listBenefitRequests(filters?: {
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ListBenefitRequestsResponse[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);

      const url = `${API_ENDPOINTS.BENEFIT_REQUESTS.LIST}${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await apiClient.get<ListBenefitRequestsResponse[]>(url);
      
      if (!response.data) {
        throw new RequestsError('Respuesta inválida del servidor');
      }
      return response.data;
    } catch (error) {
      throw new RequestsError('Error al cargar las solicitudes');
    }
  },

  async approveBenefitRequest(requestId: string): Promise<void> {
    try {
      await apiClient.patch(API_ENDPOINTS.BENEFIT_REQUESTS.APPROVE(requestId));
    } catch (error) {
      throw new RequestsError('Error al aprobar la solicitud');
    }
  },

  async rejectBenefitRequest(requestId: string): Promise<void> {
    try {
      await apiClient.patch(API_ENDPOINTS.BENEFIT_REQUESTS.REJECT(requestId));
    } catch (error) {
      throw new RequestsError('Error al rechazar la solicitud');
    }
  }
}; 