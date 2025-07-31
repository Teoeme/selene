import { BenefitRepository } from '../../domain/repositories/BenefitRepository';
import { Benefit } from '../../domain/entities/Benefit';
import { Company } from '../../domain/entities/Company';
import { BenefitType } from '../../domain/value-objects/BenefitType';
import { BenefitModel } from '../database/schemas/BenefitSchema';

export class MongoBenefitRepository implements BenefitRepository {
  private toDomain(document: any): Benefit {

    const company = document.companyId && typeof document.companyId === 'object'
      ? new Company(
          document.companyId._id,
          document.companyId.name,
          document.companyId.description,
          new Date(document.companyId.createdAt),
          new Date(document.companyId.updatedAt)
        )
      : new Company(document.companyId, '', '', new Date(), new Date());

    return new Benefit(
      document._id,
      document.name,
      document.description,
      document.type as BenefitType,
      document.isActive,
      company,
      new Date(document.createdAt),
      new Date(document.updatedAt)
    );
  }

  private toDocument(benefit: Benefit): any {
    return {
      _id: benefit.getId(),
      name: benefit.getName(),
      description: benefit.getDescription(),
      type: benefit.getType(),
      isActive: benefit.isAvailable(),
      companyId: benefit.getCompany().getId(),
      createdAt: benefit.getCreatedAt(),
      updatedAt: benefit.getUpdatedAt()
    };
  }

  async findById(id: string): Promise<Benefit | null> {
    try {
      const document = await BenefitModel.findById(id).populate('companyId');
      if (!document) {
        return null;
      }
      return this.toDomain(document);
    } catch (error) {
      console.error('Error finding benefit by id:', error);
      throw new Error('Error finding benefit by id');
    }
  }

  async findByCompany(company: string): Promise<Benefit[]> {
    try {
      const documents = await BenefitModel.find({ companyId: company }).populate('companyId');
      return documents.map(document => this.toDomain(document));
    } catch (error) {
      console.error('Error finding benefits by company:', error);
      throw new Error('Error finding benefits by company');
    }
  }

  async findByType(type: BenefitType): Promise<Benefit[]> {
    try {
      const documents = await BenefitModel.find({ type }).populate('companyId');
      return documents.map(document => this.toDomain(document));
    } catch (error) {
      console.error('Error finding benefits by type:', error);
      throw new Error('Error finding benefits by type');
    }
  }

  async findActive(): Promise<Benefit[]> {
    try {
      const documents = await BenefitModel.find({ isActive: true }).populate('companyId');
      return documents.map(document => this.toDomain(document));
    } catch (error) {
      console.error('Error finding active benefits:', error);
      throw new Error('Error finding active benefits');
    }
  }

  async save(benefit: Benefit): Promise<void> {
    try {
      const document = this.toDocument(benefit);
      await BenefitModel.findByIdAndUpdate(
        benefit.getId(),
        document,
        { upsert: true, new: true }
      );
    } catch (error) {
      console.error('Error saving benefit:', error);
      throw new Error('Error saving benefit');
    }
  }

  async deleteAll(): Promise<void> {
    await BenefitModel.deleteMany({});
  }
} 