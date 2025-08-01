import { apiClient } from '@/core/api/client';
import type { Benefit } from '@/core/types';
import { API_ENDPOINTS } from '@/shared/constants';

export class BenefitsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BenefitsError';
  }
}

export const benefitsService = {
  async listBenefits(): Promise<Benefit[]> {
    try {
      const response = await apiClient.get<Benefit[]>(API_ENDPOINTS.BENEFITS.LIST);
      if (!response?.data) {
        throw new BenefitsError('Respuesta inválida del servidor');
      }
      return response.data;
    } catch (error) {
      throw new BenefitsError('Error al cargar los beneficios');
    }
  },

}; 