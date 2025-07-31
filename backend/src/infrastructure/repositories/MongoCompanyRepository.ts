import { CompanyRepository } from '../../domain/repositories/CompanyRepository';
import { Company } from '../../domain/entities/Company';
import { CompanyModel } from '../database/schemas/CompanySchema';

export class MongoCompanyRepository implements CompanyRepository {
  private toDomain(document: any): Company {
    return new Company(
      document.id,
      document.name,
      document.description,
      new Date(document.createdAt),
      new Date(document.updatedAt)
    );
  }

  private toDocument(company: Company): any {
    return {
      _id: company.getId(),
      name: company.getName(),
      description: company.getDescription(),
      createdAt: company.getCreatedAt(),
      updatedAt: company.getUpdatedAt()
    };
  }

  async findById(id: string): Promise<Company | null> {
    try {
      const document = await CompanyModel.findById(id);
      if (!document) {
        return null;
      }
      return this.toDomain(document);
    } catch (error) {
      console.error('Error finding company by id:', error);
      throw new Error('Error finding company by id');
    }
  }

  async save(company: Company): Promise<void> {
    try {
      const document = this.toDocument(company);
      await CompanyModel.findByIdAndUpdate(
         company.getId() ,
        document,
        { upsert: true, new: true }
      );
    } catch (error) {
      console.error('Error saving company:', error);
      throw new Error('Error saving company');
    }
  }

  async deleteAll(): Promise<void> {
    await CompanyModel.deleteMany({});
  }
} 