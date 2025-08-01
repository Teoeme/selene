import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { requestsService } from '../services/requestsService';
import { QUERY_KEYS } from '@/shared/constants';
import { useAuth } from '@/core/auth';
import type { CreateBenefitRequestData } from '../services/requestsService';

export const useBenefitRequests = (filters?: {
  status?: string;
  startDate?: string;
  endDate?: string;
}) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: [QUERY_KEYS.BENEFIT_REQUESTS, user?.id, filters],
    queryFn: () => requestsService.listBenefitRequests(filters),
    staleTime: 2 * 60 * 1000, // 2 minutos
    enabled: !!user?.id, // Solo ejecutar si hay usuario
  });
};

export const useCreateBenefitRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBenefitRequestData) => requestsService.createBenefitRequest(data),
    onSuccess: () => {
      // Invalidar las queries de solicitudes para refrescar la lista
      queryClient.invalidateQueries({ 
        queryKey: [QUERY_KEYS.BENEFIT_REQUESTS] 
      });
    },
  });
};

export const useApproveBenefitRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => requestsService.approveBenefitRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: [QUERY_KEYS.BENEFIT_REQUESTS] 
      });
    },
  });
};

export const useRejectBenefitRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => requestsService.rejectBenefitRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: [QUERY_KEYS.BENEFIT_REQUESTS] 
      });
    },
  });
}; 