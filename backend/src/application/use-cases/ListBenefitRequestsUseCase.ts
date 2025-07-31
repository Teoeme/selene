import { BenefitRequest } from '../../domain/entities/BenefitRequest';
import { RequestStatus } from '../../domain/value-objects/RequestStatus';
import { BenefitRequestQuery, BenefitRequestRepository } from '../../domain/repositories/BenefitRequestRepository';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { Company } from '../../domain/entities/Company';

interface ListBenefitRequestsUseCaseDependencies {
  userRepository: UserRepository;
  benefitRequestRepository: BenefitRequestRepository;
}

interface ListBenefitRequestsUseCaseInput {
  userId: string;
  status?: RequestStatus;
  startDate?: Date;
  endDate?: Date;
}

interface ListBenefitRequestsUseCaseOutput {
  requests: Array<{
    id: string;
    benefitName: string;
    employeeName: string;
    reason: string;
    status: RequestStatus;
    requestDate: Date;
    resolutionDate: Date | null;
    company: Company;
  }>;
}

export class ListBenefitRequestsUseCase {
  private readonly userRepository: UserRepository;
  private readonly benefitRequestRepository: BenefitRequestRepository;

  constructor(dependencies: ListBenefitRequestsUseCaseDependencies) {
    this.userRepository = dependencies.userRepository;
    this.benefitRequestRepository = dependencies.benefitRequestRepository;
  }

  async execute(input: ListBenefitRequestsUseCaseInput): Promise<ListBenefitRequestsUseCaseOutput> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new Error('User not found');
    }
    const companyId = user.getCompany().getId();


    let query: BenefitRequestQuery = {};
    
    if (user.isAdmin()) {
      // Los admins ven todas las solicitudes de su empresa
      query.companyId = companyId;
    } else {
      // Los empleados solo ven sus propias solicitudes
      query.employeeId = user.getId();
    }
    
    if (input.status) {
      query.status = input.status;
    }
 
    if (input.startDate) {
      query.startDate = input.startDate;
    }

    if (input.endDate) {
      query.endDate = input.endDate;
    }

    const requests = await this.benefitRequestRepository.find(query);

    return {
      requests: requests.map(request => ({
        id: request.getId(),
        benefitName: request.getBenefit().getName(),
        employeeName: request.getEmployee().getName(),
        reason: request.getReason(),
        status: request.getStatus(),
        requestDate: request.getRequestDate(),
        resolutionDate: request.getResolutionDate(),
        company: request.getCompany(),
      })),
    };
  }
}
