import { useState } from 'react';
import { useBenefitRequests } from '@/features/requests';
import { RequestsFilters } from '@/features/requests/components/RequestsFilters';
import { AdminRequestsTable } from '@/features/requests/components/AdminRequestsTable';
import type { RequestsFilters as RequestsFiltersType } from '@/features/requests/components/RequestsFilters';
import { DashboardHeader } from '@/shared/components';

export function AdminDashboard() {
  const [filters, setFilters] = useState<RequestsFiltersType>({});
  
  const { data: requests, isLoading, error } = useBenefitRequests(filters);



  const handleFiltersChange = (newFilters: RequestsFiltersType) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader />

        {/* Filtros */}
        <RequestsFilters 
          onFiltersChange={handleFiltersChange}
          currentFilters={filters}
        />

        {/* Tabla de Solicitudes */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestión de Solicitudes</h2>
          
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <p className="text-red-700">
                Error al cargar las solicitudes. Intenta nuevamente.
              </p>
            </div>
          ) : (
            <AdminRequestsTable
              requests={requests || []}
              isLoading={isLoading}
            />
          )}
        </div>

      </div>
    </div>
  );
}