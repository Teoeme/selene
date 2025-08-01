import { useQuery } from '@tanstack/react-query';
import { benefitsService } from '../services/benefitsService';
import { QUERY_KEYS } from '@/shared/constants';
import { useAuth } from '@/core/auth';

export const useBenefits = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: [QUERY_KEYS.BENEFITS, user?.id],
    queryFn: benefitsService.listBenefits,
    staleTime: 5 * 60 * 1000, 
    enabled: !!user?.id, // Solo ejecutar si hay usuario
  });
};

