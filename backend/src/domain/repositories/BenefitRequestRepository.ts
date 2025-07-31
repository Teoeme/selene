import { BenefitRequest } from '../entities/BenefitRequest';
import { RequestStatus } from '../value-objects/RequestStatus';
import { Repository } from './Repository';

export interface BenefitRequestQuery {
  employeeId?: string;
  status?: RequestStatus;
  companyId?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface BenefitRequestRepository extends Repository<BenefitRequest> {
  find(query?: BenefitRequestQuery): Promise<BenefitRequest[]>;
} 