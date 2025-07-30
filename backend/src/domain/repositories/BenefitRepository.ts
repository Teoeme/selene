import { Benefit } from '../entities/Benefit';
import { BenefitType } from '../value-objects/BenefitType';

export interface BenefitRepository {
  findById(id: string): Promise<Benefit | null>;
  findByCompany(company: string): Promise<Benefit[]>;
  findByType(type: BenefitType): Promise<Benefit[]>;
  findActive(): Promise<Benefit[]>;
  save(benefit: Benefit): Promise<void>;
} 