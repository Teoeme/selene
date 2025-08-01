import { BenefitRequestRepository, BenefitRequestQuery } from '../../domain/repositories/BenefitRequestRepository';
import { BenefitRequest } from '../../domain/entities/BenefitRequest';
import { Benefit } from '../../domain/entities/Benefit';
import { User } from '../../domain/entities/User';
import { Company } from '../../domain/entities/Company';
import { RequestStatus } from '../../domain/value-objects/RequestStatus';
import { BenefitType } from '../../domain/value-objects/BenefitType';
import { UserRole } from '../../domain/value-objects/UserRole';
import { BenefitRequestModel } from '../database/schemas/BenefitRequestSchema';

export class MongoBenefitRequestRepository implements BenefitRequestRepository {
  private toDomain(document: any): BenefitRequest {
    const benefit = document.benefitId && typeof document.benefitId === 'object'
      ? new Benefit(
          document.benefitId._id,
          document.benefitId.name,
          document.benefitId.description,
          document.benefitId.type as BenefitType,
          document.benefitId.isActive,
          new Company(document.benefitId.companyId, '', '', new Date(), new Date()),
          new Date(document.benefitId.createdAt),
          new Date(document.benefitId.updatedAt)
        )
      : new Benefit(
          document.benefitId,
          '', 
          '', 
          BenefitType.COURSE, 
          true, 
          new Company(document.companyId, '', '', new Date(), new Date()),
          new Date(),
          new Date()
        );

    const employee = document.employeeId && typeof document.employeeId === 'object'
      ? new User(
          document.employeeId._id,
          document.employeeId.email,
          document.employeeId.name,
          '', 
          document.employeeId.role as UserRole,
          new Company(document.employeeId.companyId, '', '', new Date(), new Date()),
          new Date(document.employeeId.createdAt),
          new Date(document.employeeId.updatedAt)
        )
      : new User(
          document.employeeId,
          '', 
          '', 
          '', 
          UserRole.EMPLOYEE, 
          new Company(document.companyId, '', '', new Date(), new Date()),
          new Date(),
          new Date()
        );

    const company = document.companyId && typeof document.companyId === 'object'
      ? new Company(
          document.companyId._id,
          document.companyId.name,
          document.companyId.description,
          new Date(document.companyId.createdAt),
          new Date(document.companyId.updatedAt)
        )
      : new Company(
          document.companyId,
          '', 
          '', 
          new Date(),
          new Date()
        );

    return new BenefitRequest(
      document._id,
      benefit,
      document.reason,
      document.status as RequestStatus,
      new Date(document.requestDate),
      document.resolutionDate ? new Date(document.resolutionDate) : null,
      employee,
      company,
      new Date(document.createdAt),
      new Date(document.updatedAt)
    );
  }

  private toDocument(request: BenefitRequest): any {
    return {
      _id: request.getId(),
      benefitId: request.getBenefit().getId(),
      reason: request.getReason(),
      status: request.getStatus(),
      requestDate: request.getRequestDate(),
      resolutionDate: request.getResolutionDate(),
      employeeId: request.getEmployee().getId(),
      companyId: request.getCompany().getId(),
      createdAt: request.getCreatedAt(),
      updatedAt: request.getUpdatedAt()
    };
  }

  async findById(id: string): Promise<BenefitRequest | null> {
    try {
      const document = await BenefitRequestModel.findById(id)
        .populate('benefitId')
        .populate('employeeId')
        .populate('companyId');
      if (!document) {
        return null;
      }
      return this.toDomain(document);
    } catch (error) {
      console.error('Error finding benefit request by id:', error);
      throw new Error('Error finding benefit request by id');
    }
  }

  async find(query?: BenefitRequestQuery): Promise<BenefitRequest[]> {
    try {
      const filter: any = {};

      if (query?.employeeId) {
        filter.employeeId = query.employeeId;
      }

      if (query?.status) {
        filter.status = query.status;
      }

      if (query?.companyId) {
        filter.companyId = query.companyId;
      }

      if (query?.startDate || query?.endDate) {
        filter.requestDate = {};
        if (query.startDate) {
          filter.requestDate.$gte = query.startDate;
        }
        if (query.endDate) {
          filter.requestDate.$lte = query.endDate;
        }
      }
      const documents = await BenefitRequestModel.find(filter)
        .populate('benefitId')
        .populate('employeeId')
        .populate('companyId')
        .sort({ requestDate: -1 });
      return documents.map(document => this.toDomain(document));
    } catch (error) {
      console.error('Error finding benefit requests:', error);
      throw new Error('Error finding benefit requests');
    }
  }

  async save(request: BenefitRequest): Promise<void> {
    try {
      const document = this.toDocument(request);
      await BenefitRequestModel.findByIdAndUpdate(
        request.getId(),
        document,
        { upsert: true, new: true }
      );
    } catch (error) {
      console.error('Error saving benefit request:', error);
      throw new Error('Error saving benefit request');
    }
  }

  async deleteAll(): Promise<void> {
    await BenefitRequestModel.deleteMany({});
  }
} 