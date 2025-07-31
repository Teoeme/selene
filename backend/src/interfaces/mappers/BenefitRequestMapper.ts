import { BenefitRequest } from '../../domain/entities/BenefitRequest';
import { User } from '../../domain/entities/User';
import { Benefit } from '../../domain/entities/Benefit';
import { BenefitRequestResponse, BenefitRequestListItem } from '../schemas/BenefitRequestSchemas';

export class BenefitRequestMapper {
  
  /**
   * Transforma una entidad BenefitRequest a un DTO de respuesta completo
   */
  static toResponse(benefitRequest: BenefitRequest): BenefitRequestResponse {
    return {
      id: benefitRequest.getId(),
      benefitId: benefitRequest.getBenefit().getId(),
      benefitName: benefitRequest.getBenefit().getName(),
      employee: {
        id: benefitRequest.getEmployee().getId(),
        name: benefitRequest.getEmployee().getName(),
        email: benefitRequest.getEmployee().getEmail()
      },
      reason: benefitRequest.getReason(),
      status: benefitRequest.getStatus() as 'PENDING' | 'APPROVED' | 'REJECTED',
      requestDate: benefitRequest.getRequestDate(),
      resolutionDate: benefitRequest.getResolutionDate(),
      company: {
        id: benefitRequest.getCompany().getId(),
        name: benefitRequest.getCompany().getName()
      }
    };
  }

  /**
   * Transforma una entidad BenefitRequest a un DTO de lista (menos información)
   */
  static toListItem(benefitRequest: BenefitRequest): BenefitRequestListItem {
    return {
      id: benefitRequest.getId(),
      benefitName: benefitRequest.getBenefit().getName(),
      employeeName: benefitRequest.getEmployee().getName(),
      reason: benefitRequest.getReason(),
      status: benefitRequest.getStatus() as 'PENDING' | 'APPROVED' | 'REJECTED',
      requestDate: benefitRequest.getRequestDate(),
      resolutionDate: benefitRequest.getResolutionDate(),
      company: {
        id: benefitRequest.getCompany().getId(),
        name: benefitRequest.getCompany().getName()
      }
    };
  }

 
  static toCreateResponse(result: {
    id: string;
    benefit: Benefit;
    employee: User;
    reason: string;
    status: any;
    requestDate: Date;
    company: any;
  }): BenefitRequestResponse {
    return {
      id: result.id,
      benefitId: result.benefit.getId(),
      benefitName: result.benefit.getName(),
      employee: {
        id: result.employee.getId(),
        name: result.employee.getName(),
        email: result.employee.getEmail()
      },
      reason: result.reason,
      status: result.status as 'PENDING' | 'APPROVED' | 'REJECTED',
      requestDate: result.requestDate,
      resolutionDate: null, // es una nueva solicitud
      company: {
        id: result.company.getId(),
        name: result.company.getName()
      }
    };
  }

  /**
   * Transforma el resultado del ListBenefitRequestsUseCase a DTOs de lista
   */
  static toListItemsFromUseCase(requests: Array<{
    id: string;
    benefitName: string;
    employeeName: string;
    reason: string;
    status: any;
    requestDate: Date;
    resolutionDate: Date | null;
    company: any;
  }>): BenefitRequestListItem[] {
    return requests.map(request => ({
      id: request.id,
      benefitName: request.benefitName,
      employeeName: request.employeeName,
      reason: request.reason,
      status: request.status as 'PENDING' | 'APPROVED' | 'REJECTED',
      requestDate: request.requestDate,
      resolutionDate: request.resolutionDate,
      company: {
        id: request.company.getId(),
        name: request.company.getName()
      }
    }));
  }
} 