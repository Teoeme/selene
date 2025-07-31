import { QueryClient } from '@tanstack/react-query';


export const queryClient = new QueryClient();

export const queryKeys = {
  auth: {
    me: () => ['auth', 'me'] as const,
  },

  benefitRequests: {
    all: () => ['benefit-requests'] as const,
    list: (filters?: Record<string, unknown>) => 
      ['benefit-requests', 'list', filters] as const,
    detail: (id: string) => 
      ['benefit-requests', 'detail', id] as const,
    my: () => 
      ['benefit-requests', 'my'] as const,
  },
  
  benefits: {
    all: () => ['benefits'] as const,
    list: (filters?: Record<string, unknown>) => 
      ['benefits', 'list', filters] as const,
    detail: (id: string) => 
      ['benefits', 'detail', id] as const,
  },
} as const; 