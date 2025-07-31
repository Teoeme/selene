import { RequestStatus } from '../value-objects/RequestStatus';
import { User } from './User';
import { Benefit } from './Benefit';
import { Company } from './Company';

export class BenefitRequest {
  constructor(
    private readonly id: string,
    private readonly benefit: Benefit,
    private readonly reason: string,
    private status: RequestStatus,
    private readonly requestDate: Date,
    private resolutionDate: Date | null,
    private readonly employee: User,
    private readonly company: Company,
    private readonly createdAt: Date,
    private readonly updatedAt: Date
  ) {}

  public getId(): string {
    return this.id;
  }

  public getBenefit(): Benefit {
    return this.benefit;
  }

  public getReason(): string {
    return this.reason;
  }

  public getStatus(): RequestStatus {
    return this.status;
  }

  public getRequestDate(): Date {
    return this.requestDate;
  }

  public getResolutionDate(): Date | null {
    return this.resolutionDate;
  }

  public getEmployee(): User {
    return this.employee;
  }

  public getCompany(): Company {
    return this.company;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public approve(): void {
    if (this.status !== RequestStatus.PENDING) {
      throw new Error('Cannot approve a request that is not pending');
    }
    if (!this.benefit.isAvailable()) {
      throw new Error('Cannot approve a request for an inactive benefit');
    }
    this.status = RequestStatus.APPROVED;
    this.resolutionDate = new Date();
  }

  public reject(): void {
    if (this.status !== RequestStatus.PENDING) {
      throw new Error('Cannot reject a request that is not pending');
    }
    this.status = RequestStatus.REJECTED;
    this.resolutionDate = new Date();
  }

  public isPending(): boolean {
    return this.status === RequestStatus.PENDING;
  }

  public isApproved(): boolean {
    return this.status === RequestStatus.APPROVED;
  }

  public isRejected(): boolean {
    return this.status === RequestStatus.REJECTED;
  }
} 