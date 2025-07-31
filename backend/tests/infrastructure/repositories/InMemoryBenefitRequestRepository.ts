import { BenefitRequestQuery, BenefitRequestRepository } from '../../../src/domain/repositories/BenefitRequestRepository';
import { BenefitRequest } from '../../../src/domain/entities/BenefitRequest';
import { RequestStatus } from '../../../src/domain/value-objects/RequestStatus';

export class InMemoryBenefitRequestRepository implements BenefitRequestRepository {
  private requests: BenefitRequest[] = [];

  async findById(id: string): Promise<BenefitRequest | null> {
    return this.requests.find(r => r.getId() === id) || null;
  }

  async find(query?: BenefitRequestQuery): Promise<BenefitRequest[]> {
    return this.requests.filter(r => {
      if (query?.employeeId && r.getEmployee().getId() !== query.employeeId) return false;
      if (query?.status && r.getStatus() !== query.status) return false;
      if (query?.companyId && r.getCompany().getId() !== query.companyId) return false;
      if (query?.startDate && r.getRequestDate() < query.startDate) return false;
      if (query?.endDate && r.getRequestDate() > query.endDate) return false;
      return true;
    });
  }

  async save(request: BenefitRequest): Promise<void> {
    const index = this.requests.findIndex(r => r.getId() === request.getId());
    if (index >= 0) {
      this.requests[index] = request;
    } else {
      this.requests.push(request);
    }
  }

  async deleteAll(): Promise<void> {
    this.requests = [];
  }

  reset(): void {
    this.requests = [];
  }

  givenExistingRequests(...requests: BenefitRequest[]): void {
    this.requests = requests;
  }
}
