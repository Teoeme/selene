import { Benefit } from '../entities/Benefit';
import { BenefitType } from '../value-objects/BenefitType';
import { Repository } from './Repository';

export interface BenefitRepository extends Repository<Benefit> {
  findByCompany(company: string): Promise<Benefit[]>;
  findByType(type: BenefitType): Promise<Benefit[]>;
  findActive(): Promise<Benefit[]>;
} 