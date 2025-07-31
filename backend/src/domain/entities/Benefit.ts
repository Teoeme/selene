import { BenefitType } from '../value-objects/BenefitType';
import { Company } from './Company';

export class Benefit {
  constructor(
    private readonly id: string,
    private readonly name: string,
    private readonly description: string,
    private readonly type: BenefitType,
    private readonly isActive: boolean,
    private readonly company: Company,
    private readonly createdAt: Date,
    private readonly updatedAt: Date
  ) {}

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getDescription(): string {
    return this.description;
  }

  public getType(): BenefitType {
    return this.type;
  }

  public isAvailable(): boolean {
    return this.isActive;
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

  public isCourse(): boolean {
    return this.type === BenefitType.COURSE;
  }

  public isLicense(): boolean {
    return this.type === BenefitType.LICENSE;
  }

  public isMeal(): boolean {
    return this.type === BenefitType.MEAL;
  }

  public isCoworking(): boolean {
    return this.type === BenefitType.COWORKING;
  }
} 