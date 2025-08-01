import { useState } from 'react';
import { Button } from '@/shared/components';
import { RequestBenefitModal } from '@/features/requests/components/RequestBenefitModal';
import { BENEFIT_TYPE_LABELS } from '@/shared/constants';
import type { Benefit } from '@/core/types';

interface BenefitCardProps {
  benefit: Benefit;
}

export function BenefitCard({ benefit }: BenefitCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRequestBenefit = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200 ">
        <div className="p-6 flex-1 h-[280px] flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {benefit.name}
              </h3>
              <span className="inline-block border border-primary-500 text-primary-500 px-2 from-primary-500 to-primary-600 text-xs font-medium rounded-full">
                {BENEFIT_TYPE_LABELS[benefit.type]}
              </span>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {benefit.description}
          </p>

          <div className="flex items-end justify-between flex-1 ">
            <div className="text-xs text-gray-500">
              {benefit.isActive ? (
                <span className="text-green-600 font-medium">Disponible</span>
              ) : (
                <span className="text-red-600 font-medium"> No disponible</span>
              )}
            </div>
            
            <Button
              onClick={handleRequestBenefit}
              disabled={!benefit.isActive}
              size="sm"
            >
              Solicitar Beneficio
            </Button>
          </div>
        </div>
      </div>

      <RequestBenefitModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        benefit={benefit}
      />
    </>
  );
} 