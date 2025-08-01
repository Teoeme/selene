import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Button } from '@/shared/components';
import { useCreateBenefitRequest } from '../hooks/useRequests';
import type { Benefit } from '@/core/types';

interface RequestBenefitModalProps {
  isOpen: boolean;
  onClose: () => void;
  benefit: Benefit;
}

export function RequestBenefitModal({ isOpen, onClose, benefit }: RequestBenefitModalProps) {
  const [reason, setReason] = useState('');
  const createRequestMutation = useCreateBenefitRequest();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason.trim()) {
      return;
    }

    try {
      await createRequestMutation.mutateAsync({
        benefitId: benefit.id,
        reason: reason.trim(),
      });
     
      setReason('');
      onClose();
    } catch (error) {
      console.error('Error al crear solicitud:', error);
    }
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <Dialog.Title className="text-lg font-semibold text-gray-900 mb-4">
            Solicitar Beneficio
          </Dialog.Title>

          <div className="mb-4">
            <h3 className="font-medium text-gray-700 mb-2">Beneficio seleccionado:</h3>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="font-semibold text-primary-600">{benefit.name}</p>
              <p className="text-sm text-gray-600">{benefit.type}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                Motivo de la solicitud *
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explica por qué necesitas este beneficio..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={4}
                required
                disabled={createRequestMutation.isPending}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={createRequestMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                isLoading={createRequestMutation.isPending}
                disabled={!reason.trim()}
              >
                Confirmar Solicitud
              </Button>
            </div>
          </form>

          {createRequestMutation.isError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">
                Error al crear la solicitud. Intenta nuevamente.
              </p>
            </div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 