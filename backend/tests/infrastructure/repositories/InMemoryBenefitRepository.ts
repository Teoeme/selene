import { BenefitRepository } from '../../../src/domain/repositories/BenefitRepository';
import { Benefit } from '../../../src/domain/entities/Benefit';
import { BenefitType } from '../../../src/domain/value-objects/BenefitType';

export class InMemoryBenefitRepository implements BenefitRepository {
  private benefits: Benefit[] = [];

  async findById(id: string): Promise<Benefit | null> {
    return this.benefits.find(b => b.getId() === id) || null;
  }

  async findByCompany(company: string): Promise<Benefit[]> {
    return this.benefits.filter(b => b.getCompany().getId() === company);
  }

  async findByType(type: BenefitType): Promise<Benefit[]> {
    return this.benefits.filter(b => b.getType() === type);
  }

  async findActive(): Promise<Benefit[]> {
    return this.benefits.filter(b => b.isAvailable());
  }

  async save(benefit: Benefit): Promise<void> {
    const index = this.benefits.findIndex(b => b.getId() === benefit.getId());
    if (index >= 0) {
      this.benefits[index] = benefit;
    } else {
      this.benefits.push(benefit);
    }
  }

  async deleteAll(): Promise<void> {
    this.benefits = [];
  }

  givenExistingBenefits(...benefits: Benefit[]): void {
    this.benefits = benefits;
  }
}
