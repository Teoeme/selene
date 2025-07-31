import { BenefitRequestRepository } from '../../domain/repositories/BenefitRequestRepository';
import { UserRepository } from '../../domain/repositories/UserRepository';

interface RejectBenefitUseCaseDependencies {
  userRepository: UserRepository;
  benefitRequestRepository: BenefitRequestRepository;
}

interface RejectBenefitUseCaseInput {
  requestId: string;
  adminId: string;
  reason: string;
}

export class RejectBenefitUseCase {
  private readonly userRepository: UserRepository;
  private readonly benefitRequestRepository: BenefitRequestRepository;

  constructor(dependencies: RejectBenefitUseCaseDependencies) {
    this.userRepository = dependencies.userRepository;
    this.benefitRequestRepository = dependencies.benefitRequestRepository;
  }

  async execute(input: RejectBenefitUseCaseInput): Promise<void> {
    const admin = await this.userRepository.findById(input.adminId);
    if (!admin) {
      throw new Error('Admin not found');
    }
    if (!admin.isAdmin()) {
      throw new Error('Only admins can reject requests');
    }

    const request = await this.benefitRequestRepository.findById(input.requestId);
    if (!request) {
      throw new Error('Benefit request not found');
    }

    if (!input.reason.trim()) {
      throw new Error('Rejection reason is required');
    }

    request.reject();

    await this.benefitRequestRepository.save(request);
  }
}
