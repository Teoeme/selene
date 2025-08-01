import { BenefitRequest } from '../../domain/entities/BenefitRequest';
import { Benefit } from '../../domain/entities/Benefit';
import { User } from '../../domain/entities/User';
import { BenefitRepository } from '../../domain/repositories/BenefitRepository';
import { BenefitRequestRepository } from '../../domain/repositories/BenefitRequestRepository';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { RequestStatus } from '../../domain/value-objects/RequestStatus';
import { Company } from '../../domain/entities/Company';
import crypto from 'crypto';

interface RequestBenefitUseCaseDependencies {
  benefitRepository: BenefitRepository;
  userRepository: UserRepository;
  benefitRequestRepository: BenefitRequestRepository;
}

interface RequestBenefitUseCaseInput {
  benefitId: string;
  userId: string;
  reason: string;
}

interface RequestBenefitUseCaseOutput {
  id: string;
  benefit: Benefit;
  employee: User;
  reason: string;
  status: RequestStatus;
  requestDate: Date;
  company: Company;
}

export class RequestBenefitUseCase {
  private readonly benefitRepository: BenefitRepository;
  private readonly userRepository: UserRepository;
  private readonly benefitRequestRepository: BenefitRequestRepository;

  constructor(dependencies: RequestBenefitUseCaseDependencies) {
    this.benefitRepository = dependencies.benefitRepository;
    this.userRepository = dependencies.userRepository;
    this.benefitRequestRepository = dependencies.benefitRequestRepository;
  }

  async execute(input: RequestBenefitUseCaseInput): Promise<RequestBenefitUseCaseOutput> {
    const benefit = await this.benefitRepository.findById(input.benefitId);
    if (!benefit) {
      throw new Error('Benefit not found');
    }
    if (!benefit.isAvailable()) {
      throw new Error('Benefit is not available');
    }

    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new Error('User not found');
    }
    if (!user.isEmployee()) {
      throw new Error('Only employees can request benefits');
    }

    const benefitRequest = new BenefitRequest(
      crypto.randomUUID(), // Por simplicidad se usa un generador de ids acoplado, ver decisiones.md
      benefit,
      input.reason,
      RequestStatus.PENDING,
      new Date(),
      null,
      user,
      user.getCompany(),
      new Date(),
      new Date(),
    );

    await this.benefitRequestRepository.save(benefitRequest);

    return {
      id: benefitRequest.getId(),
      benefit: benefitRequest.getBenefit(),
      employee: benefitRequest.getEmployee(),
      reason: benefitRequest.getReason(),
      status: benefitRequest.getStatus(),
      requestDate: benefitRequest.getRequestDate(),
      company: benefitRequest.getCompany(),
    };
  }
}
