import { Button } from '@/shared/components';
import { REQUEST_STATUS_LABELS, REQUEST_STATUS_COLORS } from '@/shared/constants';
import { useApproveBenefitRequest, useRejectBenefitRequest } from '../hooks/useRequests';
import type { RequestStatus } from '@/core/types';

interface AdminRequestsTableProps {
  requests: Array<{
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
  }>;
  isLoading: boolean;
}

export function AdminRequestsTable({ requests, isLoading }: AdminRequestsTableProps) {
  const approveMutation = useApproveBenefitRequest();
  const rejectMutation = useRejectBenefitRequest();

  const handleApprove = async (requestId: string) => {
    try {
      await approveMutation.mutateAsync(requestId);
    } catch (error) {
      console.error('Error al aprobar solicitud:', error);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await rejectMutation.mutateAsync(requestId);
    } catch (error) {
      console.error('Error al rechazar solicitud:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <p className="text-gray-500">No hay solicitudes para mostrar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto w-full ">
        <table className="!min-w-full divide-y divide-gray-200  overflow-y-auto table ">
          <thead className="bg-gray-50 ">
            <tr>
              <th className="header-table-cell">
                Fecha
              </th>
              <th className="header-table-cell">
                Empleado
              </th>
              <th className="header-table-cell">
                Beneficio
              </th>
              <th className="header-table-cell">
                Razón
              </th>
              <th className="header-table-cell">
                Estado
              </th>
              <th className="header-table-cell">
                Fecha de Decisión
              </th>
              <th className="header-table-cell">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200 align-top  " >
            {requests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-50  ">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(request.requestDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {request.employeeName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {request.benefitName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="max-w-xs truncate" title={request.reason}>
                    {request.reason}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${REQUEST_STATUS_COLORS[request.status as RequestStatus]}`}>
                    {REQUEST_STATUS_LABELS[request.status as RequestStatus]}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {request.resolutionDate ? formatDate(request.resolutionDate) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {request.status === 'PENDING' && (
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleApprove(request.id)}
                        size="sm"
                        variant="primary"
                        isLoading={approveMutation.isPending && approveMutation.variables === request.id}
                        disabled={approveMutation.isPending || rejectMutation.isPending}
                      >
                        Aprobar
                      </Button>
                      <Button
                        onClick={() => handleReject(request.id)}
                        size="sm"
                        variant="danger"
                        isLoading={rejectMutation.isPending && rejectMutation.variables === request.id}
                        disabled={approveMutation.isPending || rejectMutation.isPending}
                      >
                        Rechazar
                      </Button>
                    </div>
                  )}
                  {request.status !== 'PENDING' && (
                    <span className="text-gray-400 text-xs">
                      {request.status === 'APPROVED' ? 'Aprobada' : 'Rechazada'}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 