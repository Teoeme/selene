import { BenefitRequest } from '../entities/BenefitRequest';
import { RequestStatus } from '../value-objects/RequestStatus';

export interface BenefitRequestRepository {
  findById(id: string): Promise<BenefitRequest | null>;
  findByEmployee(employeeId: string): Promise<BenefitRequest[]>;
  findByCompany(company: string): Promise<BenefitRequest[]>;
  findByStatus(status: RequestStatus): Promise<BenefitRequest[]>;
  save(request: BenefitRequest): Promise<void>;
} 