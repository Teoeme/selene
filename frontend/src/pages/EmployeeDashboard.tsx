import { BenefitCard } from '@/features/benefits';
import { RequestsHistory } from '@/features/requests';
import { useBenefits } from '@/features/benefits';
import { DashboardHeader } from '@/shared/components';

export function EmployeeDashboard() {

  const { data: benefits, isLoading: benefitsLoading, error: benefitsError } = useBenefits();

 

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100  mx-auto p-8">

      <DashboardHeader />

        {/* Catálogo de Beneficios */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Catálogo de Beneficios</h2>
          
          {benefitsLoading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          )}

          {benefitsError ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-700">
                Error al cargar los beneficios. Intenta nuevamente.
              </p>
            </div>
          ) : benefits && benefits.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit) => (
                <BenefitCard key={benefit.id} benefit={benefit} />
              ))}
            </div>
          ) : benefits && benefits.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">No hay beneficios disponibles en este momento.</p>
            </div>
          ) : null}
        </div>

        {/* Historial de Solicitudes */}
        <div className="mb-8">
          <RequestsHistory />
        </div>
      
    </div>
  );
} 